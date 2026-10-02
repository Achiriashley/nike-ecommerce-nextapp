// Matches Clerk's hosted components to the store's design tokens.
export const clerkAppearance = {
  variables: {
    colorPrimary: "#111111",
    colorText: "#111111",
    colorTextSecondary: "#5c5c5c",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-geist-sans)",
  },
  elements: {
    rootBox: "w-full max-w-[420px]",
    cardBox: "w-full shadow-none border border-neutral-200 rounded-2xl",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    formButtonPrimary: "rounded-full h-11 text-sm font-semibold normal-case",
    socialButtonsBlockButton: "rounded-full h-11",
    formFieldInput: "h-11 rounded-lg",
  },
};
