import { default as EcgChart } from "../components/ecgChart";
import { Footer, Header } from "../components/shared";
import { Ecg } from "../lib/types";

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
          <div key={ecg.sampleId} className="m-1 p-1 hover:bg-gray-100 hover:shadow-lg rounded-md shadow flex flex-row justify-center">
            <div className="ml-2 mr-2 p-1 flex flex-col justify-top">
              <p className="text-m text-red-600 opacity-80">
                {ecg.sampleId}
              </p>
              <div className="flex flex-col justify-top text-sm text-gray-700">
                <p>
                  {ecg.age} {ecg.sex}
                </p>
                <p>
                </p>
              </div>
            </div>
            <div className="text-xs ml-2 mt-1 mr-0.5 text-gray-700 flex flex-col items-end">
              <p>
                {ecg.leadNumber}l
              </p>
              <p >
                {ecg.sampleRate}hz
              </p>
            </div>
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

