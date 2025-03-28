import React, { useState } from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, addMonths, subMonths, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from './Modal';
import LogPeriodForm from './LogPeriodForm';

const phaseColors = {
  menstrual: 'bg-red-200',
  follicular: 'bg-green-200',
  ovulation: 'bg-yellow-200',
  luteal: 'bg-purple-200',
  predicted: 'bg-red-600 text-white'
};

function getPhaseForDate(date, cycleData, predictedDate) {
  const cycleStart = new Date(cycleData.startDate);
  const dayInCycle = Math.floor((date - cycleStart) / (1000 * 60 * 60 * 24));

  if (isSameDay(date, new Date(predictedDate))) {
    return 'predicted';
  }

  if (dayInCycle >= 0) {
    if (dayInCycle < 5) return 'menstrual';
    if (dayInCycle < 14) return 'follicular';
    if (dayInCycle < 17) return 'ovulation';
    if (dayInCycle < 28) return 'luteal';
  }

  return null;
}

function CycleCalendar({ data, predictedDate }) {
  const [currentDate, setCurrentDate] = useState(new Date(data[0].startDate));
  const [selectedDate, setSelectedDate] = useState(null);
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const handleSave = (formData) => {
    console.log('Saving data:', formData);
    setSelectedDate(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-purple-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-purple-600" />
        </button>
        <h3 className="text-lg font-semibold text-purple-900">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-purple-100 rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-purple-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-xs font-semibold text-purple-600 py-1">
            {day}
          </div>
        ))}
        
        {days.map((day, index) => {
          const phase = getPhaseForDate(day, data[0], predictedDate);
          const dayClass = phase ? phaseColors[phase] : 'hover:bg-purple-50';
          
          return (
            <button
              key={index}
              onClick={() => handleDayClick(day)}
              className={`p-1 rounded-full text-sm transition-colors ${dayClass}`}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {Object.entries(phaseColors).map(([phase, color]) => (
          <div key={phase} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full ${color}`}></div>
            <span className="text-sm capitalize">{phase}</span>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        title={`Log Period - ${selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}`}
      >
        <LogPeriodForm
          date={selectedDate}
          onSave={handleSave}
          onCancel={() => setSelectedDate(null)}
        />
      </Modal>
    </div>
  );
}

export default CycleCalendar;