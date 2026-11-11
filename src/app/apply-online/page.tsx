import ApplyForm from '@/components/forms/ApplyForm';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  return pageMetadata('/apply-online');
}

// No subheader on this page, as on the old site.
export default function ApplyOnlinePage() {
  return (
    <section className="pt-[80px] max-md:pt-[50px] pb-[80px]! max-md:pb-[50px]!">
      <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
        <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex">
          <div className="w-full max-w-full mt-[30px] shrink-0 rounded-[20px] p-0 tab:mt-0 [background:0px_0px]!">
            <div className="ml-auto! mr-auto! p-[1.5rem]! [background:#315c96]! rounded-[18px] lg:w-[58.3333%] lg:[flex:0_0_auto]">
              <ApplyForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
