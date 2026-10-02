import { redirect } from "next/navigation";

export default function Form() {
  redirect("/auth/signin");
}
