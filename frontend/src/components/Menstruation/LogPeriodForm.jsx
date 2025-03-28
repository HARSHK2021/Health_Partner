import React, { useState } from 'react';


const symptoms = [
  'Cramps', 'Headache', 'Bloating', 'Fatigue',
  'Mood Swings', 'Breast Tenderness', 'Back Pain'
];

const flowLevels = ['Light', 'Medium', 'Heavy'];

function LogPeriodForm({ date, onSave, onCancel }) {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [flowLevel, setFlowLevel] = useState('Medium');
  const [periodDay, setPeriodDay] = useState(1);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    setError('');
    
    try {
      const data = {
        userId: '123', // Replace with actual user ID from auth
        startDate: date,
        flowLevel: flowLevel.toLowerCase(),
        symptoms: selectedSymptoms.map(name => ({
          name,
          intensity: 3, // Default intensity
          date: date
        })),
        day: periodDay
      };
       console.log(data)
      // const response = await logPeriodDay(data);
      // onSave(response);
    } catch (error) {
      console.error('Error logging period:', error);
      setError('Failed to save period data. Please try again.');
    }
  };

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Period Day</h4>
        <select
          value={periodDay}
          onChange={(e) => setPeriodDay(Number(e.target.value))}
          className="w-full p-2 border rounded-md"
        >
          {[1, 2, 3, 4, 5].map(day => (
            <option key={day} value={day}>Day {day}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Flow Level</h4>
        <div className="flex gap-4">
          {flowLevels.map(level => (
            <label key={level} className="flex items-center">
              <input
                type="radio"
                name="flowLevel"
                value={level}
                checked={flowLevel === level}
                onChange={(e) => setFlowLevel(e.target.value)}
                className="w-4 h-4 text-purple-600"
              />
              <span className="ml-2 text-sm text-gray-700">{level}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Symptoms</h4>
        <div className="grid grid-cols-2 gap-3">
          {symptoms.map(symptom => (
            <label key={symptom} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedSymptoms.includes(symptom)}
                onChange={() => toggleSymptom(symptom)}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{symptom}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default LogPeriodForm;