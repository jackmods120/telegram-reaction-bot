import "./globals.css";

export const metadata = { title: "Reaction Bot Maker" };

export default function RootLayout({ children }) {
  return (
    <html lang="ku">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1" />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://telegram.org/js/telegram-web-app.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
