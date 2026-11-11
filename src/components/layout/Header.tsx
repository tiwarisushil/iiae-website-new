import { HEADER_PHONES, MAIN_MENU, TOP_LINKS } from '@/lib/site';
import SiteLink from '@/components/SiteLink';
import StudentLoginLink from '@/components/student/StudentLoginLink';

export default function Header() {
  return (
    <header className="max-md:flex max-md:[border-bottom:1px_solid_rgba(255,255,255,0.1)] [background:#041f45]">
      <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px] pb-[5px]">
        <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex">
          <div className="w-[25%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-sm:w-full sm:grow-0 sm:basis-auto">
            <SiteLink href="/">
              <img src="/assets/web/images/IIAE-LOGO.png" alt="IIAE" className="w-[45%] m-[10px_0px_5px] max-md:w-[50px]" />
            </SiteLink>
          </div>
          <div className="w-[41.6667%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 text-right flex-col justify-center gap-[10px] max-sm:w-full flex! max-md:hidden! sm:grow-0 sm:basis-auto">
            <strong className="text-[#ffffff] tracking-[1px] text-center font-trip-medium text-[25px] leading-[1]">
              INDIAN INSTITUTE OF <br />
              AIRCRAFT ENGINEERING
            </strong>
          </div>
          <div className="w-[33.3333%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 gap-[30px] max-sm:w-full flex! justify-end! items-center! max-md:hidden! sm:grow-0 sm:basis-auto">
            <div >
              <ul className="mb-0 [column-count:2] text-[#ffffff] mr-0 ml-0">
                {TOP_LINKS.map((link) => (
                  <li key={link.href}>
                    <SiteLink className="text-[#ffffff] pt-[5px] pb-[5px] justify-end items-center ml-[15px] flex gap-[8px] [transition:0.3s] [&:hover]:text-primary" href={link.href}>
                      <i className={`fa-solid ${link.icon}`}></i> {link.label}
                    </SiteLink>
                  </li>
                ))}
              </ul>
              <ul className="m-[5px_0px_0px] gap-[15px] flex! justify-end!">
                {HEADER_PHONES.map((p) => (
                  <li key={p.tel}>
                    <SiteLink className="text-[#ffffff] pt-[5px] pb-[5px] justify-end items-center ml-[15px] flex gap-[8px] [transition:0.3s] [&:hover]:text-primary" href={`tel:${p.tel}`}>
                      <i className="fa-solid fa-phone"></i> {p.label}
                    </SiteLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <nav className="navbar flex-wrap justify-between items-center flex relative p-0 [background:#c3a823] lg:flex-nowrap lg:justify-start max-md:[position:unset] max-md:[background-position-x:0px] max-md:[background-position-y:0px] max-md:[background-color:initial] max-md:w-[20%] [box-shadow:rgba(0,0,0,0.075)_0px_0.125rem_0.25rem]!">
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto [flex-wrap:inherit] justify-between items-center flex max-w-[1200px] md:max-tab:[justify-content:end] md:max-tab:p-[5px_15px]">
          <SiteLink className="text-[#000000] pt-[0.3125rem] pb-[0.3125rem] mr-[1rem] text-[1.25rem] hidden whitespace-nowrap" href="/">
            <img src="/assets/web/images/logo.png" alt="IIAE" />
          </SiteLink>
          <button
            className="group/gF23-23 text-[1.25rem] text-[rgba(0,0,0,0.65)] bg-[rgba(0,0,0,0)] rounded-[0.375rem] p-[0.25rem_0.75rem] [transition:box-shadow_0.15s_ease-in-out] md:max-tab:text-[25px] max-md:z-[99] max-md:p-0 tab:[border-top:1px_solid_rgba(0,0,0,0.15)] tab:[border-right:1px_solid_rgba(0,0,0,0.15)] tab:[border-bottom:1px_solid_rgba(0,0,0,0.15)] tab:[border-left:1px_solid_rgba(0,0,0,0.15)] motion-reduce:[transition-duration:0s] motion-reduce:[transition-timing-function:ease] motion-reduce:[transition-property:none] max-md:[box-shadow:none]! max-md:relative! max-md:[outline:none]! md:[&:focus]:[box-shadow:0px_0px_0px_0.25rem] [&:focus]:[text-decoration:none] [&:hover]:[text-decoration:none] lg:hidden"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fa-solid fa-bars max-md:group-[[aria-expanded=true]]/gF23-23:hidden max-md:text-[#ffffff] max-md:text-[35px]"></i>
            <i className="fa-solid fa-xmark max-tab:hidden max-md:group-[[aria-expanded=true]]/gF23-23:block max-md:text-[#ffffff] max-md:text-[35px]"></i>
          </button>
          <div className="collapse grow basis-full items-center lg:basis-auto max-md:z-[9] max-md:bg-[#8f7c20] max-md:w-full max-md:h-full max-md:absolute max-md:top-0 max-md:left-0 md:[&.collapsing]:h-0 lg:flex! max-lg:[&.collapse]:hidden max-lg:[&.collapse.show]:[display:revert-layer] [&.collapsing]:overflow-hidden [&.collapsing]:[transition:height_0.35s] motion-reduce:[&.collapsing]:[transition-duration:0s] motion-reduce:[&.collapsing]:[transition-property:none]" id="navbarSupportedContent">
            <ul className="navbar-nav mb-[0.5rem]! mr-auto! lg:mb-0! flex-col flex lg:flex-row">
              {MAIN_MENU.map((item, i) =>
                item.children ? (
                  <li className="group/gF23-28 relative" key={item.label}>
                    <a
                      className="text-[#ffffff] [font-weight:unset] block p-[15px_12px] [transition:color_0.15s_ease-in-out,_background-color_0.15s_ease-in-out,_border-color_0.15s_ease-in-out] whitespace-nowrap motion-reduce:[transition:none] [&:focus-visible]:[box-shadow:rgba(13,110,253,0.25)_0px_0px_0px_0.25rem] [&::after]:[vertical-align:0.255em] [&::after]:[content:''] [&::after]:ml-[0.255em] [&::after]:inline-block [&::after]:[border-top:0.3em_solid] [&::after]:[border-right:0.3em_solid_rgba(0,0,0,0)] [&::after]:[border-bottom:0px] [&::after]:[border-left:0.3em_solid_rgba(0,0,0,0)] [&::after]:[border-image:none]"
                      href={item.href}
                      id={`navbarDropdownMenuLink${i}`}
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      {item.label}
                    </a>
                    <ul className="dropdown-menu max-md:rounded-[10px]! max-md:p-[5px_10px]! lg:group-[:hover]/gF23-28:rounded-[10px]! lg:group-[:hover]/gF23-28:p-[5px_10px]! md:[&[data-bs-popper]]:mt-[0.125rem] z-[1000] min-w-[10rem] pt-[0.5rem] pb-[0.5rem] text-[1rem] text-[#212529] text-left bg-[#ffffff] [background-clip:padding-box] mr-0 ml-0 hidden static [border-width:1px] rounded-[0.375rem] max-md:mr-[10px] max-md:ml-[10px] max-md:[border-width:medium] lg:group-[:hover]/gF23-28:block lg:group-[:hover]/gF23-28:[border-width:medium] lg:group-[:hover]/gF23-28:[border-style:none] lg:group-[:hover]/gF23-28:[border-color:currentcolor] md:[border-style:solid] md:[border-color:rgba(0,0,0,0.176)] [&.show]:block lg:absolute [&[data-bs-popper]]:top-[100%] [&[data-bs-popper]]:left-0" aria-labelledby={`navbarDropdownMenuLink${i}`}>
                      {item.children.map((child) => (
                        <li className="max-md:p-[5px] lg:group-[:hover]/gF23-28:p-[5px_15px]" key={child.href}>
                          <SiteLink className="dropdown-item text-[#000000] w-full clear-both [text-align:inherit] bg-[rgba(0,0,0,0)] font-normal block text-[15px] rounded-none [transition:0.3s] whitespace-nowrap [&:hover]:text-secondary" href={child.href}>
                            {child.label}
                          </SiteLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li  key={item.label}>
                    <SiteLink className="text-[#ffffff] [font-weight:unset] block p-[15px_12px] [transition:color_0.15s_ease-in-out,_background-color_0.15s_ease-in-out,_border-color_0.15s_ease-in-out] motion-reduce:[transition:none] [&:focus-visible]:[box-shadow:rgba(13,110,253,0.25)_0px_0px_0px_0.25rem]" href={item.href}>
                      {item.label}
                    </SiteLink>
                  </li>
                ),
              )}
            </ul>
            <div className="max-md:justify-center max-md:m-[0px_10px]">
              <StudentLoginLink className="text-[#ffffff] [font-weight:unset] [background-position-x:initial] [background-position-y:initial] bg-[rgba(255,255,255,0.17)] flex items-center rounded-[100px] p-[5px_20px] gap-[8px] [transition:color_0.15s_ease-in-out,_background-color_0.15s_ease-in-out,_border-color_0.15s_ease-in-out] motion-reduce:[transition:none] max-md:justify-center max-md:w-[50%] [&:focus-visible]:[box-shadow:rgba(13,110,253,0.25)_0px_0px_0px_0.25rem]" />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
