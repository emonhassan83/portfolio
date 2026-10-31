import "../index.css";
import "../App.css";
import Providers from "./Providers";
import Script from "next/script";

export const metadata = {
  title: "Portfolio Website",
  description: "Emon's Personal Portfolio Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
        <Script
          src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"
          strategy="beforeInteractive"
        />
        <Script id="emailjs-init" strategy="afterInteractive">
          {`
            (function () {
              emailjs.init("GVC4lZO9Db_aCA5BK");
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
