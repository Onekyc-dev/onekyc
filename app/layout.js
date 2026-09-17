import "./globals.css";
import Providers from "./providers";
import RegisterSW from "./register-sw";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "OneKYC — Verify Once. Trust Everywhere.",
  description: "Verify your identity once, reuse it across any dApp.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OneKYC",
  },
};

export const viewport = {
  themeColor: "#07080d",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <RegisterSW />
      </body>
    </html>
  );
}

