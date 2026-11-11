'use client';

// Form inputs shared by the registration form and the profile editor.
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { districtsForState, INDIA_STATES } from '@/lib/student/india';
import { buttonClass, cx, Field, inputClass } from './ui';

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const IMAGE_MAX_BYTES = 512 * 1024;

/**
 * Passport photo shape, width ÷ height. The standard 3.5 × 4.5 cm photo is about 0.78; common
 * portrait crops close to it (3:4, 4:5, 5:6) are accepted too. Square and landscape photos are not.
 */
export const PASSPORT_RATIO = { min: 0.7, max: 0.86 };

/** A blob URL previewing a chosen file, released when the file changes. */
export function useObjectUrl(file: File | null) {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);
  // Revoked when replaced, not on unmount: Strict Mode re-runs effects with the same URL.
  const previous = useRef('');
  useEffect(() => {
    if (previous.current && previous.current !== url) URL.revokeObjectURL(previous.current);
    previous.current = url;
  }, [url]);
  return url;
}

/** State and district inputs with suggestions; other text is allowed too. */
export function StateDistrictFields({
  idPrefix,
  state,
  district,
  onState,
  onDistrict,
  required,
}: {
  idPrefix: string;
  state: string;
  district: string;
  onState: (state: string, district: string) => void;
  onDistrict: (district: string) => void;
  required?: { state?: boolean; district?: boolean };
}) {
  const districts = districtsForState(state);
  const changeState = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // A district that is not in the new state is cleared.
    const keep = !district || districtsForState(value).some((d) => d.toLowerCase() === district.trim().toLowerCase());
    onState(value, keep ? district : '');
  };
  return (
    <>
      <Field label="State" htmlFor={`${idPrefix}-state`} required={required?.state}>
        <input id={`${idPrefix}-state`} list={`${idPrefix}-states`} className={inputClass} value={state} onChange={changeState} autoComplete="off" />
        <datalist id={`${idPrefix}-states`}>
          {INDIA_STATES.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </Field>
      <Field label="District" htmlFor={`${idPrefix}-district`} required={required?.district} hint={state ? undefined : 'Select the state first'}>
        <input
          id={`${idPrefix}-district`}
          list={`${idPrefix}-districts`}
          className={inputClass}
          value={district}
          onChange={(e) => onDistrict(e.target.value)}
          disabled={!state}
          autoComplete="off"
        />
        <datalist id={`${idPrefix}-districts`}>
          {districts.map((d) => (
            <option key={d} value={d} />
          ))}
        </datalist>
      </Field>
    </>
  );
}

/** Photo or signature picker with a preview. */
export function ImagePicker({
  label,
  required,
  file,
  savedUrl,
  onFile,
  passport,
}: {
  label: string;
  required?: boolean;
  file: File | null;
  savedUrl: string;
  onFile: (file: File) => void;
  /** A passport size photo: tall preview, and pictures of any other shape are turned away. Signatures are wide. */
  passport?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const preview = useObjectUrl(file) || savedUrl;
  const [problem, setProblem] = useState('');
  const latestPick = useRef(0);

  const pick = async (f: File) => {
    if (!passport) {
      onFile(f);
      return;
    }
    const pickId = ++latestPick.current;
    const found = await passportPhotoProblem(f, label);
    if (pickId !== latestPick.current) return;
    setProblem(found);
    if (!found) onFile(f);
  };

  return (
    <Field
      label={label}
      required={required}
      hint={passport ? 'Passport size (3.5 × 4.5 cm, portrait). JPG, PNG, or WEBP. Maximum size 512 KB.' : 'JPG, PNG, or WEBP. Maximum size 512 KB.'}
    >
      <div className="flex flex-wrap items-center gap-[16px] rounded-[12px] border border-dashed border-[#cfd6e0] bg-[#f8fafc] p-[14px]">
        <div
          className={`flex shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-[#e5e9f0] bg-white ${passport ? 'h-[120px] w-[100px]' : 'h-[70px] w-[180px]'}`}
        >
          {preview ? (
            <img src={preview} alt={`${label} preview`} className="h-full w-full object-contain" />
          ) : (
            <i className={`fa-regular ${passport ? 'fa-user' : 'fa-pen-to-square'} text-[28px] text-[#c0c7d2]`} aria-hidden="true"></i>
          )}
        </div>
        <div>
          <button
            type="button"
            className={buttonClass.small}
            onClick={() => {
              if (!input.current) return;
              input.current.value = '';
              input.current.click();
            }}
          >
            <i className="fa-solid fa-upload" aria-hidden="true"></i> {preview ? 'Replace' : 'Choose'} {label.toLowerCase()}
          </button>
          {file && <p className="mb-0 mt-[6px] max-w-[220px] truncate text-[14px] text-[#475569]">{file.name}</p>}
          {problem && (
            <p role="alert" className="mb-0 mt-[6px] max-w-[320px] text-[13px] leading-[1.45] text-[#b91c1c]">
              <i className="fa-solid fa-circle-exclamation mr-[6px]" aria-hidden="true"></i>
              {problem}
            </p>
          )}
        </div>
        <input
          ref={input}
          type="file"
          accept={IMAGE_TYPES.join(',')}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void pick(f);
          }}
        />
      </div>
    </Field>
  );
}

/** Pixel size of an image file as the browser shows it (camera rotation applied), or null if it can't be read. */
async function imageSize(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return { width: img.naturalWidth, height: img.naturalHeight };
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Error text for a chosen passport photo (type, size, then shape), or ''. */
export async function passportPhotoProblem(file: File, label: string) {
  const basic = imageProblem(file, label);
  if (basic) return basic;
  const size = await imageSize(file);
  if (!size || !size.width || !size.height) return `${label} could not be opened. Choose another JPG, PNG, or WEBP image`;
  const ratio = size.width / size.height;
  const shape = 'Upload a passport size photo (3.5 × 4.5 cm, taller than it is wide)';
  if (ratio > PASSPORT_RATIO.max) return `${shape}. This photo is too wide; crop it to a portrait passport shape.`;
  if (ratio < PASSPORT_RATIO.min) return `${shape}. This photo is too long and narrow; crop it to a passport shape.`;
  return '';
}

/** Error text for a chosen image, or ''. */
export function imageProblem(file: File | null, label: string) {
  if (!file) return '';
  if (!IMAGE_TYPES.includes(file.type)) return `${label} must be a JPG, PNG, or WEBP image`;
  if (file.size > IMAGE_MAX_BYTES) return `${label} must be 512 KB or smaller`;
  return '';
}

export function Select({
  id,
  value,
  onChange,
  placeholder,
  label,
  children,
}: {
  id?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  placeholder: string;
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <select id={id} aria-label={label} value={value} onChange={onChange} className={cx(inputClass, 'appearance-none pr-[38px]', !value && 'text-[#64748b]')}>
        <option value="">{placeholder}</option>
        {children}
      </select>
      <i className="fa-solid fa-chevron-down pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 text-[12.5px] text-[#475569]" aria-hidden="true"></i>
    </div>
  );
}

/** A titled group of fields inside the step card. */
export function Section({ title, description, icon, children, columns = 2 }: { title: string; description?: string; icon: string; children: ReactNode; columns?: 1 | 2 }) {
  return (
    <section className="border-t border-[#eef1f5] px-[28px] py-[26px] first:border-t-0 max-sm:px-[18px]">
      <div className="mb-[20px] flex items-start gap-[12px]">
        <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[8px] bg-[#fcf8e1] text-[14px] text-primary">
          <i className={`fa-solid ${icon}`} aria-hidden="true"></i>
        </span>
        <div>
          <h3 className="m-0 text-[16px] font-semibold leading-[1.3] text-heading">{title}</h3>
          {description && <p className="mb-0 mt-[2px] text-[14px] text-[#475569]">{description}</p>}
        </div>
      </div>
      <div className={cx('grid gap-x-[20px] gap-y-[18px]', columns === 2 ? 'grid-cols-2 max-md:grid-cols-1 2xl:grid-cols-3' : 'grid-cols-1')}>{children}</div>
    </section>
  );
}

export const wide = 'col-span-full';
