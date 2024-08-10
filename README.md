### first create a vite project using this command

```
 npm create vite@latest ./
```

### then update this tsconfig.json

```
 {
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@convex/*": ["./convex/*"]
    }
  }
}
```
### then update this tsconfig.app.json

```
 {
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src", "convex"]
}
```






###  step-1 create convex/auth.config.ts

get this domain " ",  from clerk's Jwt token and copy and save setting 

```
 export default {
    providers: [
      {
        domain: "https://devoted-gorilla-16.clerk.accounts.dev/",
        applicationID: "convex",
      },
    ]
  };
```


### step-2 and this convex/clerk.ts 

```
 "use node";

import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { v } from "convex/values";

import { Webhook } from "svix";

import { internalAction } from "./_generated/server";

const WEB_HOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET as string;

export const fulfill = internalAction({
	args: {
		headers: v.any(),
		payload: v.string(),
	},
	handler: async (ctx, args) => {
		const wh = new Webhook(WEB_HOOK_SECRET);
		const payload = wh.verify(args.payload, args.headers) as WebhookEvent;
		return payload;
	},
});

// https://docs.convex.dev/functions/internal-functions
```

### step-3 add this  convex/http.ts

```
 import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const payloadString = await req.text();
    const headerPayload = req.headers;

    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-signature": headerPayload.get("svix-signature")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
        },
      });

      switch (result.type) {
        case "user.created":
        case "user.updated":
          await ctx.runMutation(internal.users.upsertUser, {
            tokenIdentifier: `${process.env.CLERK_APP_DOMAIN}|${result.data.id}`,
            email: result.data.email_addresses[0]?.email_address ?? "",
            name: `${result.data.first_name ?? "Guest"} ${result.data.last_name ?? ""}`,
            image: result.data.image_url ?? "",
          });
          break;
        case "session.created":
          await ctx.runMutation(internal.users.setUserOnline, {
            tokenIdentifier: `${process.env.CLERK_APP_DOMAIN}|${result.data.user_id}`,
          });
          break;
        case "session.ended":
          await ctx.runMutation(internal.users.setUserOffline, {
            tokenIdentifier: `${process.env.CLERK_APP_DOMAIN}|${result.data.user_id}`,
          });
          break;
      }

      return new Response(null, {
        status: 200,
      });
    } catch (error) {
      console.log("Webhook Error🔥🔥", error);
      return new Response("Webhook Error", {
        status: 400,
      });
    }
  }),
});

export default http;
```

### add this in convex/schema.ts

```
// schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.string(),
    image: v.string(),
    tokenIdentifier: v.string(),
    isOnline: v.boolean(),
    isAdmin: v.optional(v.boolean()),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
});

```
### add this in convex/users.ts

```
// users.ts
import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const upsertUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    email: v.string(),
    name: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .unique();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        name: args.name,
        email: args.email,
        image: args.image,
        isOnline: true,
      });
      return { userId: existingUser._id, isAdmin: existingUser.isAdmin };
    } else {
      // Create new user
      const userId = await ctx.db.insert("users", {
        tokenIdentifier: args.tokenIdentifier,
        email: args.email,
        name: args.name,
        image: args.image,
        isOnline: true,
        isAdmin: false, // Default new users to non-admin
      });
      return { userId, isAdmin: false };
    }
  },
});

export const updateUser = internalMutation({
  args: { tokenIdentifier: v.string(), image: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      image: args.image,
    });
  },
});

export const setUserOnline = internalMutation({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, { isOnline: true });
  },
});

export const setUserOffline = internalMutation({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, { isOnline: false });
  },
});

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    try {
      // Wrap the logic in a transaction to avoid race conditions
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) =>
          q.eq("tokenIdentifier", identity.tokenIdentifier)
        )
        .unique();

      if (existingUser) {
        // Update existing user
        await ctx.db.patch(existingUser._id, {
          name: identity.name ?? existingUser.name,
          email: identity.email ?? existingUser.email,
          image: identity.pictureUrl ?? existingUser.image,
          isOnline: true,
        });
        return { userId: existingUser._id, isAdmin: existingUser.isAdmin };
      } else {
        // Create new user
        const userId = await ctx.db.insert("users", {
          tokenIdentifier: identity.tokenIdentifier,
          email: identity.email ?? "",
          name: identity.name ?? "",
          image: identity.pictureUrl ?? "",
          isOnline: true,
          isAdmin: false, // Default new users to non-admin
        });
        return { userId, isAdmin: false };
      }
    } catch (error) {
      // Handle potential errors, such as uniqueness constraint violations
      console.error("Error storing user:", error);
      throw new Error("Failed to store user");
    }
  },
});

export function isAdmin(user: any): boolean {
  return user?.isAdmin ?? false;
}

```
### add this in utlis/auth-status.ts

```
import { useUser } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { Id } from "@convex/_generated/dataModel";
import { api } from "@convex/_generated/api";


export function useStoreUserEffect() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    async function createUser() {
      const { userId, isAdmin } = await storeUser();
      setUserId(userId);
      setIsAdmin(isAdmin!);
    }

    createUser();
    return () => {
      setUserId(null);
      setIsAdmin(false);
    };
  }, [isAuthenticated, storeUser, user?.id]);

  return {
    isLoading: isLoading || (isAuthenticated && userId === null),
    isAuthenticated: isAuthenticated && userId !== null,
    isAdmin,
  };
}

```
### add this in convex/main.ts

```
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey="pk_test_...">
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <App />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </React.StrictMode>,
);

```
