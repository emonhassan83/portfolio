import { redirect } from "next/navigation";

// Public sign-up is disabled; accounts are created by an admin.
export default function Register() {
  redirect("/dashboard/login");
}
