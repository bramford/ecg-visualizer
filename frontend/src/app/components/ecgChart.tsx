'use client'

import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, ComposedChart } from 'recharts';
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

  const qrsLines = props.ecg.meanQrs.map((qrs) => {
    return (
      <>
        <ReferenceLine key={`meanQrs-${qrs}`} x={qrs} stroke='gold' strokeWidth={1} strokeDasharray="6 3" strokeOpacity="30%" height="100%" width={1}/>
      </>
    )
  });

  const startAndEndQrsLines = props.ecg.meanQrsStartAndEnd.map(([start, end]) => {
    return (
      <>
        <ReferenceArea key={`meanQrsStartEnd-${start}-${end}`} x1={start} x2={end} fillOpacity="3%" opacity="40%" fill='gray'/>
        <ReferenceLine key={`meanQrsStart-${start}`} x={start} stroke='gray' strokeWidth={1} strokeOpacity="5%" height="100%"/>
        <ReferenceLine key={`meanQrsEnd-${end}`} x={end} stroke='gray' strokeWidth={1} strokeOpacity="5%" height="100%"/>
      </>
    )
  });

  return (
	 <ResponsiveContainer width="100%" height="100%" minWidth={Object.values(props.ecg.readings)[0].length * 2} minHeight={300}>
		<ComposedChart data={readingsFixed}>
			<CartesianGrid stroke='#8f8f8f' strokeDasharray="1 1" strokeOpacity="40%"/>
			<XAxis hide={true}/>
			<YAxis hide={false}/>
			<Tooltip/>
      {Object.keys(readingsFixed[0]).map((key) => {
        const leadColor = resolveLeadColor(key);
        return (
          <>
            {qrsLines}
            {startAndEndQrsLines}
            <Line type="linear" key={"readingsLine-" + key} dataKey={key} stroke={leadColor} strokeWidth={0.7} dot={false} />
          </>
        )
      })}
		</ComposedChart>
	</ResponsiveContainer>
  )
}

