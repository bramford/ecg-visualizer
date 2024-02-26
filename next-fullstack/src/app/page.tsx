import Image from "next/image";
import * as EcgChart from "./components/ecgChart";

function Footer() {
  return (
      <div className="flex flex-col w-full justify-start bg-gray-800 lg:h-16">
        <hr className="h-px mb-2 bg-gray-400 border-0"/>
        <div className="flex flex-row justify-center">
          {/*
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            Get started by editing&nbsp;
            <code className="font-mono font-bold">src/app/page.tsx</code>
          </p>
          */}
          <p className="text-sm dark:text-gray-800 text-gray-400 flex flex-col justify-center text-center">
            ©{new Date().getFullYear()} Bramford Horton
          </p>
            <a
              className="pointer-events-none ml-4"
              href="https://derp.tech"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/bramford-github.jpeg"
                alt="Bramford"
                className="rounded-full hover:border-sky-50 hover:opacity-95"
                width={40}
                height={40}
                priority
              />
            </a>
        </div>
      </div>
      )
}

export default async function Home() {
  const ecgs = await (await fetch(`http://localhost:3002/ecgs`, { cache: 'no-store' })).json()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gray-900">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        {/*
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/app/page.tsx</code>
        </p>
        */}
        <p className="text-xl">
          Homes
        </p>
      </div>

      <div className="flex justify-center">
        <EcgChart.default readings={ecgs[0].readings}/>
      </div>

      <Footer/>
    </main>
  );
}
