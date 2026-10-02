import { SignUp } from "@clerk/nextjs";
import AuthShell from "@/components/layout/AuthShell";
import { clerkAppearance } from "@/components/layout/clerkAppearance";

export const metadata = { title: "Create account" };

export default function SignUpPage() {
  return (
    <AuthShell title="Create your account" subtitle="It takes less than a minute.">
      <SignUp path="/auth/signup" routing="path" signInUrl="/auth/signin" appearance={clerkAppearance} />
    </AuthShell>
  );
}
