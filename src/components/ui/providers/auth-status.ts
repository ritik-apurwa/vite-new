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