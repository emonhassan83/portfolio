import { redirect } from "next/navigation";

// Old sign-in URL; the dashboard sign-in now lives at /dashboard/login.
export default function Login() {
  redirect("/dashboard/login");
}
