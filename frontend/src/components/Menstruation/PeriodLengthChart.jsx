import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

function PeriodLengthChart({ data }) {
  const chartData = data.map(cycle => ({
    date: format(new Date(cycle.startDate), 'MMM d'),
    length: cycle.periodLength
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="length" 
            stroke="#EC4899" 
            strokeWidth={2}
            dot={{ fill: '#EC4899' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PeriodLengthChart;