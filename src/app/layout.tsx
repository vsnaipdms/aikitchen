import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Kitchen - Turn Ingredients Into Delicious Meals",
  description: "AI-powered recipe generator. Enter ingredients you have at home and discover delicious recipes instantly with AI suggestions, images, and video tutorials.",
  openGraph: {
    title: "AI Kitchen - Turn Ingredients Into Delicious Meals",
    description: "Discover recipes instantly using ingredients already available at home.",
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
