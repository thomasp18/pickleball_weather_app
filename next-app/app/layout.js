import BootstrapClient from './components/BootstrapClient.js';
import Footer from './components/footer/footer.js';
import Navibar from './components/navbar/navbar.js';
import './globals.css';

export const metadata = {
  title: 'Pikoweatherer',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-bs-theme="dark">
      <head>
        <meta charSet="utf-8"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
        <link
          href="https://cdn.jsdelivr.net/npm/qweather-icons@1.3.2/font/qweather-icons.css"
          rel="stylesheet"
        ></link>
        <title>Pickleball Weather App</title>
      </head>
      <body>
        <Navibar />
        <BootstrapClient />
        {children}
        <Footer />
      </body>
    </html>
  );
}