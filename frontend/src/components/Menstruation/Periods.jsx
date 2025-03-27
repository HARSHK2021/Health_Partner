
import React, { useState } from 'react'
import CycleDashboard from './CycleDashboard'
import CalendarView from './CalendarView'
import AnalyticsSection from './AnalyticsSection'
import LoggingModal from './LoggingModal'
const Periods = () => {
    const [showLoggingModal, setShowLoggingModal] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null)
      // Mock user data
    const userData = {
        username: "Jane",
        averageCycleLength: 28,
        averagePeriodLength: 5,
        lastPeriodDate: new Date(2024, 1, 1),
        nextPredictedPeriod: new Date(2024, 2, 1),
        currentPhase: {
          phase: 'follicular',
          nextPhase: 'ovulation',
          daysRemaining: 3,
          daysSincePeriod: 7,
          ovulationDate: new Date(2024, 1, 15),
          fertileWindow: {
            start: new Date(2024, 1, 13),
            end: new Date(2024, 1, 17)
          }
        }
      }
      const handleDateClick = (date) => {
        setSelectedDate(date)
        setShowLoggingModal(true)
      }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-800 dark:text-purple-200">
          Period Tracker
        </h1>
        
        <CycleDashboard userData={userData} />
        
        <CalendarView 
          userData={userData}
          onDateClick={handleDateClick}
        />
        
        <AnalyticsSection userData={userData} />
        
        {showLoggingModal && (
          <LoggingModal
            date={selectedDate}
            onClose={() => setShowLoggingModal(false)}
          />
        )}
      </div>
    </div>
  )
}

export default Periods
