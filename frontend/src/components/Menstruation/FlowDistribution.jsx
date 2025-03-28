import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

function FlowDistribution({ data }) {
  const flowLevels = data[0].flow.reduce((acc, curr) => {
    acc[curr.level] = (acc[curr.level] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(flowLevels).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = {
    light: '#DDD6FE',
    medium: '#A78BFA',
    heavy: '#7C3AED',
    spotting: '#F0ABFC'
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default FlowDistribution;