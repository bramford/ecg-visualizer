import { EcgsPageButtons } from "./ecgButtons";
import Link from "next/link";
import { Ecg } from "../lib/types";

export default async function Ecgs(props?: {page?: number}) {

  const count = 10;
  const offset = (props?.page ?? 0) * count

  async function getEcgs() {
    const uri = process.env.NEXT_PUBLIC_REST_API_URL ?? 'http://localhost:3002'
    const query = `${uri}/ecgs?count=${count}&offset=${offset}`;
    const ecgs : Ecg[] = await (await fetch(query, { cache: 'no-cache', mode: "no-cors" })).json()
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
          <Link key={ecg.sampleId} href={`/ecg?id=${ecg.sampleId}`} className="m-1 p-1 hover:bg-gray-100 hover:shadow-lg rounded-md shadow flex flex-row justify-between items-center">
            <div className="ml-2 p-1 flex flex-row justify-between items-center">
              <p className="text-m text-red-600 opacity-80">
                {ecg.sampleId}
              </p>
              <p className="flex flex-col ml-2 text-sm text-gray-700 min-w-16">
                {ecg.age} {ecg.sex}
              </p>
              <p className="mx-3 text-xl text-gray-700 text-opacity-70">
              |
              </p>
              <div className="text-xs mt-1 mr-0.5 text-gray-700">
                <p>
                  leads: {ecg.leadNumber}
                </p>
                <p >
                  rate: {ecg.sampleRate}hz
                </p>
              </div>
            </div>
          </Link>
        ))}
        </div>
      </div>
      </>
    )
}
