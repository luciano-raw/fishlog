import { auth } from "@clerk/nextjs/server";
import HazardForm from "./HazardForm";

export default async function LogHazardPage() {
  await auth.protect();
  return <HazardForm />;
}
