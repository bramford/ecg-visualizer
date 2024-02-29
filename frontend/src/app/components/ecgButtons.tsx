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
      (existingTime == 59 && n > 0)
    ) return;
    const params = new URLSearchParams(searchParams);
    params.set('time', String(existingTime + n))
    replace(`${pathname}?${params.toString()}`);
  }
  function moveTimeBack() { moveTime(-1) };
  function moveTimeForward() { moveTime(1) };
  return (
      <div className='flex flex-row items-center justify-center'>
        <button onClick={moveTimeBack} className={"p-1 px-4 shadow text-lg"  + " " + (existingTime == 0 ? "opacity-40" : "")}>
          {"-"}
        </button>
        <p className='py-1 px-4 shadow h-9 text-md flex items-center'>
          🕡 {existingTime + 1}s
        </p>
        <button onClick={moveTimeForward} className={"p-1 px-4 shadow text-lg"  + " " + (existingTime == 59 ? "opacity-40" : "")}>
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
      <div className='flex flex-row items-center justify-center'>
        <button onClick={movePageBack} className={"p-1 px-4 shadow text-lg"  + " " + (existingPage == 0 ? "opacity-40" : "")}>
          {"<"}
        </button>
        <p className='py-1 px-4 shadow h-9 text-md flex items-center'>
          📋 {existingPage + 1}/20
        </p>
        <button onClick={movePageForward} className={"p-1 px-4 shadow text-lg" + " " + (existingPage == 19 ? "opacity-40" : "")}>
          {">"}
        </button>
      </div>
      )
}
