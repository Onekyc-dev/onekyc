`javascript
import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "OneKYC — Verify Once. Trust Everywhere.",
  description: "Verify your identity once, reuse it across any dApp.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
