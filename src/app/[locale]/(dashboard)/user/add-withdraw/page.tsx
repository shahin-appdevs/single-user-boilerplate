import { redirect } from "next/navigation";

export default function AddWithdrawRedirect() {
  redirect("/user/add-money");
}
