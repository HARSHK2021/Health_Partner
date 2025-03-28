import React , { useState }  from 'react'
import { Calendar, LineChart, PieChart, Activity, Droplets, Sun } from 'lucide-react';
import { addDays } from 'date-fns';
import CycleCalendar from './CycleCalendar';
import CycleLengthChart from './CycleLengthChart';
import PeriodLengthChart from './PeriodLengthChart';
import SymptomsHeatmap from './SymptomsHeatmap';
import FlowDistribution from './FlowDistribution';
import FertileWindow from './FertileWindow';
import CyclePhases from './CyclePhases';
const mockData = [{
    startDate: "2025-03-02",
    cycleLength: 28,
    periodLength: 5,
    symptoms: [
      { name: "Headache", intensity: 2, date: "2025-03-02" },
      { name: "Cramps", intensity: 3, date: "2025-03-03" }
    ],
    flow: [
      { date: "2025-03-01", level: "heavy" },
      { date: "2025-03-02", level: "medium" }
    ],
    ovulationDate: "2025-03-14",
    fertileWindow: { start: "2025-03-11", end: "2025-03-16" }
  }];
const Menstruation = () => {
    const [predictedDate, setPredictedDate] = useState(() => {
        const lastStart = new Date(mockData[0].startDate);
        return addDays(lastStart, 24); // Default cycle length
      });
    
      const handleAccurate = () => {
        // Here you would typically update your prediction model
        console.log('Prediction was accurate');
      };
    
      const handleUpdatePrediction = (daysDiff) => {
        console.log(daysDiff)
        setPredictedDate(current => addDays(current, daysDiff));
      };
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">Period Tracker</h1>
          <p className="text-purple-600">Track your menstrual cycle with ease</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cycle Calendar */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-purple-900">Cycle Calendar</h2>
            </div>
            <CycleCalendar 
              data={mockData} 
              predictedDate={predictedDate}
            />
          </div>

          {/* Cycle Phases */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-purple-900">Cycle Phases</h2>
            </div>
            <CyclePhases
              currentDate={new Date(mockData[0].startDate)}
              predictedDate={predictedDate}
              onAccurate={handleAccurate}
              onUpdatePrediction={handleUpdatePrediction}
            />
          </div>

          {/* Cycle Length Trends */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <LineChart className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-purple-900">Cycle Length Trends</h2>
            </div>
            <CycleLengthChart data={mockData} />
          </div>

          {/* Period Length Trends */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-purple-900">Period Length Trends</h2>
            </div>
            <PeriodLengthChart data={mockData} />
          </div>

          {/* Flow Level Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-purple-900">Flow Distribution</h2>
            </div>
            <FlowDistribution data={mockData} />
          </div>

          {/* Fertile Window */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sun className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-purple-900">Fertile Window</h2>
            </div>
            <FertileWindow data={mockData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Menstruation
