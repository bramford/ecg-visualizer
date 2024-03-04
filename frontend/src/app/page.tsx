import Image from "next/image";
import Ecgs from "./components/ecgs";
import { Metadata } from "next";

function Header() {
  return (
      <div className="flex flex-row mb-2 justify-between items-center bg-zinc-300 shadow-md">
        <div className="flex flex-row ml-2 justify-center items-center">
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
          <p className="text-xl font-sans m-2 flex flex-col justify-center text-gray-800">
            ECG Visualizer
          </p>
        </div>
        <div className="flex flex-col justify-center text-right my-2 mr-4">
          <a
            href="https://www.physionet.org/content/ecg-arrhythmia/1.0.0/"
            className="text-sm text-gray-800"
            target="_blank"
            rel="noopener noreferrer"
          >
          Data Source
          </a>
          <a
            href="https://www.physionet.org/content/ecg-arrhythmia/1.0.0/"
            className="text-xs text-gray-500 italic"
            target="_blank"
            rel="noopener noreferrer"
          >
          A large scale 12-lead electrocardiogram database for arrhythmia study
          </a>
        </div>
      </div>
  )
}

function Footer() {
  return (
      <div className="flex flex-col w-full justify-between">
        <div className="flex flex-col mt-2 justify-start bg-zinc-300 shadow-md">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row ml-3 justify-start">
              <p className="text-xs text-gray-500 flex flex-col justify-center text-center">
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
            <div className="flex flex-row mr-2 justify-end">
              <p className="text-xs text-gray-500 my-2 flex flex-col justify-center text-center">
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

export const metadata: Metadata = {
  title: 'ECG Visualizer',
  description: 'A simple tool to view ECG data',
}

export default async function Home({
  searchParams
}: {
  searchParams?: {time?: number, page?: number}
}) {
  return (
    <main className="flex flex-col h-dvh w-dvw items-center bg-gray-200">
      <div className="flex flex-col h-full w-full flex-1 justify-between">
        <Header/>
        <Ecgs time={searchParams?.time} page={searchParams?.page}/>
        <Footer/>
      </div>
    </main>
  );
}
