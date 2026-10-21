import { auth } from "@clerk/nextjs/server";
import SpotForm from "./SpotForm";

export default async function LogSpotPage() {
  await auth.protect();
  return <SpotForm />;
}
