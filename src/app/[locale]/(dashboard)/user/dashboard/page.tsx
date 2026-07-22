import { redirect } from "next/navigation";

export default function DashboardRoot() {
  redirect("/user/dashboard/overview");
}
