import FishLoader from "@/components/FishLoader";

export default function Loading() {
  return (
    <div className="flex-1 min-h-screen bg-deep-black flex items-center justify-center">
      <FishLoader />
    </div>
  );
}
