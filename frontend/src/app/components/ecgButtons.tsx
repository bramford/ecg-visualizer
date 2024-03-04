'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export function EcgsTimeButtons() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const existingTime = Number(searchParams.get('time') ?? 0)
  function moveTime(n: number) {
    if (
      (existingTime == 0 && n < 0) ||
      (existingTime == 55 && n > 0)
    ) return;
    const params = new URLSearchParams(searchParams);
    const newTime = existingTime + n > 0 ? existingTime + n < 55 ? existingTime + n : 55 : 0
    params.set('time', String(newTime))
    replace(`${pathname}?${params.toString()}`);
  }
  function moveTimeBack() { moveTime(-5) };
  function moveTimeForward() { moveTime(5) };
  return (
      <div className='flex flex-row items-center justify-center text-gray-700'>
        <button onClick={moveTimeBack} className={"py-2.5 px-4 shadow text-[2vw] md:text-base"  + " " + (existingTime == 0 ? "opacity-40" : "")}>
          {"-"}
        </button>
        <p className='py-2.5 px-4 shadow text-[2vw] md:text-base flex items-center'>
          🕡 {existingTime}-{existingTime + 5}s
        </p>
        <button onClick={moveTimeForward} className={"py-2.5 px-4 shadow text-[2vw] md:text-base"  + " " + (existingTime == 55 ? "opacity-40" : "")}>
          {"+"}
        </button>
      </div>
      )
}

export function EcgsPageButtons() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const existingPage = Number(searchParams.get('page') ?? 0)
  function movePage(n: number) {
    if (
      (existingPage == 0 && n < 0) ||
      (existingPage == 19 && n > 0)
    ) return;
    const params = new URLSearchParams(searchParams);
    params.set('page', String(existingPage + n))
    replace(`${pathname}?${params.toString()}`);
  }
  function movePageBack() { movePage(-1) };
  function movePageForward() { movePage(1) };
  return (
      <div className='flex flex-row items-center justify-center text-gray-700'>
        <button onClick={movePageBack} className={"py-2.5 px-4 shadow text-[2vw] md:text-base"  + " " + (existingPage == 0 ? "opacity-40" : "")}>
          {"<"}
        </button>
        <p className='py-2.5 px-4 shadow text-[2vw] md:text-base flex items-center'>
          📋 {existingPage * 5}-{(existingPage + 1) * 5}/{20 * 5}
        </p>
        <button onClick={movePageForward} className={"py-2.5 px-4 shadow text-[2vw] md:text-base" + " " + (existingPage == 19 ? "opacity-40" : "")}>
          {">"}
        </button>
      </div>
      )
}
