'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function EcgChart(props: { readings: number[], startMs: number, intervalMs: number }) {

  const readings = props.readings.map((value, i) => { return {timeMs: (props.startMs + (props.intervalMs * i)) / 1000, value}});

  return (
	 <ResponsiveContainer width="100%" height="100%" minWidth={readings.length} minHeight={120}>
		<LineChart data={readings}>
			<CartesianGrid stroke='#d95f78' strokeDasharray="1 1"/>
			<XAxis dataKey="timeMs" hide={true}/>
			<YAxis hide={true}/>
			<Tooltip content={({ active, payload, label}) => {
        if (active && payload && payload.length > 0) {
          return (
            <>
              <div className='bg-gray-100 px-2 py-1 opacity-80 text-sm text-gray-900'>
                <p>{payload[0].value}</p>
                <p className='italic'>{label}s</p>
              </div>
            </>
          );
        }
      }}/>
			<Line type="linear" dataKey="value" stroke="#282829" strokeWidth={1} dot={false} />
		</LineChart>
	</ResponsiveContainer>
  )
}

