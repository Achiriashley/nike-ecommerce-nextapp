import { SignIn } from "@clerk/nextjs";
import AuthShell from "@/components/layout/AuthShell";
import { clerkAppearance } from "@/components/layout/clerkAppearance";

export const metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to see your orders and reviews.">
      <SignIn path="/auth/signin" routing="path" signUpUrl="/auth/signup" appearance={clerkAppearance} />
    </AuthShell>
  );
}
