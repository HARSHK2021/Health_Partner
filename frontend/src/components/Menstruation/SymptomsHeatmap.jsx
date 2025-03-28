import React from 'react';
import { format } from 'date-fns';

function SymptomsHeatmap({ data }) {
  const symptoms = data[0].symptoms;

  return (
    <div className="space-y-4">
      {symptoms.map((symptom, index) => (
        <div key={index} className="flex items-center gap-4">
          <span className="w-24 text-sm text-purple-900">{symptom.name}</span>
          <div 
            className="flex-1 h-8 rounded-lg"
            style={{
              backgroundColor: `rgba(236, 72, 153, ${symptom.intensity / 5})`
            }}
          >
            <div className="px-2 py-1 text-sm">
              {format(new Date(symptom.date), 'MMM d')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SymptomsHeatmap;