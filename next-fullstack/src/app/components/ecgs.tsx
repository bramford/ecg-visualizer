import { default as EcgChart } from "./ecgChart";

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

export default async function Ecgs() {
  const ecgs : Ecg[] = await (await fetch(`http://localhost:3002/ecgs`, { cache: 'no-store', mode: "no-cors" })).json()
    return (
      <div className="flex flex-col mx-4 justify-center">
      {ecgs.map((ecg) => (
        <div key={ecg.sampleId} className="m-1 p-1 hover:bg-gray-100 hover:shadow-lg rounded-md shadow flex flex-row justify-center" >
          <div className="ml-2 p-1 w-1/2 flex flex-col justify-top">
            <p className="text-m">
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
          <div>
            <p className="text-xs mt-1">
              {ecg.leadNumber}L
            </p>
          </div>
          <EcgChart ecg={ecg}/>
        </div>
      ))}

      </div>
    )
}

