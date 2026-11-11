import type { Metadata } from 'next';
import SiteLink from '@/components/SiteLink';

export const metadata: Metadata = {
  title: { absolute: 'Thank You - IIAE' },
  robots: { index: false, follow: true },
  alternates: { canonical: '/thank-you' },
};

export default function ThankYouPage() {
  return (
    <div>
      <section className="pt-[80px] max-md:pt-[50px] pb-[80px]! max-md:pb-[50px]!">
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
          <div className="text-center max-w-[500px] [box-shadow:rgba(0,0,0,0.1)_0px_10px_20px] rounded-[12px] m-[0px_auto] p-[40px] [background:#ffffff] max-xs:p-[20px]">
            <i className="fa-solid fa-check leading-[100px] text-primary w-[100px] h-[100px] mb-[20px] text-[55px] rounded-[100px] [background:#fcf8e1]"></i>
            <h1 className="text-[#4caf50] mb-[10px] text-[2.5em] max-xs:text-[2em]">Thank You!</h1>
            <p className="mb-[20px] text-[1.1em] text-[#555555]">Your submission has been received.</p>
            <SiteLink href="/" className="text-[#ffffff] font-trip text-[15px] font-normal leading-[1.5] text-center align-middle cursor-pointer select-none bg-secondary inline-flex items-center [border-width:medium] rounded-[15px] p-[12px_30px] gap-[5px] [transition:0.3s] [&:active]:bg-[#565e64] [&:active]:[border-color:#51585e] [&:hover]:bg-primary [&:hover:active]:bg-primary [&:focus-visible]:[box-shadow:rgba(130,138,145,0.5)_0px_0px_0px_0.25rem]">
              Back to Home
            </SiteLink>
          </div>
        </div>
      </section>
    </div>
  );
}
