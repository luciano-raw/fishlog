import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function FeedEntryPage() {
  await auth.protect();
  redirect("/");
}
