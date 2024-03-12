import Ecgs from "./components/ecgs";
import { Metadata } from "next";
import { Footer, Header } from "./components/shared";

export const metadata: Metadata = {
  title: 'ECG Arrhythmia Visualizer',
  description: 'A simple tool to view ECG arrhythmia data',
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
        <Ecgs page={searchParams?.page}/>
        <Footer/>
      </div>
    </main>
  );
}
