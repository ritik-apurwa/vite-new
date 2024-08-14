import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useUser,
} from "@clerk/clerk-react";

const test = () => {
  const { user } = useUser();

  return (
    <div>
      <SignedIn>
        <SignOutButton />
      </SignedIn>

      <SignedOut>
        <SignInButton />
      </SignedOut>
    </div>
  );
};

export default test;
