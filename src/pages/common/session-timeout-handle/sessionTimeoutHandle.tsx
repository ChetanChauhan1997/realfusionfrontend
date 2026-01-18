import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { IMAGES } from "@/utils/Images";
import { Heading } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RouteConfig } from "@/utils/RouteConfig";

const SessionTimeoutHandle = () => {
  const router = useRouter();
  const redirectPath = (router.query.redirect as string) || "/home";

  const handleLoginRedirect = () => {

    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem('postLgoinRedirect', redirectPath);
    router.push(RouteConfig.ADMIN_LOGIN_PAGE)
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <Image
        src={IMAGES.ENQUIRY}
        alt="Session Timeout"
        height={180}
        width={180}
      />
      <p>Session Expired. Please try again!</p>
      <Button variant="default" onClick={handleLoginRedirect}>
        Back to Login
      </Button>

    </div>
  );
};

export default SessionTimeoutHandle;











