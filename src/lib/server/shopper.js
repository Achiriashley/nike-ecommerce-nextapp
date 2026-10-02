import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";

// The signed-in Clerk user, or null. Never throws, so guest flows keep working.
export const getShopper = async () => {
  try {
    const { userId } = await auth();
    if (!userId) return null;
    const user = await currentUser();
    return {
      userId,
      email: user?.primaryEmailAddress?.emailAddress ?? null,
      name: [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.username || "Customer",
      image: user?.imageUrl ?? null,
    };
  } catch (error) {
    console.error("Could not read Clerk session:", error.message);
    return null;
  }
};
