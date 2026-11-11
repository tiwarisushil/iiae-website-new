import './globals.css';

import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BootstrapClient from '@/components/ui/BootstrapClient';
import Lightbox from '@/components/ui/Lightbox';
import ContactDock from '@/components/layout/ContactDock';
import WelcomeBannerPopup from '@/components/layout/WelcomeBannerPopup';
import RouteChange from '@/components/RouteChange';
import JsonLd, { organizationSchema } from '@/components/JsonLd';
import { GOOGLE_SITE_VERIFICATION, GTM_ID, SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  icons: { icon: '/assets/web/images/favicon.png' },
  verification: { google: GOOGLE_SITE_VERIFICATION },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {GTM_ID && (
          <>
            <Script id="gtm" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
            </Script>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              />
            </noscript>
          </>
        )}
        <JsonLd data={organizationSchema()} />
        <Header />
        <main>{children}</main>
        <Footer />
        <BootstrapClient />
        <RouteChange />
        <Lightbox />
        <ContactDock />
        <WelcomeBannerPopup />
      </body>
    </html>
  );
}
