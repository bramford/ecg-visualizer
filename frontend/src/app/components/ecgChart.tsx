'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Dot, ReferenceDot, ReferenceLine, ReferenceArea } from 'recharts';
import { Ecg } from '../lib/types';
import { randomUUID } from 'crypto';

function resolveLeadColor(leadId: string) {
  switch (leadId) {
    case "I": return "#1f7d1f"
    case "II": return "#248224"
    case "III": return "#298529"
    case "aVR": return "#3160bd"
    case "aVL": return "#3662ba"
    case "aVF": return "#3d873d"
    case "V1": return "#c41f1f"
    case "V2": return "#255ac4"
    case "V3": return "#2c5dbf"
    case "V4": return "#338733"
    case "V5": return "#398739"
    case "V6": return "#3c7d33"
    default: return "#1f1f1f"
  }
}

export default function EcgChart(props: { ecg: Ecg, startMs: number, intervalMs: number }) {

  const leadIds = Object.keys(props.ecg.readings)
  const readings = Object.values(props.ecg.readings)
  const readingsFixed = readings[0].map((_, index)  => {
    const r : {[leadId: string]: number} = {};
    leadIds.forEach((leadId) => {
      const leadValue = props.ecg.readings[leadId][index];
      r[leadId] = leadValue;
    });
    return r;
  });

  const referenceLines = Object.entries(props.ecg.qrs).map(([leadId, qrss]) => {
        // <Dot r={5} key={"qrs" + leadId + "-" + qrs.toString()} cy={props.ecg.readings[leadId][qrs]} cx={qrs} stroke="black" fill={leadColor} strokeWidth={0.7} />
        // const leadColor = resolveLeadColor(leadId);
        return qrss.map((qrs) => {
          console.debug(`Rendering dot for QRS ${leadId}-${qrs} at x:${qrs},y:${props.ecg.readings[leadId][qrs]}`)
          return (
            <>
              <ReferenceLine key={`${leadId}-${qrs}`} label="QRS" x={qrs} stroke='gold' strokeWidth={1} height="100%" width={1}/>
            </>
          )
        })
      }).flat();

  return (
	 <ResponsiveContainer width="100%" height="100%" minWidth={Object.values(props.ecg.readings)[0].length * 2} minHeight={600}>
		<LineChart data={readingsFixed}>
			<CartesianGrid stroke='#8f8f8f' strokeDasharray="1 1"/>
			<XAxis id='x' hide={false}/>
			<YAxis id="y" hide={false}/>
      <ReferenceDot r={1000} cy={0} cx={500} fill='black' stroke="black" strokeWidth={1} />
      <ReferenceLine x={1000} stroke='black' strokeWidth={1}/>
      <ReferenceArea x1={500} x2={1000} y1={0} y2={100}/>
			<Tooltip/>
      {Object.keys(readingsFixed[0]).map((key) => {
        const leadColor = resolveLeadColor(key);
        return (
          <>
            {referenceLines}
            <Line type="linear" key={"readingsLine-" + key} dataKey={key} stroke={leadColor} strokeWidth={0.7} dot={false} />
          </>
        )
      })}
		</LineChart>
	</ResponsiveContainer>
  )
}

