import { signOut } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

export const GET = async () => {
  const url = await signOut();
  return redirect(url);
};