import EnquiryForm from '@/components/forms/EnquiryForm';
import PlaneParallax from '@/components/home/PlaneParallax';
import HeroBanner from '@/components/home/HeroBanner';
import { PostCard } from '@/components/layout/Sidebar';
import Slider from '@/components/ui/Slider';
import JsonLd, { faqSchema } from '@/components/JsonLd';
import { home } from '@/lib/content';
import { listPosts } from '@/lib/posts';
import { renderHtml } from '@/lib/html';
import { pageMetadata } from '@/lib/seo';
import { HERO_BANNERS } from '@/lib/site';
import SiteLink from '@/components/SiteLink';

export async function generateMetadata() {
  return pageMetadata('/');
}

// "Campus News" shows newsroom posts from the CRM API; re-rendered at most once a minute.
export const revalidate = 60;

// The three newest newsroom posts. The posts the live home page featured keep the shorter
// excerpts it showed (content/home.json); others use their own excerpt.
async function campusNews() {
  const { posts } = await listPosts('newsroom', 1);
  return posts.slice(0, 3);
}

// Markup follows resources/views/livewire/web/home.blade.php as rendered on the live
// site. The hero banner is the active CMS banner; "Campus News" shows the newsroom
// posts flagged for the home page.
export default async function HomePage() {
  const bannerStyle = HERO_BANNERS.length ? { backgroundImage: `url('${HERO_BANNERS[0]}')` } : undefined;
  const news = await campusNews();
  return (
    <div>
      {home.faqs.length > 0 && (
        <JsonLd data={faqSchema(home.faqs.map((f) => ({ question: f.question, answer: f.answer.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() })))} />
      )}
      <section className="bg-heading [background-position-x:50%] [background-position-y:center] [background-size:cover] pt-[60px] max-md:[background:#031f45]! max-md:pt-[20px]" data-hero-banner="" style={bannerStyle} suppressHydrationWarning>
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] max-w-[1600px] m-[0px_auto]">
          <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex items-end!">
            <div className="w-[41.6667%] max-w-full mt-0 shrink-0 p-0 max-sm:w-full sm:grow-0 sm:basis-auto"></div>
            <div className="w-[58.3333%] max-w-full pr-0 pl-[calc(0.75rem)] mt-0 shrink-0 pb-0 max-sm:w-full md:max-tab:pr-[10px] md:max-tab:pb-[30px] tab:pr-[100px] tab:pb-[60px] max-md:pl-0 text-right! max-md:text-center! sm:grow-0 sm:basis-auto">
              <h1 className="text-[#ffffff] mb-0 leading-[1] text-[65px] font-trip-bold mr-0 ml-0 tab:leading-[160px] tab:text-[175px] md:max-tab:text-[115px]">
                AME-147
              </h1>
              <h2 className="text-[#f6c606] leading-[1] text-[25px] font-trip-bold md:max-tab:text-[40px] tab:text-[67px]">
                Admission Open 2027
              </h2>
              <div className="mt-[25px] max-md:mt-0 max-md:text-center max-md:flex-col max-md:content-center max-md:flex">
                <div className="flex! justify-end! items-center! max-md:justify-center!">
                  <div className="text-left">
                    <strong className="text-[#ffffff] mb-[8px] font-trip-bold text-[40px] leading-[1] block tab:text-[70px]">
                      UPTO
                    </strong>
                    {' '}
                    <span className="uppercase text-[#ffffff] font-trip-medium text-[13px] leading-[1] block md:max-tab:text-[14px] tab:text-[18px] max-md:leading-[1.2]">
                      Scholarship For AIAEE{' '}
                      <br />
                      Qualified Top Ranker
                    </span>
                  </div>
                  <div >
                    <strong className="text-[#f6c606] font-trip-bold text-[60px] leading-[1] md:max-tab:text-[100px] tab:text-[180px] tab:leading-[150px]">
                      100%
                    </strong>
                  </div>
                </div>
                <SiteLink href="/apply-online" className="text-[#ffffff] font-trip text-[17px] font-normal leading-[1.5] text-center align-middle cursor-pointer select-none bg-secondary inline-flex items-center float-left mt-[20px] ml-auto [border-width:medium] rounded-[15px] p-[13px_30px] gap-[5px] [transition:0.3s] [&:active]:bg-[#565e64] [&:active]:[border-color:#51585e] [&:hover:active]:bg-secondary md:max-tab:ml-[5%] tab:ml-[16%] max-md:justify-center max-md:w-[280px] max-md:mr-auto max-md:mb-[20px] [&:focus-visible]:[box-shadow:rgba(130,138,145,0.5)_0px_0px_0px_0.25rem]">
                  Registration Open Now{' '}
                  <i className="fa-solid fa-arrow-right leading-[15px] text-[#ffffff] w-[18px] h-[18px] ml-[2px] text-[10px] [transform:rotate(320deg)] rounded-[100px] p-[3px] [background:#000000]"></i>
                </SiteLink>
              </div>
            </div>
            <div className="w-[41.6667%] max-w-full mt-0 shrink-0 p-0 max-sm:w-full max-md:[background-repeat:no-repeat] max-md:[background-size:140%_auto] max-md:h-[250px] sm:grow-0 sm:basis-auto" data-hero-banner="" style={bannerStyle} suppressHydrationWarning></div>
          </div>
        </div>
      </section>

      <HeroBanner banners={HERO_BANNERS} />
      <section className="pt-[40px]! pb-[40px]! max-md:pt-[20px]! max-md:pb-[20px]!">
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1400px]">
          <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex">
            <div className="w-[16.6667%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-[10px] shrink-0 max-md:w-[50%] md:max-lg:w-[33.3333%] tab:mt-0 max-tab:mr-0 max-tab:mb-[10px] max-tab:ml-0 sm:grow-0 sm:basis-auto">
              <div className="group/gF14-24">
                <SiteLink className="group/gF14-25 text-center block [transition:color_0.1s_ease-in-out]" href="/approved-by-dgca">
                  <div className="[transition:opacity_0.1s_ease-in-out,_transform_0.1s_ease-in-out] group-[:hover]/gF14-25:[transform:translateY(-0.3em)]">
                    <img className="h-[70px] max-md:h-[60px] group-[:hover]/gF14-24:[filter:grayscale()]" src="/assets/web/images/001-agree.png" alt="" />
                  </div>
                  <div className="text-[#000000] mt-[10px] font-trip-medium text-[18px] block max-md:text-[15px]">
                    Approved By DGCA
                  </div>
                </SiteLink>
              </div>
            </div>
            <div className="w-[16.6667%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-[10px] shrink-0 max-md:w-[50%] md:max-lg:w-[33.3333%] tab:mt-0 max-tab:mr-0 max-tab:mb-[10px] max-tab:ml-0 sm:grow-0 sm:basis-auto">
              <div className="group/gF14-30">
                <SiteLink className="group/gF14-31 text-center block [transition:color_0.1s_ease-in-out]" href="/admission">
                  <div className="[transition:opacity_0.1s_ease-in-out,_transform_0.1s_ease-in-out] group-[:hover]/gF14-31:[transform:translateY(-0.3em)]">
                    <img className="h-[70px] max-md:h-[60px] group-[:hover]/gF14-30:[filter:grayscale()]" src="/assets/web/images/002-learning.png" alt="" />
                  </div>
                  <div className="text-[#000000] mt-[10px] font-trip-medium text-[18px] block max-md:text-[15px]">
                    Course Eligibility
                  </div>
                </SiteLink>
              </div>
            </div>
            <div className="w-[16.6667%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-[10px] shrink-0 max-md:w-[50%] md:max-lg:w-[33.3333%] tab:mt-0 max-tab:mr-0 max-tab:mb-[10px] max-tab:ml-0 sm:grow-0 sm:basis-auto">
              <div className="group/gF14-36">
                <SiteLink className="group/gF14-37 text-center block [transition:color_0.1s_ease-in-out]" href="/ame">
                  <div className="[transition:opacity_0.1s_ease-in-out,_transform_0.1s_ease-in-out] group-[:hover]/gF14-37:[transform:translateY(-0.3em)]">
                    <img className="h-[70px] max-md:h-[60px] group-[:hover]/gF14-36:[filter:grayscale()]" src="/assets/web/images/003-coding.png" alt="" />
                  </div>
                  <div className="text-[#000000] mt-[10px] font-trip-medium text-[18px] block max-md:text-[15px]">
                    AME Program Structure
                  </div>
                </SiteLink>
              </div>
            </div>
            <div className="w-[16.6667%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-[10px] shrink-0 max-md:w-[50%] md:max-lg:w-[33.3333%] tab:mt-0 max-tab:mr-0 max-tab:mb-[10px] max-tab:ml-0 sm:grow-0 sm:basis-auto">
              <div className="group/gF14-42">
                <SiteLink className="group/gF14-43 text-center block [transition:color_0.1s_ease-in-out]" href="/placements">
                  <div className="[transition:opacity_0.1s_ease-in-out,_transform_0.1s_ease-in-out] group-[:hover]/gF14-43:[transform:translateY(-0.3em)]">
                    <img className="h-[70px] max-md:h-[60px] group-[:hover]/gF14-42:[filter:grayscale()]" src="/assets/web/images/004-hiring.png" alt="" />
                  </div>
                  <div className="text-[#000000] mt-[10px] font-trip-medium text-[18px] block max-md:text-[15px]">
                    AME Placement
                  </div>
                </SiteLink>
              </div>
            </div>
            <div className="w-[16.6667%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-[10px] shrink-0 max-md:w-[50%] md:max-lg:w-[33.3333%] tab:mt-0 max-tab:mr-0 max-tab:mb-[10px] max-tab:ml-0 sm:grow-0 sm:basis-auto">
              <div className="group/gF14-48">
                <SiteLink className="group/gF14-49 text-center block [transition:color_0.1s_ease-in-out]" href="/career-growth">
                  <div className="[transition:opacity_0.1s_ease-in-out,_transform_0.1s_ease-in-out] group-[:hover]/gF14-49:[transform:translateY(-0.3em)]">
                    <img className="h-[70px] max-md:h-[60px] group-[:hover]/gF14-48:[filter:grayscale()]" src="/assets/web/images/006-goal.png" alt="" />
                  </div>
                  <div className="text-[#000000] mt-[10px] font-trip-medium text-[18px] block max-md:text-[15px]">
                    Career Opportunity
                  </div>
                </SiteLink>
              </div>
            </div>
            <div className="w-[16.6667%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-[10px] shrink-0 max-md:w-[50%] md:max-lg:w-[33.3333%] tab:mt-0 max-tab:mr-0 max-tab:mb-[10px] max-tab:ml-0 sm:grow-0 sm:basis-auto">
              <div className="group/gF14-54">
                <SiteLink className="group/gF14-55 text-center block [transition:color_0.1s_ease-in-out]" href="/important-dates-for-aiaee">
                  <div className="[transition:opacity_0.1s_ease-in-out,_transform_0.1s_ease-in-out] group-[:hover]/gF14-55:[transform:translateY(-0.3em)]">
                    <img className="h-[70px] max-md:h-[60px] group-[:hover]/gF14-54:[filter:grayscale()]" src="/assets/web/images/calendar.png" alt="" />
                  </div>
                  <div className="text-[#000000] mt-[10px] font-trip-medium text-[18px] block max-md:text-[15px]">
                    Important Dates
                  </div>
                </SiteLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-[80px] relative [background:#f7f7f7] max-md:pt-[50px] pb-[80px]! max-md:pb-[50px]!">
        <a href="#placements">
          <img src="/assets/web/images/arrow-down.png" className="z-[9] w-[60px] ml-[-30px] absolute bottom-[-30px] left-[50%]" alt="arrow" />
        </a>
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
          <div >
            <h2 className="mb-[5px] leading-[1] text-[40px] mr-0 ml-0 max-md:text-[35px]">
              About IIAE
            </h2>
            <h5 className="mb-[20px]">
              Best Aircraft Maintenance Engineering College in India - IIAE Delhi
            </h5>
            <p>
              The Indian Institute of Aircraft Engineering (IIAE) has achieved a significant milestone by attaining CAR-147(Basic) compliance for its Aircraft Maintenance Engineering (AME) program. This approval, granted by the Directorate General of Civil Aviation (DGCA), Ministry of Civil Aviation, Government of India, signifies that IIAE’s training adheres to stringent regulatory standards.
            </p>
            <SiteLink href="/about-us" className="[color:red] items-center gap-[8px] flex!">
              Read More{' '}
              <i className="fa-solid fa-arrow-right"></i>
            </SiteLink>
          </div>
          <div className="pt-[40px]! max-md:pt-[20px]!">
            <h2 className="text-[40px] tracking-[-1px] max-md:text-[25px] max-md:tracking-[0px]">
              Our Training Campus
            </h2>
            <p>
              We, Indian Institute of aircraft engineering, (IIAE), Delhi have joined hands with one of the oldest and world class reputed CAR 145, Aircraft Maintenance Organization (AMO), Shaurya Aeronautics Pvt. Ltd. (SAPL) approved by the Directorate General of Civil Aviation, Ministry of Civil aviation, Govt. of India vide approval SAPL/ F-APP-1714.
            </p>
            <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex!">
              <div className="w-[33.3333%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-sm:w-full sm:grow-0 sm:basis-auto">
                <div className="group/gF14-74 max-md:m-[15px_0px]">
                  <div className="rounded-[20px] overflow-hidden">
                    <img className="[transform:scale(1)] rounded-[18px] [transition:0.3s_ease-in-out] group-[:hover]/gF14-74:[transform:scale(1.12)]" src="/assets/web/images/Training01.png" alt="IIAE" />
                  </div>
                  <h4 className="mt-[20px] text-[22px]">
                    Shaurya Aeronautics Pvt. Ltd.
                  </h4>
                  <span className="leading-[25px] block">
                    Ground & 1st Floor, Plot No. 27 KH, No. 349, Shahabad, Mohammadpur, New Delhi - 110061
                  </span>
                </div>
              </div>
              <div className="w-[33.3333%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-sm:w-full sm:grow-0 sm:basis-auto">
                <div className="group/gF14-80 max-md:m-[15px_0px]">
                  <div className="rounded-[20px] overflow-hidden">
                    <img className="[transform:scale(1)] rounded-[18px] [transition:0.3s_ease-in-out] group-[:hover]/gF14-80:[transform:scale(1.12)]" src="/assets/web/images/Training02.png" alt="IIAE" />
                  </div>
                  <h4 className="mt-[20px] text-[22px]">
                    Dr. Bhimrao Ambedkar Airstrip
                  </h4>
                  <span className="leading-[25px] block">
                    Dr. bhimrao ambedkar havi Patti Partapur,
                    <br />
                    {' '}Meerut, UP.
                  </span>
                </div>
              </div>
              <div className="w-[33.3333%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-sm:w-full sm:grow-0 sm:basis-auto">
                <div className="group/gF14-87 max-md:m-[15px_0px]">
                  <div className="rounded-[20px] overflow-hidden">
                    <img className="[transform:scale(1)] rounded-[18px] [transition:0.3s_ease-in-out] group-[:hover]/gF14-87:[transform:scale(1.12)]" src="/assets/web/images/Training03.png" alt="IIAE" />
                  </div>
                  <h4 className="mt-[20px] text-[22px]">
                    Aircraft Maintenance Organization
                  </h4>
                  <span className="leading-[25px] block">
                    Hanger No. Dr. bhimrao ambedkar havi Patti Partapur, Meerut, UP.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-[80px] [background-image:url(/assets/web/images/bg01.png)] [background-position-x:50%] [background-position-y:center] [background-repeat:no-repeat] [background-size:cover] relative overflow-hidden max-md:pt-[50px] max-md:[background:#212435] pb-[250px]! max-md:pb-[50px]!" data-parallax-section="facilities">
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
          <h2 className="text-[#ffffff]! text-[40px] tracking-[-1px] max-md:text-[25px] max-md:tracking-[0px]">
            Our Facilities
          </h2>
          <p className="text-[#ffffff]! z-[999] relative">
            IIAE Delhi is one of the most reputed Aircraft Maintenance Engineering College in India and is approved by the Directorate General of Civil Aviation (DGCA), Ministry of Civil Aviation, Government of India. We focus on its progressive approach and commitment towards excellence. We have well equipped labs, fully stocked library and qualified faculty. Our campus in Delhi is located in the heart of west Delhi and is well connected with Metro and other means of transport. We provide excellent hostel facility for outstation students.
          </p>
          <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex z-[999] relative">
            <div className="w-[33.3333%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-sm:w-full sm:max-lg:w-[50%] flex! content-center! max-md:text-[17px] sm:grow-0 sm:basis-auto">
              <SiteLink className="text-[#ffffff] text-[20px] items-center mt-[20px] font-trip-medium flex gap-[10px]" href="/infrastructure">
                <i className="fa-solid fa-circle-check text-primary text-[30px]"></i>
                {' '}Library & Journal
              </SiteLink>
            </div>
            <div className="w-[33.3333%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-sm:w-full sm:max-lg:w-[50%] flex! content-center! max-md:text-[17px] sm:grow-0 sm:basis-auto">
              <SiteLink className="text-[#ffffff] text-[20px] items-center mt-[20px] font-trip-medium flex gap-[10px]" href="/infrastructure">
                <i className="fa-solid fa-circle-check text-primary text-[30px]"></i>
                {' '}Laboratories & Workshops
              </SiteLink>
            </div>
            <div className="w-[25%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-sm:w-full sm:max-lg:w-[50%] flex! content-center! max-md:text-[17px] sm:grow-0 sm:basis-auto">
              <SiteLink className="text-[#ffffff] text-[20px] items-center mt-[20px] font-trip-medium flex gap-[10px]" href="/infrastructure">
                <i className="fa-solid fa-circle-check text-primary text-[30px]"></i>
                {' '}Own Aircrafts
              </SiteLink>
            </div>
            <div className="w-[41.6667%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-sm:w-full sm:max-lg:w-[50%] flex! content-center! max-md:text-[17px] sm:grow-0 sm:basis-auto">
              <SiteLink className="text-[#ffffff] text-[20px] items-center mt-[20px] font-trip-medium flex gap-[10px]" href="/infrastructure">
                <i className="fa-solid fa-circle-check text-primary text-[30px]"></i>
                {' '}MRO 147 TRAINING ON LIVE ENVIRONMENT
              </SiteLink>
            </div>
          </div>
          <div className="[background-image:url(/assets/web/images/airplan01.png)] [background-position-x:200px] [background-position-y:bottom] [background-repeat:no-repeat] w-full absolute bottom-0 right-auto motion-reduce:[transition:none]!" data-parallax="plane"></div>
        </div>
      </section>

      <section id="placements" className="pt-[80px] relative max-md:pt-[50px] pb-[80px]! max-md:pb-[50px]!">
        <a href="#registeration">
          <img src="/assets/web/images/arrow-down.png" className="z-[9] w-[60px] ml-[-30px] absolute bottom-[unset] left-[50%] top-[-30px]" alt="arrow" />
        </a>
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
          <div className="overflow-hidden">
            <h2 className="text-[40px] tracking-[-1px] max-md:text-[25px] max-md:tracking-[0px]">
              Placements at IIAE Delhi
            </h2>
            <Slider className="[overflow:unset] [&_.swiper-button-prev]:top-[-25px] [&_.swiper-button-prev]:left-[unset] [&_.swiper-button-prev]:absolute [&_.swiper-button-prev]:mt-[calc(-22px)] [&_.swiper-button-prev]:z-[10] [&_.swiper-button-prev]:cursor-pointer [&_.swiper-button-prev]:text-[#007aff] [&_.swiper-button-prev]:justify-center [&_.swiper-button-prev]:items-center [&_.swiper-button-prev]:flex [&_.swiper-button-prev]:rounded-[100px] [&_.swiper-button-prev]:[background:#eeeeee] [&_.swiper-button-prev]:right-[40px]! [&_.swiper-button-prev]:w-[35px]! [&_.swiper-button-prev]:h-[35px]! [&_.swiper-button-prev.swiper-button-disabled]:cursor-auto [&_.swiper-button-prev.swiper-button-disabled]:opacity-[0.35] [&_.swiper-button-prev.swiper-button-disabled]:pointer-events-none [&_.swiper-button-prev.swiper-button-hidden]:cursor-auto [&_.swiper-button-prev.swiper-button-hidden]:opacity-[0] [&_.swiper-button-prev.swiper-button-hidden]:pointer-events-none [&_.swiper-button-prev.swiper-button-lock]:hidden [&_.swiper-button-prev.swiper-pagination-lock]:hidden [&_.swiper-button-prev.swiper-button-disabled.swiper-button-hidden]:opacity-[0] [&_.swiper-button-prev::after]:text-[#000000] [&_.swiper-button-prev::after]:[font-family:swiper-icons] [&_.swiper-button-prev::after]:tracking-[0px] [&_.swiper-button-prev::after]:leading-[1] [&_.swiper-button-prev::after]:[font-variant:initial] [&_.swiper-button-prev::after]:text-[14px]! [&_.swiper-button-prev::after]:normal-case! [&_.swiper-button-next]:top-[-25px] [&_.swiper-button-next]:left-[unset] [&_.swiper-button-next]:absolute [&_.swiper-button-next]:mt-[calc(-22px)] [&_.swiper-button-next]:z-[10] [&_.swiper-button-next]:cursor-pointer [&_.swiper-button-next]:text-[#007aff] [&_.swiper-button-next]:justify-center [&_.swiper-button-next]:items-center [&_.swiper-button-next]:flex [&_.swiper-button-next]:rounded-[100px] [&_.swiper-button-next]:[background:#eeeeee] [&_.swiper-button-next]:right-0! [&_.swiper-button-next]:w-[35px]! [&_.swiper-button-next]:h-[35px]! [&_.swiper-button-next.swiper-button-disabled]:cursor-auto [&_.swiper-button-next.swiper-button-disabled]:opacity-[0.35] [&_.swiper-button-next.swiper-button-disabled]:pointer-events-none [&_.swiper-button-next.swiper-button-hidden]:cursor-auto [&_.swiper-button-next.swiper-button-hidden]:opacity-[0] [&_.swiper-button-next.swiper-button-hidden]:pointer-events-none [&_.swiper-button-next.swiper-button-lock]:hidden [&_.swiper-button-next.swiper-pagination-lock]:hidden [&_.swiper-button-next.swiper-button-disabled.swiper-button-hidden]:opacity-[0] [&_.swiper-button-next::after]:text-[#000000] [&_.swiper-button-next::after]:[font-family:swiper-icons] [&_.swiper-button-next::after]:tracking-[0px] [&_.swiper-button-next::after]:leading-[1] [&_.swiper-button-next::after]:[font-variant:initial] [&_.swiper-button-next::after]:text-[14px]! [&_.swiper-button-next::after]:normal-case! [&_.swiper-wrapper]:[transform:translate(0px,_0px)]"
              variant="placements-logo"
              slides={[
                {
                  className: 'flex [border:1px_solid_#ededed] rounded-[15px] p-[10px] [place-content:center]',
                  content: (
                    <>
                      <img className="h-[90px]" src="/assets/web/images/Lionbridge.jpg" alt="placements" />
                    </>
                  ),
                },
                {
                  className: 'flex [border:1px_solid_#ededed] rounded-[15px] p-[10px] [place-content:center]',
                  content: (
                    <>
                      <img className="h-[90px]" src="/assets/web/images/Air-Deccan-Simplifly.jpg" alt="placements" />
                    </>
                  ),
                },
                {
                  className: 'flex [border:1px_solid_#ededed] rounded-[15px] p-[10px] [place-content:center]',
                  content: (
                    <>
                      <img className="h-[90px]" src="/assets/web/images/Qatar-Airways.jpg" alt="placements" />
                    </>
                  ),
                },
                {
                  className: 'flex [border:1px_solid_#ededed] rounded-[15px] p-[10px] [place-content:center]',
                  content: (
                    <>
                      <img className="h-[90px]" src="/assets/web/images/Indigo1.png" alt="placements" />
                    </>
                  ),
                },
                {
                  className: 'flex [border:1px_solid_#ededed] rounded-[15px] p-[10px] [place-content:center]',
                  content: (
                    <>
                      <img className="h-[90px]" src="/assets/web/images/Spicejet.jpg" alt="placements" />
                    </>
                  ),
                },
                {
                  className: 'flex [border:1px_solid_#ededed] rounded-[15px] p-[10px] [place-content:center]',
                  content: (
                    <>
                      <img className="h-[90px]" src="/assets/web/images/ETIHAD-AIRWAYS.png" alt="placements" />
                    </>
                  ),
                },
                {
                  className: 'flex [border:1px_solid_#ededed] rounded-[15px] p-[10px] [place-content:center]',
                  content: (
                    <>
                      <img className="h-[90px]" src="/assets/web/images/Air-India.png" alt="placements" />
                    </>
                  ),
                },
                {
                  className: 'flex [border:1px_solid_#ededed] rounded-[15px] p-[10px] [place-content:center]',
                  content: (
                    <>
                      <img className="h-[90px]" src="/assets/web/images/Go-Air.png" alt="placements" />
                    </>
                  ),
                },
                {
                  className: 'flex [border:1px_solid_#ededed] rounded-[15px] p-[10px] [place-content:center]',
                  content: (
                    <>
                      <img className="h-[90px]" src="/assets/web/images/Emirates.jpg" alt="placements" />
                    </>
                  ),
                },
              ]}
            />
          </div>
          <div className="pt-[60px] max-md:pt-[40px]">
            <h2 className="text-[40px] tracking-[-1px] max-md:text-[25px] max-md:tracking-[0px]">
              Campus News
            </h2>
            <div >
              <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex">
          {news.map((post) => (
            <div className="w-[33.3333%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-sm:w-full sm:grow-0 sm:basis-auto" key={post.slug}>
              <PostCard kind="newsroom" context="home" post={post} excerpt={(home.newsExcerpts as Record<string, string>)[post.slug] ?? post.excerpt} />
            </div>
          ))}
        </div>
            </div>
          </div>
        </div>
      </section>

      <section id="registeration" className="pt-[80px] [background-image:url(/assets/web/images/bg02.jpg)] [background-size:cover] relative overflow-hidden [animation:45s_ease_0s_infinite_alternate_forwards_running_slidein] max-md:pt-[50px] pb-[80px]! max-md:pb-[50px]!" data-parallax-section="registration">
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px] z-[99] relative">
          <div >
            <div className="sm:[flex:0_0_auto] sm:max-lg:w-full lg:w-[66.6667%]">
              <h2 className="text-[40px] font-trip-bold tracking-[-1px] max-md:text-[25px] max-md:tracking-[0px]">
                AME 2026 Online Registration has Started!
              </h2>
              <strong className="text-[#000000] text-[20px] block m-[0px_0px_10px] max-md:text-[15px]">
                Your Future Starts Here. Register Now for AME 2026!
              </strong>
              <p>
                Note : Students who are 12th Pass-out or appearing can Apply for 2026 AIAEE Examination for Admission in IIAE Delhi for AME course.
              </p>
              <SiteLink href="/apply-online" className="text-[#ffffff] font-trip font-normal leading-[1.5] text-center align-middle cursor-pointer select-none bg-secondary inline-flex items-center justify-center w-[280px] [border-width:medium] rounded-[15px] p-[14px] gap-[5px] [transition:0.3s] [&:active]:bg-[#565e64] [&:active]:[border-color:#51585e] [&:hover]:bg-primary [&:hover:active]:bg-primary [&:focus-visible]:[box-shadow:rgba(130,138,145,0.5)_0px_0px_0px_0.25rem]">
                Apply Now{' '}
                <i className="fa-solid fa-arrow-right leading-[15px] text-footer w-[18px] h-[18px] ml-[2px] text-[10px] [transform:rotate(320deg)] rounded-[100px] p-[3px] [background:#ffffff]"></i>
              </SiteLink>
            </div>
          </div>
          <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex">
            <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[50%] sm:grow-0 sm:basis-auto">
              <div className="mt-[50px] max-md:mt-[20px]">
                <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex">
                  <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[33.3333%] max-tab:flex max-tab:gap-[15px] sm:grow-0 sm:basis-auto">
                    <div className="group/gF14-154 text-center text-[#ffffff] bg-[rgba(209,93,21,0.8)] w-[180px] h-[180px] mt-0 font-trip-medium text-[18px] leading-[1.1] inline-block relative rounded-[50%] p-[30px_10px] tab:w-[200px] tab:h-[200px] tab:mt-[40px] tab:text-[20px] tab:leading-[1.3]">
                      <span className="font-trip-bold text-[60px]">
                        #1
                      </span>
                      <br />
                      <strong className="font-normal leading-[1] block max-tab:text-[18px]">
                        Experience & Recognitions
                      </strong>
                      {' '}
                      <span className="font-trip invisible z-[1] text-[#000000] text-left bg-[rgba(255,255,255,0.9)] w-[26em] text-[14px] absolute top-[-140px] left-0 [box-shadow:rgba(0,0,0,0.2)_0px_15px_30px] rounded-[10px] p-[15px] group-[:hover]/gF14-154:visible tab:w-[45em] tab:top-[-100px] [&::before]:[content:''] [&::before]:w-0 [&::before]:h-0 [&::before]:absolute [&::before]:bottom-[-14px] [&::before]:left-[80px] [&::before]:[border-top:15px_solid_rgba(255,255,255,0.9)] [&::before]:[border-right:15px_solid_rgba(0,0,0,0)] [&::before]:[border-left:15px_solid_rgba(0,0,0,0)]">
                        AME is an international Programme regulated by International Civil Aviation Organization (ICAO). IIAE trained students are serving to all major airlines and general Aviation industries in India, Nepal, Europe & Middle East. If you are looking for international destination as your career choice, AME programme conducted by IIAE is the best solution.
                      </span>
                    </div>
                    <div className="group/gF14-159 text-center text-[#ffffff] bg-[rgba(209,93,21,0.8)] w-[180px] h-[180px] mt-0 font-trip-medium text-[18px] leading-[1.1] inline-block relative rounded-[50%] p-[30px_10px] tab:w-[200px] tab:h-[200px] tab:mt-[40px] tab:text-[20px] tab:leading-[1.3]">
                      <span className="font-trip-bold text-[60px]">
                        #2
                      </span>
                      <br />
                      <strong className="font-normal leading-[1] block max-tab:text-[18px]">
                        Career Opportunities
                      </strong>
                      {' '}
                      <span className="font-trip invisible z-[1] text-[#000000] text-left bg-[rgba(255,255,255,0.9)] w-[26em] text-[14px] absolute top-[-140px] left-0 [box-shadow:rgba(0,0,0,0.2)_0px_15px_30px] rounded-[10px] p-[15px] group-[:hover]/gF14-159:visible tab:w-[45em] tab:top-[-100px] [&::before]:[content:''] [&::before]:w-0 [&::before]:h-0 [&::before]:absolute [&::before]:bottom-[-14px] [&::before]:left-[80px] [&::before]:[border-top:15px_solid_rgba(255,255,255,0.9)] [&::before]:[border-right:15px_solid_rgba(0,0,0,0)] [&::before]:[border-left:15px_solid_rgba(0,0,0,0)]">
                        India is going to be 3rd largest aviation market in the world after US & China requiring thousands of aircrafts, helicopters & extensive maintenance facility which will give opening to thousands of career opportunity in aviation industry. As per the government estimate our 3.3 lacks jobs will be created in next few years of time.
                      </span>
                    </div>
                  </div>
                  <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[33.3333%] max-tab:flex max-tab:gap-[15px] sm:grow-0 sm:basis-auto">
                    <div className="group/gF14-165 text-center text-[#ffffff] bg-[rgba(209,93,21,0.8)] w-[180px] h-[180px] mt-0 font-trip-medium text-[18px] leading-[1.1] inline-block relative ml-[5em] rounded-[50%] p-[30px_10px] tab:w-[200px] tab:h-[200px] tab:mt-[8em] tab:text-[20px] tab:leading-[1.3] tab:ml-[-3em]">
                      <span className="font-trip-bold text-[60px]">
                        #3
                      </span>
                      <br />
                      <strong className="font-normal leading-[1] block max-tab:text-[18px]">
                        Program Offered
                      </strong>
                      {' '}
                      <span className="font-trip invisible z-[1] text-[#000000] text-left bg-[rgba(255,255,255,0.9)] w-[26em] text-[14px] absolute top-[-140px] left-0 [box-shadow:rgba(0,0,0,0.2)_0px_15px_30px] rounded-[10px] p-[15px] group-[:hover]/gF14-165:visible tab:w-[45em] tab:top-[-100px] [&::before]:[content:''] [&::before]:w-0 [&::before]:h-0 [&::before]:absolute [&::before]:bottom-[-14px] [&::before]:left-[80px] [&::before]:[border-top:15px_solid_rgba(255,255,255,0.9)] [&::before]:[border-right:15px_solid_rgba(0,0,0,0)] [&::before]:[border-left:15px_solid_rgba(0,0,0,0)]">
                        AME is highly specialized program in which equal emphasis is given to theoretical and practical knowledge especially on the live Aircraft. Student gets opportunity for free hand learning on the aircrafts, which generates special skill to handle high and technology involved in aircraft operation.
                      </span>
                    </div>
                  </div>
                  <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 ml-0 lg:w-[33.3333%] tab:ml-[-60px] max-tab:flex max-tab:gap-[15px] sm:grow-0 sm:basis-auto">
                    <div className="group/gF14-171 text-center text-[#ffffff] bg-[rgba(209,93,21,0.8)] w-[180px] h-[180px] mt-0 font-trip-medium text-[18px] leading-[1.1] inline-block relative rounded-[50%] p-[30px_10px] tab:w-[200px] tab:h-[200px] tab:mt-[40px] tab:text-[20px] tab:leading-[1.3]">
                      <span className="font-trip-bold text-[60px]">
                        #4
                      </span>
                      <br />
                      <strong className="font-normal leading-[1] block max-tab:text-[18px]">
                        Course & Placements
                      </strong>
                      {' '}
                      <span className="font-trip invisible z-[1] text-[#000000] text-left bg-[rgba(255,255,255,0.9)] w-[26em] text-[14px] absolute top-[-140px] left-0 [box-shadow:rgba(0,0,0,0.2)_0px_15px_30px] rounded-[10px] p-[15px] group-[:hover]/gF14-171:visible tab:w-[45em] tab:top-[-100px] [&::before]:[content:''] [&::before]:w-0 [&::before]:h-0 [&::before]:absolute [&::before]:bottom-[-14px] [&::before]:left-[80px] [&::before]:[border-top:15px_solid_rgba(255,255,255,0.9)] [&::before]:[border-right:15px_solid_rgba(0,0,0,0)] [&::before]:[border-left:15px_solid_rgba(0,0,0,0)]">
                        We are accredited by top airline and genral Aviation companies in India and abroad for placement of our students. IIAE has placed over 90% of students in Indian & foreign airlines with high salary packages. Alumni of IIAEare spread across all major airlines in India, Middle East and European nations.
                      </span>
                    </div>
                    <div className="group/gF14-176 text-center text-[#ffffff] bg-[rgba(209,93,21,0.8)] w-[180px] h-[180px] mt-0 font-trip-medium text-[18px] leading-[1.1] inline-block relative rounded-[50%] p-[30px_10px] tab:w-[200px] tab:h-[200px] tab:mt-[40px] tab:text-[20px] tab:leading-[1.3]">
                      <span className="font-trip-bold text-[60px]">
                        #5
                      </span>
                      <br />
                      <strong className="font-normal leading-[1] block max-tab:text-[18px]">
                        International Exposures
                      </strong>
                      {' '}
                      <span className="font-trip invisible z-[1] text-[#000000] text-left bg-[rgba(255,255,255,0.9)] w-[26em] text-[14px] absolute top-[-140px] left-0 [box-shadow:rgba(0,0,0,0.2)_0px_15px_30px] rounded-[10px] p-[15px] group-[:hover]/gF14-176:visible tab:w-[45em] tab:top-[-100px] [&::before]:[content:''] [&::before]:w-0 [&::before]:h-0 [&::before]:absolute [&::before]:bottom-[-14px] [&::before]:left-[80px] [&::before]:[border-top:15px_solid_rgba(255,255,255,0.9)] [&::before]:[border-right:15px_solid_rgba(0,0,0,0)] [&::before]:[border-left:15px_solid_rgba(0,0,0,0)]">
                        AME is an international Programme regulated by International Civil Aviation Organization (ICAO). IIAE trained students are serving to all major airlines and general Aviation industries in India, Nepal, Europe & Middle East. If you are looking for international destination as your career choice, AME programme conducted by IIAE is the best solution.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[50%] sm:grow-0 sm:basis-auto">
              <div className="max-w-[500px] rounded-[20px] p-[30px] [background:#315c96] md:max-tab:max-w-full max-md:p-[20px] max-tab:mt-[30px]">
                <h4 className="text-[#ffffff] text-[25px] relative [&::after]:[content:''] [&::after]:bg-[#fcdc40] [&::after]:w-[50px] [&::after]:h-[4px] [&::after]:block [&::after]:absolute [&::after]:bottom-[-10px] [&::after]:left-0 [&::after]:rounded-[10px]">
                  Tell Us About Yourself
                </h4>
                <EnquiryForm variant="short" />
              </div>
            </div>
          </div>
        </div>
        <div className="z-[1] [background-image:url(/assets/web/images/airplan02.png)] [background-position-x:180px] [background-position-y:150px] [background-repeat:no-repeat] [background-size:70%_auto] w-full absolute top-0 bottom-0 right-auto max-md:hidden motion-reduce:[transition:none]!" data-parallax="plane2"></div>
      </section>

      <section className="pt-[60px] max-md:pt-[40px] pb-[80px]! max-md:pb-[50px]!">
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
          <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex items-center!">
            <div className="w-[58.3333%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-sm:w-full sm:grow-0 sm:basis-auto">
              <strong className="text-[#f6c006] text-[25px] block m-[0px_0px_15px] max-md:leading-[1]">
                TRANSFORMING AMBITIONS INTO REALITY
              </strong>
              <h2 className="mb-0 text-[40px] tracking-[-1px] mr-0 ml-0 max-md:text-[25px] max-md:tracking-[0px]">
                Set a Course for Success
              </h2>
              <strong className="text-[#000000] text-[18px] block m-[0px_0px_15px] max-md:text-[16px] max-md:leading-[1]">
                It is just the right time for you “To Look For A Future, If You Want To Have One.
              </strong>
              <p className="text-[18px] max-md:text-[15px]">
                Whether you are interested in Science, Aviation maintenance or Aerospace, IIAE has a solution for you. We respond to the changing world around us and our Education let you lead the way to your Successful career destination.
              </p>
              <SiteLink href="/apply-online" className="text-[#ffffff] font-trip text-[15px] font-normal leading-[1.5] text-center align-middle cursor-pointer select-none bg-secondary inline-flex items-center [border-width:medium] rounded-[15px] p-[12px_30px] gap-[5px] [transition:0.3s] [&:active]:bg-[#565e64] [&:active]:[border-color:#51585e] [&:hover]:bg-primary [&:hover:active]:bg-primary [&:focus-visible]:[box-shadow:rgba(130,138,145,0.5)_0px_0px_0px_0.25rem]">
                Apply Now{' '}
                <i className="fa-solid fa-arrow-right leading-[15px] text-footer w-[18px] h-[18px] ml-[2px] text-[10px] [transform:rotate(320deg)] rounded-[100px] p-[3px] [background:#ffffff]"></i>
              </SiteLink>
            </div>
            <div className="w-[41.6667%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-sm:w-full sm:grow-0 sm:basis-auto">
              <img src="/assets/web/images/airplan04.png" alt="Aircraft" />
            </div>
          </div>
          <div className="mt-[50px] [border:1px_solid_#f3f2ec] rounded-[20px] p-[30px] [background:#faf9f4] max-md:p-[20px]">
            <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex items-center!">
              <div className="w-[41.6667%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-sm:w-full sm:grow-0 sm:basis-auto">
                <img className="object-cover h-[470px] rounded-[18px] max-md:h-auto max-md:mb-[30px]" src="/assets/web/images/why-us.png" alt="Why choose IIAE" />
              </div>
              <div className="w-[58.3333%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-sm:w-full sm:grow-0 sm:basis-auto">
                <h2 className="mb-0 text-[40px] tracking-[-1px] mr-0 ml-0 max-md:text-[25px] max-md:tracking-[0px]">
                  Why Choose IIAE
                </h2>
                <ul>
                  <li className="mt-[10px] pl-[25px] leading-[1.3] block relative">
                    <i className="fa-solid fa-arrow-right text-[13px] absolute top-[6px] left-[5px]"></i>
                    {' '}
                    <strong className="text-[15px]! inline! text-[#000000] m-[0px_0px_15px] max-md:leading-[1]">
                      Industry Specific Training:
                    </strong>
                    {' '}
                    <b className="text-[15px]! inline!">
                      Specialized knowledge and Skilled Training
                    </b>
                    {' '}being imparted to the students, specific to{' '}
                    <b className="text-[15px]! inline!">
                      AME CAR- 147
                    </b>
                    {' '}as per expertly designed{' '}
                    <b className="text-[15px]! inline!">
                      CAR 66 Curriculum.
                    </b>
                  </li>
                  <li className="mt-[10px] pl-[25px] leading-[1.3] block relative">
                    <i className="fa-solid fa-arrow-right text-[13px] absolute top-[6px] left-[5px]"></i>
                    {' '}
                    <strong className="text-[15px]! inline! text-[#000000] m-[0px_0px_15px] max-md:leading-[1]">
                      Expert Faculty:
                    </strong>
                    {' '}When you choose{' '}
                    <b className="text-[15px]! inline!">
                      CAR 147(Basic) Program at IIAE
                    </b>
                    , it is not just an instructor at the head of the class, but they are highly experienced{' '}
                    <b className="text-[15px]! inline!">
                      Aircraft Fleet Licence holders, Experts
                    </b>
                    {' '}with real world experience.
                  </li>
                  <li className="mt-[10px] pl-[25px] leading-[1.3] block relative">
                    <i className="fa-solid fa-arrow-right text-[13px] absolute top-[6px] left-[5px]"></i>
                    {' '}
                    <strong className="text-[15px]! inline! text-[#000000] m-[0px_0px_15px] max-md:leading-[1]">
                      Academic and Career Support:
                    </strong>
                    {' '}
                    <b className="text-[15px]! inline!">
                      At IIAE
                    </b>
                    , you receive personalized Academic Counseling and a robust offering of services to{' '}
                    <b className="text-[15px]! inline!">
                      100% Help start your Aviation career
                    </b>
                    .
                  </li>
                  <li className="mt-[10px] pl-[25px] leading-[1.3] block relative">
                    <i className="fa-solid fa-arrow-right text-[13px] absolute top-[6px] left-[5px]"></i>
                    {' '}
                    <strong className="text-[15px]! inline! text-[#000000] m-[0px_0px_15px] max-md:leading-[1]">
                      Extensive Alumni Network:
                    </strong>
                    {' '}Join a Network of more than{' '}
                    <b className="text-[15px]! inline!">
                      3500 Alumni
                    </b>
                    , who are{' '}
                    <b className="text-[15px]! inline!">
                      leading the Future of their respective Airlines and General Aviation Industries across the Globe.
                    </b>
                  </li>
                  <li className="mt-[10px] pl-[25px] leading-[1.3] block relative">
                    <i className="fa-solid fa-arrow-right text-[13px] absolute top-[6px] left-[5px]"></i>
                    {' '}
                    <strong className="text-[15px]! inline! text-[#000000] m-[0px_0px_15px] max-md:leading-[1]">
                      Innovative Teaching Environment:
                    </strong>
                    {' '}
                    <b className="text-[15px]! inline!">
                      IIAE uses Student’s friendly and Innovative Teaching Environment
                    </b>
                    , using the{' '}
                    <b className="text-[15px]! inline!">
                      Most Modern Teaching Aids
                    </b>
                  </li>
                  <li className="mt-[10px] pl-[25px] leading-[1.3] block relative">
                    <i className="fa-solid fa-arrow-right text-[13px] absolute top-[6px] left-[5px]"></i>
                    {' '}
                    <strong className="text-[15px]! inline! text-[#000000] m-[0px_0px_15px] max-md:leading-[1]">
                      Excellent Facilities:
                    </strong>
                    {' '}
                    <a className="text-inherit">
                      IIAE has excellent facilities, which include the Most Modern Technical infrastructure and a rich Technical Library
                    </a>
                  </li>
                </ul>
                <SiteLink href="/apply-online" className="text-[#ffffff] font-trip text-[15px] font-normal leading-[1.5] text-center align-middle cursor-pointer select-none bg-secondary inline-flex items-center [border-width:medium] rounded-[15px] p-[12px_30px] gap-[5px] [transition:0.3s] [&:active]:bg-[#565e64] [&:active]:[border-color:#51585e] [&:hover]:bg-primary [&:hover:active]:bg-primary [&:focus-visible]:[box-shadow:rgba(130,138,145,0.5)_0px_0px_0px_0.25rem]">
                  Apply Now{' '}
                  <i className="fa-solid fa-arrow-right leading-[15px] text-footer w-[18px] h-[18px] ml-[2px] text-[10px] [transform:rotate(320deg)] rounded-[100px] p-[3px] [background:#ffffff]"></i>
                </SiteLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-[80px] bg-[#f7f7f7] relative max-md:pt-[50px] pb-[50px]! md:max-tab:pb-[30px]! tab:pb-[80px]!">
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
          <img src="/assets/web/images/faq-section.png" className="w-[350px] absolute bottom-0 left-0" alt="" />
          <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex">
            <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 relative lg:w-[33.3333%] sm:grow-0 sm:basis-auto">
              <span className="mb-[12px] text-[14px] inline-block rounded-[100px] p-[5px_25px] [background:#dedede]">
                FAQ'S Question
              </span>
              <h2 className="text-[40px] tracking-[-1px] max-md:text-[25px] max-md:tracking-[0px]">
                FAQs on Aircraft Maintenance Engineering Course.
              </h2>
              <SiteLink href="/apply-online" className="text-[#ffffff] font-trip text-[15px] font-normal leading-[1.5] text-center align-middle cursor-pointer select-none bg-secondary inline-flex items-center mt-[20px] [border-width:medium] rounded-[15px] p-[12px_30px] gap-[5px] [transition:0.3s] [&:active]:bg-[#565e64] [&:active]:[border-color:#51585e] [&:hover]:bg-primary [&:hover:active]:bg-primary [&:focus-visible]:[box-shadow:rgba(130,138,145,0.5)_0px_0px_0px_0.25rem]">
                Join Us Now!{' '}
                <i className="fa-solid fa-arrow-right leading-[15px] text-footer w-[18px] h-[18px] ml-[2px] text-[10px] [transform:rotate(320deg)] rounded-[100px] p-[3px] [background:#ffffff]"></i>
              </SiteLink>
            </div>
            <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[66.6667%] sm:grow-0 sm:basis-auto">
              <div className="max-tab:mt-[30px]" id="AIAEE-according">
                {home.faqs.map((faq, i) => (
          <div className="text-[#212529] mb-[15px] [border-width:medium] [border-style:none] [border-color:currentcolor] p-[12px] [background:#ffffff] [border-image:none] rounded-[12px]!" key={i}>
            <h2 className="mb-0" id={`heading${i}`}>
              <button
                className={`[box-shadow:none]! rounded-[10px]! p-[15px]! [&.collapsed]:[box-shadow:revert-layer]! [&.collapsed]:rounded-[calc(-1px_+_0.375rem)]! [&.collapsed]:p-[5px]! text-[20px] w-full text-[#000000] text-left [overflow-anchor:none] items-center flex relative [background:#f2eede] [transition:color_0.15s_ease-in-out,_background-color_0.15s_ease-in-out,_border-color_0.15s_ease-in-out,_box-shadow_0.15s_ease-in-out,_border-radius_0.15s] max-md:text-[18px] [&.collapsed]:bg-[#ffffff] [&.collapsed]:[background-image:revert-layer] [&.collapsed]:[background-position-x:revert-layer] [&.collapsed]:[background-position-y:revert-layer] [&.collapsed]:[background-size:revert-layer] [&.collapsed]:[background-repeat:revert-layer] [&.collapsed]:[background-attachment:revert-layer] [&.collapsed]:[background-origin:revert-layer] [&.collapsed]:[background-clip:revert-layer] [&.collapsed]:[border-width:0px] motion-reduce:[transition:none] [&:focus.collapsed]:[box-shadow:rgba(13,110,253,0.25)_0px_0px_0px_0.25rem]! [&:focus]:z-[3] [&:hover]:z-[2] [&:focus:hover]:z-[3] [&::after]:[background-image:url(data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2016%2016%27%20fill=%27none%27%20stroke=%27%23052c65%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpath%20d=%27m2%205%206%206%206-6%27/%3e%3c/svg%3e)] [&::after]:[transform:rotate(-180deg)] [&::after]:w-[1.25rem] [&::after]:h-[1.25rem] [&::after]:[content:''] [&::after]:[background-repeat:no-repeat] [&::after]:[background-size:1.25rem_auto] [&::after]:shrink-0 [&::after]:ml-auto [&::after]:[transition:transform_0.2s_ease-in-out] [&.collapsed::after]:[background-image:url(data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2016%2016%27%20fill=%27none%27%20stroke=%27%23212529%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpath%20d=%27m2%205%206%206%206-6%27/%3e%3c/svg%3e)] [&.collapsed::after]:[transform:revert-layer] motion-reduce:[&::after]:[transition-duration:0s] motion-reduce:[&::after]:[transition-timing-function:ease] motion-reduce:[&::after]:[transition-property:none] ${i === 0 ? '' : 'collapsed'}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${i}`}
                aria-expanded={i === 0}
                aria-controls={`collapse${i}`}
              >
                Q1. {faq.question}
              </button>
            </h2>
            <div
              id={`collapse${i}`}
              className={`collapse rounded-br-[0.375rem] rounded-bl-[0.375rem] [&.collapse]:hidden [&.collapse.show]:[display:revert-layer] [&.collapsing]:h-0 [&.collapsing]:overflow-hidden [&.collapsing]:[transition:height_0.35s] motion-reduce:[&.collapsing]:[transition-duration:0s] motion-reduce:[&.collapsing]:[transition-property:none] ${i === 0 ? 'show' : ''}`}
              aria-labelledby={`heading${i}`}
              data-bs-parent="#AIAEE-according"
            >
              <div className="p-[1rem_1.25rem_0px]">{renderHtml(faq.answer)}</div>
            </div>
          </div>
        ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-[80px] max-md:pt-[50px] pb-[80px]! max-md:pb-[50px]!">
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
          <h2 className="text-[40px] tracking-[-1px] max-md:text-[25px] max-md:tracking-[0px]">
            Our Testimonial
          </h2>
          <div className="mt-[30px]">
            <Slider className="[&_.swiper-wrapper]:[transform:translate(0px,_0px)]"
              variant="testimonial-slide"
              slides={[
                {
                  className: 'rounded-[20px] p-[25px] [background:#f7f7f7]',
                  content: (
                    <>
                      <div className="flex! text-[#f3bb00] mb-[10px] text-[13px] gap-[2px]">
                        <i className="fa-solid fa-star"></i>
                        {' '}
                        <i className="fa-solid fa-star"></i>
                        {' '}
                        <i className="fa-solid fa-star"></i>
                        {' '}
                        <i className="fa-solid fa-star"></i>
                        {' '}
                        <i className="fa-solid fa-star"></i>
                      </div>
                      <p>
                        Studying the AME course from IIAE is one of the best decisions that I have ever made. Their faculty, programs, and placements are absolutely the best. Their practical training helps in understanding each bit of the aircraft maintenance and aviation sector. If anybody wants to create a bright future in the field of the aviation industry, I would love to recommend the Indian Institute of Aircraft Engineering.
                      </p>
                      <div className="flex! items-center gap-[15px]">
                        <img className="w-[80px] h-[80px] rounded-[100px]" src="/assets/web/images/Sunil-YadavAME-at-Air-Asia.jpg" alt="placements" />
                        <div >
                          <span className="font-trip-medium text-[18px]">
                            Sunil Yadav
                          </span>
                          <p className="mb-0 mr-0 ml-0">
                            (AME at Air Asia)
                          </p>
                        </div>
                      </div>
                    </>
                  ),
                },
                {
                  className: 'rounded-[20px] p-[25px] [background:#f7f7f7]',
                  content: (
                    <>
                      <div className="flex! text-[#f3bb00] mb-[10px] text-[13px] gap-[2px]">
                        <i className="fa-solid fa-star"></i>
                        {' '}
                        <i className="fa-solid fa-star"></i>
                        {' '}
                        <i className="fa-solid fa-star"></i>
                        {' '}
                        <i className="fa-solid fa-star"></i>
                        {' '}
                        <i className="fa-solid fa-star"></i>
                      </div>
                      <p>
                        Getting into the aviation sector was my dream. IIAE was the platform that provided me with opportunities to upgrade my knowledge & skills. The faculty was so supportive & humble towards students. They were ready to resolve our doubts whenever we approached them. From minimal knowledge of the aviation sector to becoming the AME at Indigo is a prime example of my growth with IIAE.
                      </p>
                      <div className="flex! items-center gap-[15px]">
                        <img className="w-[80px] h-[80px] rounded-[100px]" src="/assets/web/images/Pt-Shankar-Attri.jpg" alt="placements" />
                        <div >
                          <span className="font-trip-medium text-[18px]">
                            Pt Shankar Attri
                          </span>
                          <p className="mb-0 mr-0 ml-0">
                            (AME at IndiGo)
                          </p>
                        </div>
                      </div>
                    </>
                  ),
                },
                {
                  className: 'rounded-[20px] p-[25px] [background:#f7f7f7]',
                  content: (
                    <>
                      <div className="flex! text-[#f3bb00] mb-[10px] text-[13px] gap-[2px]">
                        <i className="fa-solid fa-star"></i>
                        {' '}
                        <i className="fa-solid fa-star"></i>
                        {' '}
                        <i className="fa-solid fa-star"></i>
                        {' '}
                        <i className="fa-solid fa-star"></i>
                        {' '}
                        <i className="fa-solid fa-star"></i>
                      </div>
                      <p>
                        This DGCA Approved Aircraft Maintenance Engineering Institute is best for those aspirants who want to get a government-approved AME license in order to get a respectable job in the aviation sector. With the help of their course structure and practical training, I got a high-earning job at Blue Dart. I would like to thank all the dedicated faculty of IIAE who help me throughout the AME program.
                      </p>
                      <div className="flex! items-center gap-[15px]">
                        <img className="w-[80px] h-[80px] rounded-[100px]" src="/assets/web/images/Alok_Ranjan.jpg" alt="placements" />
                        <div >
                          <span className="font-trip-medium text-[18px]">
                            Alok Ranjan
                          </span>
                          <p className="mb-0 mr-0 ml-0">
                            (Maintenance Manager at Blue Dart)
                          </p>
                        </div>
                      </div>
                    </>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="pb-[80px]! max-md:pb-[50px]!">
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
          <h2 className="text-[40px] tracking-[-1px] max-md:text-[25px] max-md:tracking-[0px]">
            IIAE Reach New Heights
          </h2>
          <p>
            As the world’s largest and most respected university specializing in aviation and aerospace, IIAE has been at the forefront of ground-breaking aeronautical milestones since the early days of flight.
          </p>
          <div className="mt-[30px] [border:1px_solid_#ededed] rounded-[18px] p-0 overflow-hidden">
            <Slider className="[&_.swiper-button-prev]:top-[40px] [&_.swiper-button-prev]:left-[unset] [&_.swiper-button-prev]:absolute [&_.swiper-button-prev]:mt-[calc(-22px)] [&_.swiper-button-prev]:z-[10] [&_.swiper-button-prev]:cursor-pointer [&_.swiper-button-prev]:text-[#007aff] [&_.swiper-button-prev]:justify-center [&_.swiper-button-prev]:items-center [&_.swiper-button-prev]:flex [&_.swiper-button-prev]:[border:1px_solid_#ededed] [&_.swiper-button-prev]:rounded-[100px] [&_.swiper-button-prev]:[background:#ffffff] [&_.swiper-button-prev]:w-[35px]! [&_.swiper-button-prev]:h-[35px]! [&_.swiper-button-prev]:right-[65px]! [&_.swiper-button-prev.swiper-button-disabled]:cursor-auto [&_.swiper-button-prev.swiper-button-disabled]:opacity-[0.35] [&_.swiper-button-prev.swiper-button-disabled]:pointer-events-none [&_.swiper-button-prev.swiper-button-hidden]:cursor-auto [&_.swiper-button-prev.swiper-button-hidden]:opacity-[0] [&_.swiper-button-prev.swiper-button-hidden]:pointer-events-none [&_.swiper-button-prev.swiper-button-lock]:hidden [&_.swiper-button-prev.swiper-pagination-lock]:hidden [&_.swiper-button-prev.swiper-button-disabled.swiper-button-hidden]:opacity-[0] [&_.swiper-button-prev::after]:text-[#000000] [&_.swiper-button-prev::after]:[font-family:swiper-icons] [&_.swiper-button-prev::after]:tracking-[0px] [&_.swiper-button-prev::after]:leading-[1] [&_.swiper-button-prev::after]:[font-variant:initial] [&_.swiper-button-prev::after]:text-[14px]! [&_.swiper-button-prev::after]:normal-case! [&_.swiper-button-next]:top-[40px] [&_.swiper-button-next]:left-[unset] [&_.swiper-button-next]:absolute [&_.swiper-button-next]:mt-[calc(-22px)] [&_.swiper-button-next]:z-[10] [&_.swiper-button-next]:cursor-pointer [&_.swiper-button-next]:text-[#007aff] [&_.swiper-button-next]:justify-center [&_.swiper-button-next]:items-center [&_.swiper-button-next]:flex [&_.swiper-button-next]:[border:1px_solid_#ededed] [&_.swiper-button-next]:rounded-[100px] [&_.swiper-button-next]:[background:#ffffff] [&_.swiper-button-next]:w-[35px]! [&_.swiper-button-next]:h-[35px]! [&_.swiper-button-next]:right-[20px]! [&_.swiper-button-next.swiper-button-disabled]:cursor-auto [&_.swiper-button-next.swiper-button-disabled]:opacity-[0.35] [&_.swiper-button-next.swiper-button-disabled]:pointer-events-none [&_.swiper-button-next.swiper-button-hidden]:cursor-auto [&_.swiper-button-next.swiper-button-hidden]:opacity-[0] [&_.swiper-button-next.swiper-button-hidden]:pointer-events-none [&_.swiper-button-next.swiper-button-lock]:hidden [&_.swiper-button-next.swiper-pagination-lock]:hidden [&_.swiper-button-next.swiper-button-disabled.swiper-button-hidden]:opacity-[0] [&_.swiper-button-next::after]:text-[#000000] [&_.swiper-button-next::after]:[font-family:swiper-icons] [&_.swiper-button-next::after]:tracking-[0px] [&_.swiper-button-next::after]:leading-[1] [&_.swiper-button-next::after]:[font-variant:initial] [&_.swiper-button-next::after]:text-[14px]! [&_.swiper-button-next::after]:normal-case! [&_.swiper-wrapper]:[transform:translate(0px,_0px)]"
              variant="reach-slide"
              slides={[
                {
                  className: 'rounded-[18px] p-[15px] [background:#f7f7f7]',
                  content: (
                    <>
                      <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex [&.swiper-button-lock]:hidden [&.swiper-pagination-lock]:hidden items-center!">
                        <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[41.6667%] sm:grow-0 sm:basis-auto">
                          <div className="rounded-[15px] p-[20px] [background:#ffffff] overflow-hidden">
                            <img src="/assets/web/images/1998.png" alt="1998" />
                          </div>
                        </div>
                        <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[58.3333%] sm:grow-0 sm:basis-auto">
                          <h3 className="max-md:mt-[20px] max-md:text-[40px] text-[50px] font-trip-bold">
                            1998
                          </h3>
                          <p>
                            IIAE PATNA APPROVED IN AVIONICS CATEGORY TO COVER FOR RADIO NAVIGATION SYSTEM BY DGCA, MINISTRY OF CIVIL AVIATION, GOVT. OF INDIA AS PER CAR SECTION-2, SERIES- E, PART-VIII
                          </p>
                          <SiteLink href="/apply-online" className="text-[#ffffff] font-trip text-[15px] font-normal leading-[1.5] text-center align-middle cursor-pointer select-none bg-secondary inline-flex items-center [border-width:medium] rounded-[15px] p-[12px_30px] gap-[5px] [transition:0.3s] [&:active]:bg-[#565e64] [&:active]:[border-color:#51585e] [&:hover]:bg-primary [&:hover:active]:bg-primary [&:focus-visible]:[box-shadow:rgba(130,138,145,0.5)_0px_0px_0px_0.25rem]">
                            Join Us Now!{' '}
                            <i className="fa-solid fa-arrow-right [&.swiper-button-lock]:inline-block [&.swiper-pagination-lock]:inline-block leading-[15px] text-footer w-[18px] h-[18px] ml-[2px] text-[10px] [transform:rotate(320deg)] rounded-[100px] p-[3px] [background:#ffffff]"></i>
                          </SiteLink>
                        </div>
                      </div>
                    </>
                  ),
                },
                {
                  className: 'rounded-[18px] p-[15px] [background:#f7f7f7]',
                  content: (
                    <>
                      <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex [&.swiper-button-lock]:hidden [&.swiper-pagination-lock]:hidden items-center!">
                        <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[41.6667%] sm:grow-0 sm:basis-auto">
                          <div className="rounded-[15px] p-[20px] [background:#ffffff] overflow-hidden">
                            <img src="/assets/web/images/2002.png" alt="2002" />
                          </div>
                        </div>
                        <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[58.3333%] sm:grow-0 sm:basis-auto">
                          <h3 className="max-md:mt-[20px] max-md:text-[40px] text-[50px] font-trip-bold">
                            2002
                          </h3>
                          <p>
                            2002 IIAE DELHI APPROVED BY DGCA, MINISTRY OF CIVIL AVIATION, GOVT. OF INDIA AS PER CAR SECTION-2, SERIES- E, PART-VIII
                          </p>
                          <SiteLink href="/apply-online" className="text-[#ffffff] font-trip text-[15px] font-normal leading-[1.5] text-center align-middle cursor-pointer select-none bg-secondary inline-flex items-center [border-width:medium] rounded-[15px] p-[12px_30px] gap-[5px] [transition:0.3s] [&:active]:bg-[#565e64] [&:active]:[border-color:#51585e] [&:hover]:bg-primary [&:hover:active]:bg-primary [&:focus-visible]:[box-shadow:rgba(130,138,145,0.5)_0px_0px_0px_0.25rem]">
                            Join Us Now!{' '}
                            <i className="fa-solid fa-arrow-right [&.swiper-button-lock]:inline-block [&.swiper-pagination-lock]:inline-block leading-[15px] text-footer w-[18px] h-[18px] ml-[2px] text-[10px] [transform:rotate(320deg)] rounded-[100px] p-[3px] [background:#ffffff]"></i>
                          </SiteLink>
                        </div>
                      </div>
                    </>
                  ),
                },
                {
                  className: 'rounded-[18px] p-[15px] [background:#f7f7f7]',
                  content: (
                    <>
                      <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex [&.swiper-button-lock]:hidden [&.swiper-pagination-lock]:hidden items-center!">
                        <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[41.6667%] sm:grow-0 sm:basis-auto">
                          <div className="rounded-[15px] p-[20px] [background:#ffffff] overflow-hidden">
                            <img src="/assets/web/images/2006.png" alt="2006" />
                          </div>
                        </div>
                        <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[58.3333%] sm:grow-0 sm:basis-auto">
                          <h3 className="max-md:mt-[20px] max-md:text-[40px] text-[50px] font-trip-bold">
                            2006
                          </h3>
                          <p>
                            IIAE DELHI APPROVED FOR EXTENSION OF APPROVAL TO COVER FOR JET ENGINE SYSTEM IN MECHANICAL CATEGORY BY DGCA, MINISTRY OF CIVIL AVIATION, GOVT. OF INDIA AS PER CAR SECTION-2, SERIES- E, PART-VIII
                          </p>
                          <SiteLink href="/apply-online" className="text-[#ffffff] font-trip text-[15px] font-normal leading-[1.5] text-center align-middle cursor-pointer select-none bg-secondary inline-flex items-center [border-width:medium] rounded-[15px] p-[12px_30px] gap-[5px] [transition:0.3s] [&:active]:bg-[#565e64] [&:active]:[border-color:#51585e] [&:hover]:bg-primary [&:hover:active]:bg-primary [&:focus-visible]:[box-shadow:rgba(130,138,145,0.5)_0px_0px_0px_0.25rem]">
                            Join Us Now!{' '}
                            <i className="fa-solid fa-arrow-right [&.swiper-button-lock]:inline-block [&.swiper-pagination-lock]:inline-block leading-[15px] text-footer w-[18px] h-[18px] ml-[2px] text-[10px] [transform:rotate(320deg)] rounded-[100px] p-[3px] [background:#ffffff]"></i>
                          </SiteLink>
                        </div>
                      </div>
                    </>
                  ),
                },
                {
                  className: 'rounded-[18px] p-[15px] [background:#f7f7f7]',
                  content: (
                    <>
                      <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex [&.swiper-button-lock]:hidden [&.swiper-pagination-lock]:hidden items-center!">
                        <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[41.6667%] sm:grow-0 sm:basis-auto">
                          <div className="rounded-[15px] p-[20px] [background:#ffffff] overflow-hidden">
                            <img src="/assets/web/images/2007.png" alt="2007" />
                          </div>
                        </div>
                        <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[58.3333%] sm:grow-0 sm:basis-auto">
                          <h3 className="max-md:mt-[20px] max-md:text-[40px] text-[50px] font-trip-bold">
                            2007
                          </h3>
                          <p>
                            IIAE DELHI APPROVED FOR EXTENSION OF APPROVAL TO COVER FOR ELECTRICAL AND INSTRUMENT SYSTEM IN AVIONICS CATEGORY BY DGCA, MINISTRY OF CIVIL AVIATION, GOVT. OF INDIA AS PER CAR SECTION-2, SERIES- E, PART-VIII
                          </p>
                          <SiteLink href="/apply-online" className="text-[#ffffff] font-trip text-[15px] font-normal leading-[1.5] text-center align-middle cursor-pointer select-none bg-secondary inline-flex items-center [border-width:medium] rounded-[15px] p-[12px_30px] gap-[5px] [transition:0.3s] [&:active]:bg-[#565e64] [&:active]:[border-color:#51585e] [&:hover]:bg-primary [&:hover:active]:bg-primary [&:focus-visible]:[box-shadow:rgba(130,138,145,0.5)_0px_0px_0px_0.25rem]">
                            Join Us Now!{' '}
                            <i className="fa-solid fa-arrow-right [&.swiper-button-lock]:inline-block [&.swiper-pagination-lock]:inline-block leading-[15px] text-footer w-[18px] h-[18px] ml-[2px] text-[10px] [transform:rotate(320deg)] rounded-[100px] p-[3px] [background:#ffffff]"></i>
                          </SiteLink>
                        </div>
                      </div>
                    </>
                  ),
                },
                {
                  className: 'rounded-[18px] p-[15px] [background:#f7f7f7]',
                  content: (
                    <>
                      <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex [&.swiper-button-lock]:hidden [&.swiper-pagination-lock]:hidden items-center!">
                        <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[41.6667%] sm:grow-0 sm:basis-auto">
                          <div className="rounded-[15px] p-[20px] [background:#ffffff] overflow-hidden">
                            <img src="/assets/web/images/2009.png" alt="2009" />
                          </div>
                        </div>
                        <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[58.3333%] sm:grow-0 sm:basis-auto">
                          <h3 className="max-md:mt-[20px] max-md:text-[40px] text-[50px] font-trip-bold">
                            2009
                          </h3>
                          <p>
                            IIAE DELHI APPROVED FOR EXTENSION OF APPROVAL TO COVER FOR HEAVY AEROPLANE IN MECHANICAL CATEGORY BY DGCA, MINISTRY OF CIVIL AVIATION, GOVT. OF INDIA AS PER CAR SECTION-2, SERIES- E, PART-VIII
                          </p>
                          <SiteLink href="/apply-online" className="text-[#ffffff] font-trip text-[15px] font-normal leading-[1.5] text-center align-middle cursor-pointer select-none bg-secondary inline-flex items-center [border-width:medium] rounded-[15px] p-[12px_30px] gap-[5px] [transition:0.3s] [&:active]:bg-[#565e64] [&:active]:[border-color:#51585e] [&:hover]:bg-primary [&:hover:active]:bg-primary [&:focus-visible]:[box-shadow:rgba(130,138,145,0.5)_0px_0px_0px_0.25rem]">
                            Join Us Now!{' '}
                            <i className="fa-solid fa-arrow-right [&.swiper-button-lock]:inline-block [&.swiper-pagination-lock]:inline-block leading-[15px] text-footer w-[18px] h-[18px] ml-[2px] text-[10px] [transform:rotate(320deg)] rounded-[100px] p-[3px] [background:#ffffff]"></i>
                          </SiteLink>
                        </div>
                      </div>
                    </>
                  ),
                },
                {
                  className: 'rounded-[18px] p-[15px] [background:#f7f7f7]',
                  content: (
                    <>
                      <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex [&.swiper-button-lock]:hidden [&.swiper-pagination-lock]:hidden items-center!">
                        <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[41.6667%] sm:grow-0 sm:basis-auto">
                          <div className="rounded-[15px] p-[20px] [background:#ffffff] overflow-hidden">
                            <img src="/assets/web/images/2010.png" alt="2010" />
                          </div>
                        </div>
                        <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[58.3333%] sm:grow-0 sm:basis-auto">
                          <h3 className="max-md:mt-[20px] max-md:text-[40px] text-[50px] font-trip-bold">
                            2010
                          </h3>
                          <p>
                            IIAE DELHI APPROVED FOR FULL SCOPE TO COVER FOR AVIONICS CATEGORY (ELECTRICAL, INSTRUMENT & RADIO NAVIGATION SYSTEMS) AND MECHANICAL CATEGORY (AIRPLANE & POWERPLANT) BY DGCA, MINISTRY OF CIVIL AVIATION, GOVT. OF INDIA AS PER CAR SECTION-2, SERIES- E, PART-VIII
                          </p>
                          <SiteLink href="/apply-online" className="text-[#ffffff] font-trip text-[15px] font-normal leading-[1.5] text-center align-middle cursor-pointer select-none bg-secondary inline-flex items-center [border-width:medium] rounded-[15px] p-[12px_30px] gap-[5px] [transition:0.3s] [&:active]:bg-[#565e64] [&:active]:[border-color:#51585e] [&:hover]:bg-primary [&:hover:active]:bg-primary [&:focus-visible]:[box-shadow:rgba(130,138,145,0.5)_0px_0px_0px_0.25rem]">
                            Join Us Now!{' '}
                            <i className="fa-solid fa-arrow-right [&.swiper-button-lock]:inline-block [&.swiper-pagination-lock]:inline-block leading-[15px] text-footer w-[18px] h-[18px] ml-[2px] text-[10px] [transform:rotate(320deg)] rounded-[100px] p-[3px] [background:#ffffff]"></i>
                          </SiteLink>
                        </div>
                      </div>
                    </>
                  ),
                },
                {
                  className: 'rounded-[18px] p-[15px] [background:#f7f7f7]',
                  content: (
                    <>
                      <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex [&.swiper-button-lock]:hidden [&.swiper-pagination-lock]:hidden items-center!">
                        <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[41.6667%] sm:grow-0 sm:basis-auto">
                          <div className="rounded-[15px] p-[20px] [background:#ffffff] overflow-hidden">
                            <img src="/assets/web/images/2018.png" alt="2018" />
                          </div>
                        </div>
                        <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[58.3333%] sm:grow-0 sm:basis-auto">
                          <h3 className="max-md:mt-[20px] max-md:text-[40px] text-[50px] font-trip-bold">
                            2018
                          </h3>
                          <p>
                            2018 IIAE APPROVED AS BASIC MAINTENANCE TRAINING ORGANISATION (CAR I47-BASIC) TO COVER FOR B1.1 (AEROPLANE TURBINE) & B2(AVIONICS) CATEGORY
                          </p>
                          <SiteLink href="/apply-online" className="text-[#ffffff] font-trip text-[15px] font-normal leading-[1.5] text-center align-middle cursor-pointer select-none bg-secondary inline-flex items-center [border-width:medium] rounded-[15px] p-[12px_30px] gap-[5px] [transition:0.3s] [&:active]:bg-[#565e64] [&:active]:[border-color:#51585e] [&:hover]:bg-primary [&:hover:active]:bg-primary [&:focus-visible]:[box-shadow:rgba(130,138,145,0.5)_0px_0px_0px_0.25rem]">
                            Join Us Now!{' '}
                            <i className="fa-solid fa-arrow-right [&.swiper-button-lock]:inline-block [&.swiper-pagination-lock]:inline-block leading-[15px] text-footer w-[18px] h-[18px] ml-[2px] text-[10px] [transform:rotate(320deg)] rounded-[100px] p-[3px] [background:#ffffff]"></i>
                          </SiteLink>
                        </div>
                      </div>
                    </>
                  ),
                },
                {
                  className: 'rounded-[18px] p-[15px] [background:#f7f7f7]',
                  content: (
                    <>
                      <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex [&.swiper-button-lock]:hidden [&.swiper-pagination-lock]:hidden items-center!">
                        <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[41.6667%] sm:grow-0 sm:basis-auto">
                          <div className="rounded-[15px] p-[20px] [background:#ffffff] overflow-hidden">
                            <img src="/assets/web/images/2025.png" alt="2025" />
                          </div>
                        </div>
                        <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:w-[58.3333%] sm:grow-0 sm:basis-auto">
                          <h3 className="max-md:mt-[20px] max-md:text-[40px] text-[50px] font-trip-bold">
                            2025
                          </h3>
                          <p>
                            IIAE Delhi has been approved by DGCA for enhancement of training capacity from a total of 60 training seats to 120 training seats, comprising 60 training seats for B1.1 and B2 categories each.
                          </p>
                          <SiteLink href="/apply-online" className="text-[#ffffff] font-trip text-[15px] font-normal leading-[1.5] text-center align-middle cursor-pointer select-none bg-secondary inline-flex items-center [border-width:medium] rounded-[15px] p-[12px_30px] gap-[5px] [transition:0.3s] [&:active]:bg-[#565e64] [&:active]:[border-color:#51585e] [&:hover]:bg-primary [&:hover:active]:bg-primary [&:focus-visible]:[box-shadow:rgba(130,138,145,0.5)_0px_0px_0px_0.25rem]">
                            Join Us Now!{' '}
                            <i className="fa-solid fa-arrow-right [&.swiper-button-lock]:inline-block [&.swiper-pagination-lock]:inline-block leading-[15px] text-footer w-[18px] h-[18px] ml-[2px] text-[10px] [transform:rotate(320deg)] rounded-[100px] p-[3px] [background:#ffffff]"></i>
                          </SiteLink>
                        </div>
                      </div>
                    </>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </section>
      <PlaneParallax />
    </div>
  );
}
