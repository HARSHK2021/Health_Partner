import React from 'react'
import Calendar from './Calender'

const Menstruation = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Menstruation Cycle Tracker
      </h1>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Track Your Cycle</h2>
          <p className="text-gray-600">
            Select your last period start date on the calendar to begin tracking your cycle phases. 
            The tracker will predict your next 5 cycles and show different phases throughout your cycle.
          </p>
        </div>
        <Calendar />
      </div>
    </div>
  </div>
  )
}

export default Menstruation
