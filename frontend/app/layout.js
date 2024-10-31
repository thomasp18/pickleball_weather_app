import localFont from "next/font/local";
import 'bootstrap/dist/css/bootstrap.css';
import "./globals.css";
import BootstrapClient from './components/BootstrapClient.js';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Pikoweatherer",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-bs-theme="dark">
      <head>
        <meta charSet="utf-8"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
        <link href="https://cdn.jsdelivr.net/npm/qweather-icons@1.3.2/font/qweather-icons.css" rel="stylesheet"></link>
        <title>Pickleball Weather App</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <div className="placeholder">
        </div>
        <footer>
          <p>Banana Technologies©™</p>
        </footer>
        <BootstrapClient />
      </body>
    </html>
  );
}
