import PageSubheader from '@/components/layout/PageSubheader';
import { facultyImageUrl, listFaculty } from '@/lib/faculty';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  return pageMetadata('/faculties');
}
// Faculty comes from the CRM API; refresh in the background, and at once when the CRM calls /api/revalidate.
export const revalidate = 60;

export default async function FacultiesPage() {
  const faculty = await listFaculty();
  return (
    <div>
      <PageSubheader title="Faculty Directory" />
      <section className="pt-[80px] max-md:pt-[50px] pb-[80px]! max-md:pb-[50px]!">
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
          <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex">
            <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 lg:grow-0 lg:basis-auto">
              <table className="max-md:text-[12px] max-md:leading-[1.2] max-md:block max-md:overflow-x-auto max-md:p-0">
                <thead>
                  <tr>
                    <th className="max-md:p-[5px_10px]! [background:#f4f4f4] max-md:hidden">SL. NO.</th>
                    <th className="max-md:p-[5px_10px]! [background:#f4f4f4]">Image</th>
                    <th className="max-md:p-[5px_10px]! [background:#f4f4f4]">Name</th>
                    <th className="max-md:p-[5px_10px]! [background:#f4f4f4]">Post</th>
                    <th className="max-md:p-[5px_10px]! [background:#f4f4f4]">Experience</th>
                    <th className="max-md:p-[5px_10px]! [background:#f4f4f4]">Competency</th>
                  </tr>
                </thead>
                <tbody>
                  {faculty.length ? (
                    faculty.map((f, i) => (
                      <tr className="group/gF7-15" key={f._id || f.name}>
                        <td className="max-md:p-[5px_10px]! max-md:hidden group-[:nth-child(2n+2)]/gF7-15:[background:#f7f8fa]">{i + 1}</td>
                        <td className="max-md:p-[5px_10px]! group-[:nth-child(2n+2)]/gF7-15:[background:#f7f8fa]">
                          <img
                            src={facultyImageUrl(f.image)}
                            alt={f.name}
                            width={150}
                            loading="lazy"
                          />
                        </td>
                        <td className="max-md:p-[5px_10px]! group-[:nth-child(2n+2)]/gF7-15:[background:#f7f8fa]">{f.name}</td>
                        <td className="max-md:p-[5px_10px]! group-[:nth-child(2n+2)]/gF7-15:[background:#f7f8fa]">{f.post}</td>
                        <td className="max-md:p-[5px_10px]! group-[:nth-child(2n+2)]/gF7-15:[background:#f7f8fa]">{f.experience}</td>
                        <td className="max-md:p-[5px_10px]! group-[:nth-child(2n+2)]/gF7-15:[background:#f7f8fa]">{f.competency}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>There is no record.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
