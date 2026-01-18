import Router from "next/router";
import { RouteConfig } from "./RouteConfig";
export const redirectToSessionTimeout = () => {
  const currentPath = window.location.pathname;
  Router.push(`${RouteConfig.SESSION_TIME_OUT}?redirect=${encodeURIComponent(currentPath)}`);
};