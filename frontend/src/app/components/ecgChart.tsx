'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import { Ecg } from './ecgs';

export default function EcgChart(props: { ecg: Ecg }) {

  const readings = props.ecg.readings.map((v) => { return {v}; });

  return (
	 <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={100}>
		<LineChart data={readings}>
			<CartesianGrid stroke='#d95f78' strokeDasharray="1 1"/>
			<XAxis hide={true}/>
			<YAxis hide={true}/>
			<Tooltip/>
			<Line type="linear" dataKey="v" stroke="#282829" strokeWidth={1} dot={false} />
		</LineChart>
	</ResponsiveContainer>
  )
}

