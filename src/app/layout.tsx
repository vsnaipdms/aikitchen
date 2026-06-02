import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Kitchen - Recipe Generator",
  description: "Enter ingredients you have at home and discover recipes instantly with AI.",
  openGraph: {
    title: "AI Kitchen - Recipe Generator",
    description: "Enter ingredients and discover recipes instantly with AI.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `try{let t=localStorage.getItem('aikitchen_theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`,
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
