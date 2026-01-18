import Image from "next/image";
import { IMAGES } from "@/utils/Images";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // App Router hook
import { RouteConfig } from "@/utils/RouteConfig";

export default function PermissionDenied() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push(RouteConfig.LANDING_PAGE);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <Image
        src={IMAGES.ENQUIRY}
        alt="Not Found"
        width={180}
        height={180}
      />
      <p className="text-2xl font-bold">Permission Denied!</p>
      <p>Please contact your Administrator.</p>
      <Button onClick={handleLoginRedirect}>Home</Button>
    </div>
  );
}
