import EnquiryForm from '@/components/forms/EnquiryForm';
import PageSubheader from '@/components/layout/PageSubheader';
import { SidebarNav } from '@/components/layout/Sidebar';
import { FOOTER_USEFUL_LINKS } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  return pageMetadata('/request-information');
}

export default function RequestInformationPage() {
  return (
    <div>
      <PageSubheader title="Request Information" centerAlign />

      <section className="pt-[80px] max-md:pt-[50px] pb-[80px]! max-md:pb-[50px]!">
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
          <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex">
            <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[75%] lg:grow-0 lg:basis-auto">
              <h4>WE SHALL SHOW YOU WHY YOU SHOULD KEEP US ON TOP OF YOUR LIST OF POTENTIAL COLLEGE.</h4>
              <p>
                The moment you choose your career as AME, <strong>(AIRCRAFT MAINTENANCE ENGINEERING)</strong> you have to
                search an elite college to prove your decision right. IIAE, Delhi is just the place you should keep in the
                mind.
              </p>
              <p>
                Fill out the contact form, and we shall get back to you on priority with all information about AME and why
                choose IIAE (INDIAN INSTITUTE OF AIRCRAFT ENGINEERING), Delhi. By submitting this form you agree to be
                contacted by IIAE Delhi through E-mail, Phone, Mail or text massages. we shall include all necessary
                information about AME program along with degree option and career opportunity which will support you in
                taking the right decision about AME program and IIAE Delhi importance to full fill your dream.
              </p>
              <div className="pt-[30px]! max-md:pt-[20px]! max-w-full pr-[30px] pb-[30px] pl-[30px] rounded-[20px] [background:#315c96] max-md:pr-[20px] max-md:pb-[20px] max-md:pl-[20px] max-tab:mt-[30px]">
                <h4 className="text-[#ffffff] text-[25px] relative [&::after]:[content:''] [&::after]:bg-[#fcdc40] [&::after]:w-[50px] [&::after]:h-[4px] [&::after]:block [&::after]:absolute [&::after]:bottom-[-10px] [&::after]:left-0 [&::after]:rounded-[10px]">Tell Us About Yourself</h4>
                <EnquiryForm variant="full" />
              </div>
            </div>

            <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[25%] lg:grow-0 lg:basis-auto">
              {/* This page's sidebar used the footer's "Useful Links" menu. */}
              <SidebarNav links={FOOTER_USEFUL_LINKS} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
