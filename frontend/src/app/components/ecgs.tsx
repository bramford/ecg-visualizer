import { EcgsPageButtons } from "./ecgButtons";
import Link from "next/link";
import { Ecg, EcgMetadata } from "../lib/types";

export default async function Ecgs(props?: {page?: number}) {

  const count = 10;
  const offset = (props?.page ?? 0) * count

  async function getEcgs() {
    const uri = process.env.NEXT_PUBLIC_REST_API_URL ?? 'http://localhost:3002'
    const query = `${uri}/ecgs?count=${count}&offset=${offset}`;
    const ecgs : EcgMetadata[] = await (await fetch(query, { cache: 'no-cache', mode: "no-cors" })).json()
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
            <div className="ml-4 my-1 flex flex-row justify-start">
              <p className="mr-2 w-20 text-lg text-red-600 opacity-80">
                {ecg.sampleId}
              </p>
              <p className="ml-2 w-20 text-base text-gray-700">
                {ecg.age} {ecg.sex}
              </p>
            </div>
            <div className="text-sm ml-4 mr-1 text-gray-700 flex flex-row justify-between">
              <p className="mx-2">
                leads: {ecg.leadNumber}
              </p>
              <p className="mx-2">
                rate: {ecg.sampleRate}hz
              </p>
              <p className="mx-2">
                QRSs: {ecg.qrsCount}
              </p>
            </div>
          </Link>
        ))}
        </div>
      </div>
      </>
    )
}
