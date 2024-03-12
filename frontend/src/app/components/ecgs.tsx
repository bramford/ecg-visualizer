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
          <Link key={ecg.sampleId} href={`/ecg?id=${ecg.sampleId}`} className="m-1 p-1 hover:bg-gray-100 hover:shadow-lg rounded-md shadow flex flex-row justify-center">
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
          </Link>
        ))}
        </div>
      </div>
      </>
    )
}
