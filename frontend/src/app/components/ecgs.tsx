import { default as EcgChart } from "./ecgChart";
import { EcgsPageButtons, EcgsTimeButtons } from "./ecgButtons";

export interface Ecg {
  readings: number[];
  leads: string[];
  leadNumber: number;
  sampleRate: number;
  sampleId: string;
  otherMachineData?: string;
  age: number;
  sex: string;
  diagnoses: string[];
}

export default async function Ecgs(props?: {time?: number, page?: number}) {

  const count = 5;
  const offset = (props?.page ?? 0) * count
  const readingsCount = 2500;
  const readingsOffset = (props?.time ?? 0) * 500

  async function getEcgs() {
    const uri = process.env.NEXT_PUBLIC_REST_API_URL ?? 'http://localhost:3002'
    const query = `${uri}/ecgs?count=${count}&offset=${offset}&readingsCount=${readingsCount}&readingsOffset=${readingsOffset}`;
    console.debug(`Fetching ${query}`);
    const ecgs : Ecg[] = await (await fetch(query, { cache: 'no-cache', mode: "no-cors" })).json()
    console.debug(`Got response with ${ecgs.length} ecgs`);
    return ecgs;
  }

  const ecgs = await getEcgs()
    return (
      <>
      <div className="flex items-center justify-evenly my-1">
        <EcgsPageButtons/>
        <EcgsTimeButtons/>
      </div>
      <div className="flex flex-col mx-2 flex-1 overflow-auto">
        <div className="flex flex-col justify-top flex-auto flex-shrink-0">
        {ecgs.map((ecg) => (
          <div key={ecg.sampleId} className="m-1 p-1 hover:bg-gray-100 hover:shadow-lg rounded-md shadow flex flex-row justify-center" >
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
              <EcgChart ecg={ecg}/>
            </div>
          </div>
        ))}
        </div>
      </div>
      </>
    )
}

