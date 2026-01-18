import { AppProps } from "next/app";
import Layout from "./layout";
import { Montserrat, Lato } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast-provider";

// Montserrat (semi-bold)
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-montserrat",
});

// Lato (normal)
const lato = Lato({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-lato",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${montserrat.variable} ${lato.variable} font-sans`}>
      <ToastProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ToastProvider>
    </div>
  );
}
