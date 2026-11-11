import EnquiryForm from '@/components/forms/EnquiryForm';
import PageSubheader from '@/components/layout/PageSubheader';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  return pageMetadata('/contact-us');
}

export default function ContactUsPage() {
  return (
    <div>
      <PageSubheader title="Contact Us" centerAlign />

      <section className="pt-[60px] [background:#f5f5f5] max-md:pt-[40px] pb-[80px]! max-md:pb-[50px]!">
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
          <h2>How can we help? </h2>
          <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex">
            <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[33.3333%] lg:grow-0 lg:basis-auto">
              <div className="relative rounded-[15px] m-[20px_0px_0px] p-[25px_25px_25px_85px] [background:#ffffff]">
                <i className="fa-regular fa-comments text-primary text-[35px] absolute top-[30px] left-[25px]"></i>
                <h4 className="leading-[1] text-[22px]">Send us a message</h4>
                <small className="leading-[1.4] block">We'd love to hear from you—send us a message!</small>
              </div>
            </div>
            <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[33.3333%] lg:grow-0 lg:basis-auto">
              <div className="relative rounded-[15px] m-[20px_0px_0px] p-[25px_25px_25px_85px] [background:#ffffff]">
                <i className="fa-solid fa-phone text-primary text-[35px] absolute top-[30px] left-[25px]"></i>
                <h4 className="leading-[1] text-[22px]">Call us</h4>
                <small className="leading-[1.4] block">Call us anytime24/7 support on local or international numbers.</small>
              </div>
            </div>
            <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[33.3333%] lg:grow-0 lg:basis-auto">
              <div className="relative rounded-[15px] m-[20px_0px_0px] p-[25px_25px_25px_85px] [background:#ffffff]">
                <i className="fa-solid fa-hotel text-primary text-[35px] absolute top-[30px] left-[25px]"></i>
                <h4 className="leading-[1] text-[22px]">Need help & Support?</h4>
                <small className="leading-[1.4] block">Contact the student support team for quick assistance.</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-[80px] max-md:pt-[50px] pb-[80px]! max-md:pb-[50px]!">
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
          <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex">
            <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[58.3333%] lg:grow-0 lg:basis-auto">
              <div className="max-w-full rounded-[20px] p-[30px] [background:#315c96] max-md:p-[20px] max-tab:mt-[30px]">
                <h4 className="text-[#ffffff] text-[25px] relative [&::after]:[content:''] [&::after]:bg-[#fcdc40] [&::after]:w-[50px] [&::after]:h-[4px] [&::after]:block [&::after]:absolute [&::after]:bottom-[-10px] [&::after]:left-0 [&::after]:rounded-[10px]">Tell Us About Yourself</h4>
                <EnquiryForm variant="full" />
              </div>
            </div>
            <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[41.6667%] lg:grow-0 lg:basis-auto">
              <div className="bg-[#ffffff] p-[0px_15px]">
                <h3 className="mb-[18px]">Corporate / Main Campus Office</h3>
                <div className="mt-[25px]">
                  <strong className="text-primary items-center mb-[5px] text-[18px] flex gap-[10px]">
                    <i className="fa-solid fa-location-dot text-[20px]"></i> Location Address
                  </strong>
                  <span className="mt-[3px] text-[15px] block">Plot no 3 & 4, Bagdola Village Extension, near Yadav Bhavan, Sector 8 Dwarka, New Delhi, 110077</span>
                </div>
                <div className="mt-[25px]">
                  <strong className="text-primary items-center mb-[5px] text-[18px] flex gap-[10px]">
                    <i className="fa-solid fa-phone text-[20px]"></i> Infomation
                  </strong>
                  <span className="mt-[3px] text-[15px] block">
                    {' '}
                    +91-9870290575, +91-9870290577, <br />
                    +91-9870290573, +91-8448488194
                  </span>
                  <span className="mt-[3px] text-[15px] block">admission.iiae@gmail.com</span>
                </div>
                <div className="mt-[25px]">
                  <strong className="text-primary items-center mb-[5px] text-[18px] flex gap-[10px]">
                    <i className="fa-solid fa-clock text-[20px]"></i> Business Hours
                  </strong>
                  <span className="mt-[3px] text-[15px] block">Monay – Friday: 10:00AM – 8:00PM</span>
                  <span className="mt-[3px] text-[15px] block">Saturday – Sunday: 12:00AM – 5:00PM</span>
                </div>
                <div className="mt-[25px]">
                  <strong className="text-primary items-center mb-[5px] text-[18px] flex gap-[10px]">
                    <i className="fa-solid fa-bell text-[20px]"></i> Note :{' '}
                  </strong>
                  <span className="mt-[3px] text-[15px] block">For all queries, contact the Admission Head</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
