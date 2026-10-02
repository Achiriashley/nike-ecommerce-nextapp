import { redirect } from "next/navigation";

export default function Registration() {
  redirect("/auth/signup");
}
