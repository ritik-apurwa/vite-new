import { useUser } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Id } from "@convex/_generated/dataModel";
import { api } from "@convex/_generated/api";


export function useStoreUserEffect() {
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const storeUser = useMutation(api.users.store);
  const isAdminQuery = useQuery(api.users.isAdmin, user?.emailAddresses[0]?.emailAddress ? { email: user.emailAddresses[0].emailAddress } : "skip");

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setUserId(null);
      return;
    }

    async function createOrUpdateUser() {
      const { userId } = await storeUser();
      setUserId(userId);
    }

    createOrUpdateUser();
  }, [isAuthenticated, storeUser, user]);

  return {
    isLoading: isAuthLoading || (isAuthenticated && userId === null),
    isAuthenticated: isAuthenticated && userId !== null,
    isAdmin: isAdminQuery ?? false,
    userId,
  };
}