import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

function LoggingModal({ date, onClose }) {
  const [flow, setFlow] = useState('medium')
  const [symptoms, setSymptoms] = useState([])

  const symptomOptions = [
    'Cramps', 'Headache', 'Bloating', 'Fatigue',
    'Mood Swings', 'Breast Tenderness', 'Back Pain'
  ]

  const handleSymptomToggle = (symptom) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom))
    } else {
      setSymptoms([...symptoms, symptom])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle logging data
    console.log({ date, flow, symptoms })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Log Period - {date.toLocaleDateString()}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Flow Level</label>
            <div className="flex gap-4">
              {['light', 'medium', 'heavy'].map((level) => (
                <label key={level} className="flex items-center">
                  <input
                    type="radio"
                    name="flow"
                    value={level}
                    checked={flow === level}
                    onChange={(e) => setFlow(e.target.value)}
                    className="mr-2"
                  />
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Symptoms</label>
            <div className="grid grid-cols-2 gap-2">
              {symptomOptions.map((symptom) => (
                <label key={symptom} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={symptoms.includes(symptom)}
                    onChange={() => handleSymptomToggle(symptom)}
                    className="mr-2"
                  />
                  {symptom}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoggingModal