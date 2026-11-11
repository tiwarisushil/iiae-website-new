import NewsletterForm from '@/components/forms/NewsletterForm';
import {
  ADDRESS,
  EMAIL,
  FOOTER_BOTTOM_LINKS,
  FOOTER_USEFUL_LINKS,
  HELPLINE_PHONES,
  SOCIAL_LINKS,
} from '@/lib/site';
import SiteLink from '@/components/SiteLink';

export default function Footer() {
  return (
    <footer className="bg-footer">
      <section className="pt-[30px]! pb-[30px]! max-md:pt-[20px]! max-md:pb-[20px]! bg-[#172e6d] [border-bottom:1px_solid_#485a80]">
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
          <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex items-center!">
            <div className="w-[75%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-sm:w-full sm:grow-0 sm:basis-auto">
              <h4 className="text-[#ffffff]! mb-0 text-[25px] mr-0 ml-0 max-md:text-center">If you still have any query regarding career, contact us at +919870290573/75</h4>
            </div>
            <div className="w-[25%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-sm:w-full max-md:mt-[20px] text-right! max-md:text-center! sm:grow-0 sm:basis-auto">
              <SiteLink href="/apply-online" className="text-[#ffffff] font-trip text-[15px] font-normal leading-[1.5] text-center align-middle cursor-pointer select-none bg-secondary inline-flex items-center [border-width:medium] rounded-[15px] p-[12px_30px] gap-[5px] [transition:0.3s] [&:active]:bg-[#565e64] [&:active]:[border-color:#51585e] [&:hover]:bg-primary [&:hover:active]:bg-primary [&:focus-visible]:[box-shadow:rgba(130,138,145,0.5)_0px_0px_0px_0.25rem]">
                Apply Now <i className="fa-solid fa-arrow-right leading-[15px] text-footer w-[18px] h-[18px] ml-[2px] text-[10px] [transform:rotate(320deg)] rounded-[100px] p-[3px] [background:#ffffff]"></i>
              </SiteLink>
            </div>
          </div>
        </div>
      </section>
      <div className="pt-[60px] max-md:pt-[40px] pb-[20px]!">
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
          <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex">
            <div className="w-[33.3333%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-sm:w-full sm:max-lg:w-[50%] max-tab:mb-[30px] sm:grow-0 sm:basis-auto">
              <img className="w-[40%]" src="/assets/web/images/IIAE-LOGO.png" alt="IIAE" />
              <span className="flex! text-[#ffffff]! text-[14px] m-[15px_0px_20px] gap-[15px]">
                <i className="fa-solid fa-location-dot text-[#f6c606] mt-[5px] text-[22px]"></i> {ADDRESS}
              </span>
              <SiteLink href="/apply-online" className="text-[#ffffff] font-trip text-[15px] font-normal leading-[1.5] text-center align-middle cursor-pointer select-none bg-secondary inline-flex items-center [border-width:medium] rounded-[15px] p-[12px_30px] gap-[5px] [transition:0.3s] [&:active]:bg-[#565e64] [&:active]:[border-color:#51585e] [&:hover]:bg-primary [&:hover:active]:bg-primary [&:focus-visible]:[box-shadow:rgba(130,138,145,0.5)_0px_0px_0px_0.25rem]">
                Apply Now <i className="fa-solid fa-arrow-right leading-[15px] text-footer w-[18px] h-[18px] ml-[2px] text-[10px] [transform:rotate(320deg)] rounded-[100px] p-[3px] [background:#ffffff]"></i>
              </SiteLink>
            </div>
            <div className="w-[16.6667%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-sm:w-full sm:max-lg:w-[50%] max-md:mb-[10px] sm:grow-0 sm:basis-auto">
              <h3 className="text-[#ffffff]! text-[20px] pb-[20px] relative [&::before]:bg-secondary [&::before]:[content:''] [&::before]:w-[40px] [&::before]:h-[3px] [&::before]:absolute [&::before]:bottom-[10px] [&::before]:left-0 [&::before]:rounded-[100px]">Useful Links</h3>
              <ul >
                {FOOTER_USEFUL_LINKS.map((l) => (
                  <li key={l.href}>
                    <SiteLink className="text-[#eeeeee] text-[15px] items-center mb-[7px] flex gap-[8px] [transition:0.3s] [&:hover]:text-secondary" href={l.href}>{l.label}</SiteLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-[25%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-sm:w-full sm:max-lg:w-[50%] max-md:mb-[10px] sm:grow-0 sm:basis-auto">
              <h3 className="text-[#ffffff]! text-[20px] pb-[20px] relative [&::before]:bg-secondary [&::before]:[content:''] [&::before]:w-[40px] [&::before]:h-[3px] [&::before]:absolute [&::before]:bottom-[10px] [&::before]:left-0 [&::before]:rounded-[100px]">Admission Helpline</h3>
              <ul >
                {HELPLINE_PHONES.map((p) => (
                  <li className="mb-[12px]" key={p.tel}>
                    <SiteLink className="text-[#eeeeee] text-[15px] items-center mb-[7px] flex gap-[8px] [transition:0.3s] [&:hover]:text-secondary" href={`tel:${p.tel}`}>
                      <i className="fa-solid fa-phone"></i> {p.label}
                    </SiteLink>
                  </li>
                ))}
                <li className="mb-[12px]">
                  <SiteLink className="text-[#eeeeee] text-[15px] items-center mb-[7px] flex gap-[8px] [transition:0.3s] [&:hover]:text-secondary" href={`mailto:${EMAIL}`}>
                    <i className="fa-solid fa-envelope"></i> {EMAIL}
                  </SiteLink>
                </li>
              </ul>
            </div>
            <div className="w-[25%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-sm:w-full sm:max-lg:w-[50%] sm:grow-0 sm:basis-auto">
              <h3 className="text-[#ffffff]! text-[20px] pb-[20px] relative [&::before]:bg-secondary [&::before]:[content:''] [&::before]:w-[40px] [&::before]:h-[3px] [&::before]:absolute [&::before]:bottom-[10px] [&::before]:left-0 [&::before]:rounded-[100px]">Subscribe Newsletter</h3>
              <NewsletterForm />
              <SiteLink href="/important-dates-for-aiaee" className="text-[#ffffff] [border-bottom-width:1px] [border-bottom-style:solid] text-[15px] items-center mt-[20px] inline-flex gap-[8px]">
                AIAEE Important Dates <i className="fa-solid fa-arrow-right text-[13px]"></i>
              </SiteLink>
            </div>
          </div>
        </div>
        <div className="pt-[40px]! max-md:pt-[20px]! mt-[40px] [border-top:1px_solid_rgba(238,238,238,0.1)]">
          <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
            <ul className="mb-0 text-center w-[90%] mr-auto ml-auto max-md:text-left max-md:w-full">
              {FOOTER_BOTTOM_LINKS.map((l) => (
                <li className="inline-block m-[3px_10px] max-md:m-[1px_8px]" key={l.href}>
                  <SiteLink className="text-[#ffffff] text-[15px] [&:hover]:text-primary max-md:text-[14px]" href={l.href}>{l.label}</SiteLink>
                </li>
              ))}
            </ul>
            <ul className="mt-[25px] justify-center flex gap-[15px]">
              {SOCIAL_LINKS.filter((s) => s.href).map((s) => (
                <li key={s.icon}>
                  <a className="text-primary text-[25px] [transition:0.3s] [&:hover]:text-[#ffffff]" target="_blank" rel="noopener" href={s.href} aria-label={s.label}>
                    <i className={`fa-brands ${s.icon}`}></i>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="pt-[20px]! pb-[20px]! text-[#ffffff] text-[15px] [border-top:1px_solid_#2b3a5b] max-md:text-center max-md:justify-center">
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
          <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex">
            <div className="w-[50%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-sm:w-full sm:grow-0 sm:basis-auto">
              <p className="mb-0 mr-0 ml-0">Copyright © 2025-2026 IIAE – Indian Institute of Aircraft Engineering</p>
            </div>
            <div className="w-[50%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 text-[#eeeeee] justify-end items-center text-[15px] flex gap-[10px] max-sm:w-full max-md:justify-center max-md:text-center sm:grow-0 sm:basis-auto">
              <SiteLink className="text-[#eeeeee] text-[15px]" href="/privacy-policy">Privacy Policy</SiteLink> | <SiteLink className="text-[#eeeeee] text-[15px]" href="/terms-conditions">Terms &amp; Conditions</SiteLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
