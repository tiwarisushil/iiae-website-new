import PageSubheader from '@/components/layout/PageSubheader';
import { degree } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import SiteLink from '@/components/SiteLink';

export async function generateMetadata() {
  return pageMetadata('/degree');
}

// The filters and the (currently empty) programme grid mirror the live page. The
// old site filtered programme records from the CMS; none are published today, so
// #itemList renders empty there too. Add programmes here when they exist.
const programs: { image: string | null; subtitle: string; description: string }[] = [];

export default function DegreePage() {
  return (
    <div>
      <PageSubheader title="Degrees & Programs" />

      <section className="pt-[40px]! max-md:pt-[20px]!">
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
          <p className="pb-[20px]!">
            The Indian Institute of Aircraft Engineering (IIAE) is approved by the Directorate General of Civil Aviation
            (DGCA), Ministry of Civil Aviation, Govt. of India to provide CAR 147 (Basic) Aircraft Maintenance Engineering
            (AME) Training and to award the Certificate of Recognition (C Of R) to its students for giving the competency
            in Basic AME Category B1.1 and B2, vide its Reference No:{' '}
            <SiteLink href="/approved-by-dgca">DGCA/CAR-147(B)/12 dated 9th August, 2018.</SiteLink>
          </p>
          <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex">
            <fieldset className="pr-[calc(0.75rem)] pl-[calc(0.75rem)] w-[41.6667%] max-w-full shrink-0 max-sm:w-full sm:grow-0 sm:basis-auto">
              <h5 className="text-[17px]">Degree Level</h5>
              <div className="flex gap-[15px]" id="degreeFilters">
                {degree.degreeLevels.map((d) => (
                  <div className="min-h-[1.5rem] mb-[0.125rem] block cursor-pointer leading-[1] rounded-[10px] p-[10px_15px_10px_35px] [background:#172e6d]" key={d.id}>
                    <input className="peer/pF6-10 ml-[-1.5em] float-left align-top [appearance:none] bg-[#ffffff] [background-image:unset] [print-color-adjust:exact] [background-position-x:50%] [background-position-y:center] [background-repeat:no-repeat] [background-size:contain] shrink-0 w-[1em] h-[1em] [border:1px_solid_#dee2e6] rounded-[0.25em] [&:checked]:bg-[#0d6efd] [&:checked]:[background-image:url(data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20fill=%27none%27%20stroke=%27%23fff%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%273%27%20d=%27m6%2010%203%203%206-6%27/%3e%3c/svg%3e)] [&:checked]:[border-color:#0d6efd] [&:indeterminate]:bg-[#0d6efd] [&:indeterminate]:[background-image:url(data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20fill=%27none%27%20stroke=%27%23fff%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%273%27%20d=%27M6%2010h8%27/%3e%3c/svg%3e)] [&:indeterminate]:[border-color:#0d6efd] [&:checked:indeterminate]:[background-image:url(data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20fill=%27none%27%20stroke=%27%23fff%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%273%27%20d=%27M6%2010h8%27/%3e%3c/svg%3e)] [&:focus]:[box-shadow:rgba(13,110,253,0.25)_0px_0px_0px_0.25rem] [&:focus]:[border-color:#86b7fe] [&:focus:checked]:[border-color:#0d6efd] [&:focus:indeterminate]:[border-color:#0d6efd] [&:active]:[filter:brightness(90%)] [&:disabled]:[filter:none] [&:disabled]:pointer-events-none [&:disabled]:opacity-[0.5] [&:active:disabled]:[filter:none]" type="checkbox" value={d.id} id={`degree${d.id}`} />
                    <label className="text-[#ffffff] peer-[:disabled]/pF6-10:cursor-default peer-[:disabled]/pF6-10:opacity-[0.5]" htmlFor={`degree${d.id}`}>
                      {d.label}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>

            <fieldset className="pr-[calc(0.75rem)] pl-[calc(0.75rem)] w-[41.6667%] max-w-full shrink-0 max-sm:w-full sm:grow-0 sm:basis-auto">
              <h5 className="mt-[0.5rem]! text-[17px]">Field of Study</h5>
              <div className="flex gap-[15px]" id="fieldFilters">
                {degree.fieldsOfStudy.map((f) => (
                  <div className="min-h-[1.5rem] mb-[0.125rem] block cursor-pointer leading-[1] rounded-[10px] p-[10px_15px_10px_35px] [background:#172e6d]" key={f.id}>
                    <input className="peer/pF6-16 ml-[-1.5em] float-left align-top [appearance:none] bg-[#ffffff] [background-image:unset] [print-color-adjust:exact] [background-position-x:50%] [background-position-y:center] [background-repeat:no-repeat] [background-size:contain] shrink-0 w-[1em] h-[1em] [border:1px_solid_#dee2e6] rounded-[0.25em] [&:checked]:bg-[#0d6efd] [&:checked]:[background-image:url(data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20fill=%27none%27%20stroke=%27%23fff%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%273%27%20d=%27m6%2010%203%203%206-6%27/%3e%3c/svg%3e)] [&:checked]:[border-color:#0d6efd] [&:indeterminate]:bg-[#0d6efd] [&:indeterminate]:[background-image:url(data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20fill=%27none%27%20stroke=%27%23fff%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%273%27%20d=%27M6%2010h8%27/%3e%3c/svg%3e)] [&:indeterminate]:[border-color:#0d6efd] [&:checked:indeterminate]:[background-image:url(data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20fill=%27none%27%20stroke=%27%23fff%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%273%27%20d=%27M6%2010h8%27/%3e%3c/svg%3e)] [&:focus]:[box-shadow:rgba(13,110,253,0.25)_0px_0px_0px_0.25rem] [&:focus]:[border-color:#86b7fe] [&:focus:checked]:[border-color:#0d6efd] [&:focus:indeterminate]:[border-color:#0d6efd] [&:active]:[filter:brightness(90%)] [&:disabled]:[filter:none] [&:disabled]:pointer-events-none [&:disabled]:opacity-[0.5] [&:active:disabled]:[filter:none]" type="checkbox" value={f.id} id={`fos${f.id}`} />
                    <label className="text-[#ffffff] peer-[:disabled]/pF6-16:cursor-default peer-[:disabled]/pF6-16:opacity-[0.5]" htmlFor={`fos${f.id}`}>
                      {f.label}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>
        </div>
      </section>

      <section className="pt-[60px] pb-[60px] max-md:pt-[40px] max-md:pb-[40px]">
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
          <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex" id="itemList">
            {programs.map((p) => (
              // Same card as the aircraft cards on /infrastructure (the old #itemList item).
              <div className="w-[33.3333%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] shrink-0 max-sm:w-full sm:max-md:w-[50%] mb-[1.5rem]! sm:grow-0 sm:basis-auto" key={p.subtitle}>
                <div className="min-w-0 h-[unset] text-[#212529] [overflow-wrap:break-word] bg-[#ffffff] [background-clip:border-box] flex-col flex relative [border:1px_solid_rgba(0,0,0,0.176)] rounded-[0.375rem]">
                  <div className="[color:unset] p-[1rem] [flex:1_1_auto]">
                    <img src={p.image || '/assets/web/images/image-not-available.png'} alt={p.subtitle} />
                    <div className="p-[25px]">
                      <h4>
                        <a className="text-[#172e6d] text-[22px] leading-[1.2] block">{p.subtitle}</a>
                      </h4>
                      <p className="text-[15px]">{p.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
