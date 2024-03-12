import { Metadata } from "next";
import { default as EcgChart } from "../components/ecgChart";
import { Footer, Header } from "../components/shared";
import { Ecg } from "../lib/types";

export const metadata: Metadata = {
  title: 'ECG Arrhythmia Visualizer',
  description: 'A simple tool to view ECG arrhythmia data',
}

export default async function Ecg({
  searchParams
}: {
  searchParams?: {id?: string}
}) {

  async function getEcg() {
    const uri = process.env.NEXT_PUBLIC_REST_API_URL ?? 'http://localhost:3002'
    const query = `${uri}/ecgs/${searchParams?.id}`;
    const response = await fetch(query, { cache: 'no-cache', mode: "no-cors" });
    const body = await response.text();
    return JSON.parse(body) as Ecg;
  }

  const ecg = await getEcg()
    return (
      <>
      <div className="flex flex-col h-dvh w-dvw items-center bg-gray-200">
      <div className="flex flex-col h-full w-full flex-1 justify-between">
      <Header/>
      <div className="flex flex-col mx-2 flex-1 overflow-auto">
        <div className="flex flex-col justify-top flex-auto flex-shrink-0">
          <div className="my-4 ml-4 flex flex-row justify-start items-center">
              <p className="text-xl text-red-600 opacity-80">
                {ecg.sampleId}
              </p>
              <p className="ml-4 text-base text-gray-700">
                {ecg.age} {ecg.sex}
              </p>
            <div className="text-sm ml-4 mr-1 text-gray-700 flex flex-row justify-start items-start">
              <div className="ml-4 flex flex-col justify-start items-start">
                <p>
                  leads: {ecg.leadNumber}
                </p>
                <p>
                  rate: {ecg.sampleRate}hz
                </p>
              </div>
              <div className="ml-4 flex flex-col justify-start items-start">
                <p>
                  QRSs: {ecg.meanQrs.length}
                </p>
              </div>
            </div>
          </div>
          <div className="m-1 p-1 hover:bg-gray-100 hover:shadow-lg rounded-md shadow flex flex-row justify-center">
            <div className="overflow-x-scroll">
              <EcgChart ecg={ecg} startMs={0} intervalMs={1000 / ecg.sampleRate}/>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
      </div>
      </div>
      </>
    )
}

