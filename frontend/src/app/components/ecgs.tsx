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

  async function getEcgs(opts?: {count?: number, readingsCount?: number}) {
    const count = opts?.count ?? 5;
    const offset = (props?.page ?? 0) * count
    console.debug({offset});
    const readingsCount = opts?.readingsCount ?? 500;
    const readingsOffset = (props?.time ?? 0) * 500
    const uri = process.env.NEXT_PUBLIC_REST_API_URL ?? 'http://localhost:3002'
    console.debug(uri)
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
            <div className="ml-2 p-1 w-1/2 flex flex-col justify-top">
              <p className="text-m text-gray-800">
                {ecg.sampleId}
              </p>
              <div className="w-1/2 flex flex-col justify-top text-sm text-gray-700">
                <p>
                  {ecg.age} {ecg.sex}
                </p>
                <p>
                </p>
              </div>
            </div>
            <div className="text-xs mt-1 text-gray-700 flex flex-col items-end">
              <p>
                {ecg.leadNumber}l
              </p>
              <p >
                {ecg.sampleRate}hz
              </p>
            </div>
            <EcgChart ecg={ecg}/>
          </div>
        ))}
        </div>
      </div>
      </>
    )
}

