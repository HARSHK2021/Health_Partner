import React, { useState } from 'react';
import { format, addDays } from 'date-fns';

const phaseColors = {
  menstrual: 'bg-red-200',
  follicular: 'bg-green-200',
  ovulation: 'bg-yellow-200',
  luteal: 'bg-purple-200',
  predicted: 'bg-red-600'
};

const phaseInfo = {
  menstrual: { name: 'Menstrual Phase', duration: '3-7 days', },
  follicular: { name: 'Follicular Phase', duration: '7-11 days',  },
  ovulation: { name: 'Ovulation Phase', duration: '3-4 days',  },
  luteal: { name: 'Luteal Phase', duration: '12-14 days',  }
};

function CyclePhases({ currentDate, predictedDate, onAccurate, onUpdatePrediction }) {
  const [feedback, setFeedback] = useState({ days: 0, type: 'delay' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const days = parseInt(feedback.days);
    if (days) {
      onUpdatePrediction(feedback.type === 'delay' ? days : -days);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(phaseInfo).map(([phase, info]) => (
          <div 
            key={phase}
            className={`p-4 rounded-lg ${phaseColors[phase]} bg-opacity-50`}
          >
            <h4 className="font-semibold text-gray-900">{info.name}</h4>
            <p className="text-sm text-gray-600">{info.description}</p>
            <p className="text-xs text-gray-500">Duration: {info.duration}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-purple-900 mb-4"> Period Prediction</h3>
        <p className="text-gray-700">
          Predicted Start Date: <span className="font-medium">{format(new Date(predictedDate), 'MMMM d, yyyy')}</span>
        </p>
        
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="0"
              max="30"
              value={feedback.days}
              onChange={(e) => setFeedback({ ...feedback, days: e.target.value })}
              className="w-20 px-3 py-2 border rounded-md"
              placeholder="Days"
            />
            <select
              value={feedback.type}
              onChange={(e) => setFeedback({ ...feedback, type: e.target.value })}
              className="px-3 py-2 border rounded-md"
            >
              <option value="delay">Delayed by</option>
              <option value="early">Early by</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Update
            </button>
          </div>
        </form>

        <button
          onClick={onAccurate}
          className="mt-4 px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50"
        >
          Mark as Accurate
        </button>
      </div>
    </div>
  );
}

export default CyclePhases;