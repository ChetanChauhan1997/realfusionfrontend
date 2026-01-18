import React from "react";
import Image from "next/image";
import { IMAGES } from "@/utils/Images";
import Router, { useRouter } from "next/router";
import { Title } from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";
import { RouteConfig } from "@/utils/RouteConfig";

const ServerError = () => {
  const router=useRouter();
  const handleLogin=()=>{
    router.push(RouteConfig.ADMIN_LOGIN_PAGE)
  }
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <Image
        src={IMAGES.ENQUIRY}
        alt="Not Found"
        style={{ height: "180px", width: "180px" }}
      />
      <p >
        Unable to connect to the server. Please try again later.
      </p>
      <Button variant="default"
        onClick={handleLogin}
      >
        Back to Login
      </Button>
    </div>
  );
};

export default ServerError;