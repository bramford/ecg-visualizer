'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function EcgChart(props: { readings: number[] }) {

  const data = props.readings.slice(0,1000).map((v) => { return {v}; });

  return (
	 <ResponsiveContainer width="100%" height="100%" minWidth={800} minHeight={400}>
		<LineChart width={800} height={400} data={data}>
			<CartesianGrid/>
			<XAxis hide={true}/>
			<YAxis hide={true}/>
			<Tooltip/>
			<Line type="linear" dataKey="v" stroke="#8884d8" strokeWidth={2} dot={false} />
		</LineChart>
	</ResponsiveContainer>
  )
}
