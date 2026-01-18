// import { Metadata } from "next";
// import { Montserrat, Lato } from "next/font/google";
// import "./globals.css";

// export const metadata: Metadata = {
//   title: "RealFusion 1",
//   description: "Created by Chetan",
//   generator: "React",
//   icons: {
//     icon: "/favicon.ico", 
//   },
// };

// // Montserrat (semi-bold)
// const montserrat = Montserrat({
//   subsets: ["latin"],
//   weight: ["600"],
//   variable: "--font-montserrat",
// });

// // Lato (normal)
// const lato = Lato({
//   subsets: ["latin"],
//   weight: ["400"],
//   variable: "--font-lato",
// });

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" className={`${montserrat.variable} ${lato.variable}`}>
//       <body className="font-lato">{children}</body>
//     </html>
//   );
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}