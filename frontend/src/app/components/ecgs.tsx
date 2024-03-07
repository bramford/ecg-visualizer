import { default as EcgChart } from "./ecgChart";
import { EcgsPageButtons } from "./ecgButtons";

export interface EcgLead {
  unknown1: string;
  mV: number;
  unknown3: string;
  unknown4: string;
  unknown5: string;
  unknown6: string;
  unknown7: string;
  id: string;
}
export interface Ecg {
  readings: {
    [leadId: string]: number[];
  };
  leads: {
    [leadId: string]: EcgLead;
  };
  leadNumber: number;
  sampleRate: number;
  sampleId: string;
  otherMachineData?: string;
  age: number;
  sex: string;
  diagnoses: string[];
}

export interface EcgMetadata {
  readingsCountPerLead: number;
  leadIds: string[];
  leadNumber: number;
  sampleRate: number;
  sampleId: string;
  otherMachineData?: string;
  age: number;
  sex: string;
  diagnoses: string[];
}

export default async function Ecgs(props?: {page?: number}) {

  const count = 10;
  const offset = (props?.page ?? 0) * count

  async function getEcgs() {
    const uri = process.env.NEXT_PUBLIC_REST_API_URL ?? 'http://localhost:3002'
    const query = `${uri}/ecgs?count=${count}&offset=${offset}`;
    console.debug(`Fetching ${query}`);
    const ecgs : Ecg[] = await (await fetch(query, { cache: 'no-cache', mode: "no-cors" })).json()
    console.debug(`Got response with ${ecgs.length} ecgs`);
    return ecgs;
  }

  const ecgs = await getEcgs()
    return (
      <>
      <div className="flex items-center justify-center my-1">
        <EcgsPageButtons ecgsPerPage={count}/>
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
          </div>
        ))}
        </div>
      </div>
      </>
    )
}

            {/*
            <div className="overflow-x-scroll">
              <EcgChart ecg={ecg} startMs={readingsOffset} intervalMs={1000 / ecg.sampleRate}/>
            </div>
            */}
