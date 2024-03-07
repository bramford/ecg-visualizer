'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export function EcgsPageButtons(props: {ecgsPerPage: number}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const existingPage = Number(searchParams.get('page') ?? 0)
  function movePage(n: number) {
    if (
      (existingPage == 0 && n < 0) ||
      (existingPage == 9 && n > 0)
    ) return;
    const params = new URLSearchParams(searchParams);
    params.set('page', String(existingPage + n))
    replace(`${pathname}?${params.toString()}`);
  }
  function movePageBack() { movePage(-1) };
  function movePageForward() { movePage(1) };
  return (
      <div className='flex flex-row items-center justify-center text-gray-700'>
        <button onClick={movePageBack} className={"py-2.5 px-4 shadow text-[3vw] sm:text-base"  + " " + (existingPage == 0 ? "opacity-40" : "")}>
          {"<"}
        </button>
        <p className='py-2.5 px-4 shadow text-[3vw] sm:text-base flex items-center'>
          📋 {existingPage * props.ecgsPerPage}-{(existingPage + 1) * props.ecgsPerPage}
        </p>
        <button onClick={movePageForward} className={"py-2.5 px-4 shadow text-[3vw] sm:text-base" + " " + (existingPage == 9 ? "opacity-40" : "")}>
          {">"}
        </button>
      </div>
      )
}
