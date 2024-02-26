import Image from "next/image";
import * as EcgChart from "./components/ecgChart";

function Header() {
  return (
      <div className="flex flex-col w-full justify-between">
        <div className="flex flex-col m-2 justify-start bg-gray-300 dark:bg-gray-800 shadow-md">
          <div className="flex flex-row ml-2 justify-start">
          {/*
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            Get started by editing&nbsp;
            <code className="font-mono font-bold">src/app/page.tsx</code>
          </p>
          */}
          <a
            className="pointer-events-none border-2 p-1 m-2 rounded shadow-black bg-gray-200"
            href="https://derp.tech"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/heart-anatomy.png"
              alt="Heart"
              className="hover:border-sky-50 hover:opacity-95"
              width={40}
              height={40}
              priority
            />
          </a>
          <p className="text-xl dark:invert font-normal m-2 flex flex-col justify-center">
            ECG Visualizer
          </p>
          </div>
        </div>
      </div>
      )
}

function Footer() {
  return (
      <div className="flex flex-col w-full justify-between">
        <div className="flex flex-col m-2 justify-start bg-gray-300 dark:bg-gray-800 lg:h-16 shadow-md">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row ml-3 justify-start">
              <p className="text-xs dark:text-gray-800 text-gray-500 flex flex-col justify-center text-center">
                Built with
              </p>
                <a
                  className="flex flex-col ml-2 my-2 justify-center rounded"
                  href="https://tailwindcss.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/Tailwind_CSS_Logo.svg.png"
                    alt="TailwindCss"
                    className="hover:border-sky-50 hover:opacity-95"
                    width={20}
                    height={20}
                    priority
                  />
                </a>
                <a
                  className="flex flex-col ml-2 my-2 justify-center rounded"
                  href="https://nextjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/nextjs-icon.svg"
                    alt="NextLogo"
                    className="hover:border-sky-50 hover:opacity-95"
                    width={20}
                    height={20}
                    priority
                  />
                </a>
                <a
                  className="flex flex-col ml-2 my-2 justify-center rounded"
                  href="https://nestjs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/nestjs-logo.svg"
                    alt="NestLogo"
                    className="hover:border-sky-50 hover:opacity-95"
                    width={20}
                    height={20}
                    priority
                  />
                </a>
            </div>
            <a href="https://physio.net." className="text-xs m-2 text-gray-500 flex flex-col justify-center text-center">
              All data courtesy of physio.net
            </a>
            <div className="flex flex-row mr-2 justify-end">
              <p className="text-xs dark:text-gray-800 text-gray-500 my-2 flex flex-col justify-center text-center">
                ©{new Date().getFullYear()} Bramford Horton
              </p>
                <a
                  className="ml-4 m-2 flex flex-col justify-center"
                  href="https://derp.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/bramford-github.jpeg"
                    alt="Bramford"
                    className="rounded hover:border-sky-50 hover:opacity-95"
                    width={30}
                    height={30}
                    priority
                  />
                </a>
            </div>
          </div>
        </div>
      </div>
      )
}

export default async function Home() {
  const ecgs = await (await fetch(`http://localhost:3002/ecgs`, { cache: 'no-store' })).json()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gray-200 dark:bg-gray-900">
      <Header/>

      <div className="flex justify-center">
        <EcgChart.default readings={ecgs[0].readings}/>
      </div>

      <Footer/>
    </main>
  );
}
