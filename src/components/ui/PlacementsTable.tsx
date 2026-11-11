'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';

// Replaces jQuery DataTables 1.10 on /placements. The markup and class names follow
// DataTables' default DOM so the original stylesheet still applies.

const ID = 'Placement';
const LENGTHS = [10, 25, 50, 100];

type Sort = { column: number; dir: 'asc' | 'desc' };
type PageItem = number | 'ellipsis';

// Tailwind classes for the parts whose class depends on state (sorting, row parity,
// pagination buttons). The state classes stay: the variants key off them.
// String.raw keeps Tailwind's \_ (a literal underscore) intact.
const TH = String.raw`box-content [border-top-width:0px] [border-bottom-width:0px] [border-left-width:0px] text-[#000000] bg-[#ffffff] [box-shadow:transparent_0px_0px_0px_9999px_inset] pr-[18px] pl-[18px] [&:last-child]:[border-right-width:0px] [&:active]:[outline:none] [&.sorting\_asc]:cursor-pointer [&.sorting\_asc]:relative [&.sorting\_desc]:cursor-pointer [&.sorting\_desc]:relative [&.sorting]:cursor-pointer [&.sorting]:relative [&.sorting::after]:opacity-[0.3] [&.sorting::after]:block [&.sorting::after]:absolute [&.sorting::after]:bottom-[0.9em] [&.sorting::after]:[content:'↓'] [&.sorting::after]:right-[0.5em] [&.sorting\_asc::after]:opacity-[0.3] [&.sorting\_asc::after]:block [&.sorting\_asc::after]:absolute [&.sorting\_asc::after]:bottom-[0.9em] [&.sorting\_asc::after]:[content:'↓'] [&.sorting\_asc::after]:right-[0.5em] [&.sorting\_desc::after]:opacity-[1] [&.sorting\_desc::after]:block [&.sorting\_desc::after]:absolute [&.sorting\_desc::after]:bottom-[0.9em] [&.sorting\_desc::after]:[content:'↓'] [&.sorting\_desc::after]:right-[0.5em] [&.sorting.sorting\_desc::after]:opacity-[1] [&.sorting\_asc.sorting\_desc::after]:opacity-[1] [&.sorting::before]:opacity-[0.3] [&.sorting::before]:block [&.sorting::before]:absolute [&.sorting::before]:bottom-[0.9em] [&.sorting::before]:[content:'↑'] [&.sorting::before]:right-[1em] [&.sorting\_asc::before]:opacity-[1] [&.sorting\_asc::before]:block [&.sorting\_asc::before]:absolute [&.sorting\_asc::before]:bottom-[0.9em] [&.sorting\_asc::before]:[content:'↑'] [&.sorting\_asc::before]:right-[1em] [&.sorting\_desc::before]:opacity-[0.3] [&.sorting\_desc::before]:block [&.sorting\_desc::before]:absolute [&.sorting\_desc::before]:bottom-[0.9em] [&.sorting\_desc::before]:[content:'↑'] [&.sorting\_desc::before]:right-[1em] [&.sorting.sorting\_asc::before]:opacity-[1] [&.sorting\_asc.sorting\_desc::before]:opacity-[1]`;
const ROW = String.raw`group/gF30-21 [border-top-width:1px] [border-bottom-width:1px]`;
const TD = String.raw`box-content [border-top-width:0px] [border-bottom-width:0px] [border-left-width:0px] text-[#000000] bg-[#ffffff] [box-shadow:transparent_0px_0px_0px_9999px_inset] pr-[18px] pl-[18px] [&:last-child]:[border-right-width:0px] group-[:nth-of-type(2n+1)]/gF30-21:[box-shadow:rgba(0,0,0,0.05)_0px_0px_0px_9999px_inset]`;
const BUTTON = {
  previous: String.raw`text-[#333333] cursor-pointer [&.disabled]:opacity-[0.5]`,
  next: String.raw`text-[#333333] cursor-pointer`,
  page: String.raw`text-[#000000] [background-position-x:initial] [background-position-y:initial] bg-[#eeeeee] text-[14px] text-center cursor-pointer w-[30px] h-[30px] leading-[28px] [border-top:1px_solid_#dddddd] [border-right:1px_solid_#dddddd] [border-bottom:1px_solid_#dddddd] [border-left:1px_solid_#dddddd] rounded-[5px]`,
};

const range = (start: number, end: number) => Array.from({ length: end - start }, (_, i) => start + i);

/** DataTables' "simple_numbers" button list (7 buttons). */
function pageNumbers(page: number, pages: number, buttons = 7): PageItem[] {
  const half = Math.floor(buttons / 2);
  if (pages <= buttons) return range(0, pages);
  if (page <= half) return [...range(0, buttons - 2), 'ellipsis', pages - 1];
  if (page >= pages - 1 - half) return [0, 'ellipsis', ...range(pages - (buttons - 2), pages)];
  return [0, 'ellipsis', ...range(page - half + 2, page + half - 1), 'ellipsis', pages - 1];
}

export default function PlacementsTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
  // False during SSR and hydration, true afterwards: the server HTML keeps the full
  // table (as the old page did before DataTables initialised).
  const enhanced = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [query, setQuery] = useState('');
  const [length, setLength] = useState(10);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<Sort>({ column: 0, dir: 'asc' });

  const numeric = useMemo(
    () => columns.map((_, c) => rows.every((r) => r[c] === '' || !Number.isNaN(Number(r[c])))),
    [columns, rows],
  );

  const filtered = useMemo(() => {
    // DataTables "smart" search: every word must appear somewhere in the row.
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const matches = words.length ? rows.filter((r) => words.every((w) => r.join(' ').toLowerCase().includes(w))) : rows;
    const { column, dir } = sort;
    const factor = dir === 'asc' ? 1 : -1;
    return [...matches].sort((a, b) => {
      const cmp = numeric[column]
        ? Number(a[column]) - Number(b[column])
        : a[column].toLowerCase().localeCompare(b[column].toLowerCase());
      return cmp * factor;
    });
  }, [rows, query, sort, numeric]);

  if (!enhanced) {
    return (
      <table id={ID}  style={{ width: '100%' }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  const pages = Math.max(1, Math.ceil(filtered.length / length));
  const current = Math.min(page, pages - 1);
  const start = current * length;
  const visible = filtered.slice(start, start + length);
  const go = (p: number) => setPage(Math.max(0, Math.min(pages - 1, p)));
  const toggleSort = (column: number) =>
    setSort((s) => ({ column, dir: s.column === column && s.dir === 'asc' ? 'desc' : 'asc' }));
  const onKey = (fn: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn();
    }
  };

  let info = filtered.length
    ? `Showing ${start + 1} to ${start + visible.length} of ${filtered.length} entries`
    : 'Showing 0 to 0 of 0 entries';
  if (filtered.length !== rows.length) info += ` (filtered from ${rows.length} total entries)`;

  const button = (label: string, target: number, className: string, disabled: boolean, key?: string) => (
    <a
      key={key ?? label}
      id={className === 'previous' || className === 'next' ? `${ID}_${className}` : undefined}
      className={`${BUTTON[className === 'previous' || className === 'next' ? className : 'page']}${className === 'current' ? ' current' : ''}${disabled ? ' disabled' : ''}`}
      aria-controls={ID}
      role="link"
      aria-disabled={disabled || undefined}
      aria-current={className === 'current' ? 'page' : undefined}
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && go(target)}
      onKeyDown={onKey(() => !disabled && go(target))}
    >
      {label}
    </a>
  );

  return (
    <div id={`${ID}_wrapper`} >
      <div className="float-left max-md:text-center" id={`${ID}_length`}>
        <label className="flex items-center capitalize text-[15px] text-left font-normal gap-[10px] whitespace-nowrap">
          Show{' '}
          <select className="h-[35px] w-auto inline-block [border:1px_solid_#dddddd]"
            name={`${ID}_length`}
            aria-controls={ID}
            value={length}
            onChange={(e) => {
              setLength(Number(e.target.value));
              setPage(0);
            }}
          >
            {LENGTHS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>{' '}
          entries
        </label>
      </div>
      <div id={`${ID}_filter`} className="text-right max-md:text-center">
        <label className="text-left font-normal whitespace-nowrap">
          Search:
          <input className="ml-[0.5em] w-auto h-[38px] inline-block [border:1px_solid_#e1dede] rounded-[5px]"
            type="search"
            aria-controls={ID}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
          />
        </label>
      </div>
      <table
        id={ID}
        className="[border-collapse:separate]! mb-[6px]! max-w-none! mt-[6px]! align-top clear-both"
       
        aria-describedby={`${ID}_info`}
      >
        <thead className="align-bottom">
          <tr className="[border-top-width:1px] [border-bottom-width:1px] [&.sorting]:cursor-pointer [&.sorting]:relative [&.sorting\_asc]:cursor-pointer [&.sorting\_asc]:relative [&.sorting\_desc]:cursor-pointer [&.sorting\_desc]:relative [&.sorting::after]:opacity-[0.3] [&.sorting::after]:block [&.sorting::after]:absolute [&.sorting::after]:bottom-[0.9em] [&.sorting::after]:[content:'↓'] [&.sorting::after]:right-[0.5em] [&.sorting\_asc::after]:opacity-[0.3] [&.sorting\_asc::after]:block [&.sorting\_asc::after]:absolute [&.sorting\_asc::after]:bottom-[0.9em] [&.sorting\_asc::after]:[content:'↓'] [&.sorting\_asc::after]:right-[0.5em] [&.sorting\_desc::after]:opacity-[1] [&.sorting\_desc::after]:block [&.sorting\_desc::after]:absolute [&.sorting\_desc::after]:bottom-[0.9em] [&.sorting\_desc::after]:[content:'↓'] [&.sorting\_desc::after]:right-[0.5em] [&.sorting.sorting\_desc::after]:opacity-[1] [&.sorting\_asc.sorting\_desc::after]:opacity-[1] [&.sorting::before]:opacity-[0.3] [&.sorting::before]:block [&.sorting::before]:absolute [&.sorting::before]:bottom-[0.9em] [&.sorting::before]:[content:'↑'] [&.sorting::before]:right-[1em] [&.sorting\_asc::before]:opacity-[1] [&.sorting\_asc::before]:block [&.sorting\_asc::before]:absolute [&.sorting\_asc::before]:bottom-[0.9em] [&.sorting\_asc::before]:[content:'↑'] [&.sorting\_asc::before]:right-[1em] [&.sorting\_desc::before]:opacity-[0.3] [&.sorting\_desc::before]:block [&.sorting\_desc::before]:absolute [&.sorting\_desc::before]:bottom-[0.9em] [&.sorting\_desc::before]:[content:'↑'] [&.sorting\_desc::before]:right-[1em] [&.sorting.sorting\_asc::before]:opacity-[1] [&.sorting\_asc.sorting\_desc::before]:opacity-[1]" role="row">
            {columns.map((c, i) => {
              const active = sort.column === i;
              const next = active && sort.dir === 'asc' ? 'descending' : 'ascending';
              return (
                <th
                  key={c}
                  className={`${TH} ${active ? `sorting_${sort.dir}` : 'sorting'}`}
                  tabIndex={0}
                  aria-controls={ID}
                  aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                  aria-label={`${c}: activate to sort column ${next}`}
                  onClick={() => toggleSort(i)}
                  onKeyDown={onKey(() => toggleSort(i))}
                >
                  {c}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="[vertical-align:inherit]">
          {visible.length ? (
            visible.map((r, i) => (
              <tr key={`${r[0]}-${i}`} role="row" className={`${ROW} ${i % 2 ? 'even' : 'odd'}`}>
                {r.map((cell, j) => (
                  <td key={j} className={`${TD}${j === sort.column ? ' sorting_1' : ''}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr className="odd [border-top-width:1px] [border-bottom-width:1px]">
              <td colSpan={columns.length} className="box-content text-[#000000] bg-[#ffffff] [box-shadow:rgba(0,0,0,0.05)_0px_0px_0px_9999px_inset] pr-[18px] pl-[18px] text-center [border-width:0px]">
                No matching records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pt-[0.85em] whitespace-nowrap max-md:text-center" id={`${ID}_info`} role="status" aria-live="polite">
        {info}
      </div>
      <div className="float-right items-center flex text-right m-[-25px_0px_0px] gap-[5px] whitespace-nowrap max-md:mt-[10px] max-md:justify-center max-md:w-full max-md:text-center" id={`${ID}_paginate`}>
        {button('Previous', current - 1, 'previous', current === 0)}
        <span className="flex gap-[8px]">
          {pageNumbers(current, pages).map((p, i) =>
            p === 'ellipsis' ? (
              <span key={`e${i}`} className="flex gap-[8px]">
                …
              </span>
            ) : (
              button(String(p + 1), p, p === current ? 'current' : '', false, `p${p}`)
            ),
          )}
        </span>
        {button('Next', current + 1, 'next', current >= pages - 1)}
      </div>
    </div>
  );
}
