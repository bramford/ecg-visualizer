'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Ecg } from '../lib/types';

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

  return (
	 <ResponsiveContainer width="100%" height="100%" minWidth={Object.values(props.ecg.readings)[0].length * 2} minHeight={50 * Object.keys(props.ecg.readings).length}>
		<LineChart data={readingsFixed}>
			<CartesianGrid stroke='#8f8f8f' strokeDasharray="1 1"/>
			<XAxis dataKey="timeMs" hide={true}/>
			<YAxis hide={true}/>
			<Tooltip/>
      {Object.keys(readingsFixed[0]).map((key) => {
        const leadColor = resolveLeadColor(key);
        return (
          <>
          <Line type="linear" key={key} dataKey={key} stroke={leadColor} strokeWidth={0.7} dot={false} />
          </>
        )
      })}
		</LineChart>
	</ResponsiveContainer>
  )
}

