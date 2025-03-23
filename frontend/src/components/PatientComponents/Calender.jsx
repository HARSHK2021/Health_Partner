import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [markedDates, setMarkedDates] = useState([]);
  const [selectedType, setSelectedType] = useState('period');
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [cycleLength] = useState(28); // Average cycle length
  const [currentPhase, setCurrentPhase] = useState(null);

  useEffect(() => {
    if (lastPeriodDate) {
      calculateCyclePhases(lastPeriodDate);
    }
  }, [lastPeriodDate]);

  const calculateCyclePhases = (startDate) => {
    const start = new Date(startDate);
    const newMarkedDates = [];
    
    // Calculate next 5 cycles
    for (let cycle = 0; cycle < 5; cycle++) {
      const cycleStart = new Date(start);
      cycleStart.setDate(cycleStart.getDate() + (cycle * cycleLength));
      
      // Menstrual Phase (Days 1-5)
      for (let i = 0; i < 5; i++) {
        const date = new Date(cycleStart);
        date.setDate(date.getDate() + i);
        newMarkedDates.push({
          date: date.toISOString().split('T')[0],
          type: cycle === 0 ? 'period' : 'predicted',
          phase: 'menstrual'
        });
      }

      // Follicular Phase (Days 6-13)
      for (let i = 5; i < 13; i++) {
        const date = new Date(cycleStart);
        date.setDate(date.getDate() + i);
        newMarkedDates.push({
          date: date.toISOString().split('T')[0],
          type: 'predicted',
          phase: 'follicular'
        });
      }

      // Ovulation Phase (Days 14-16)
      for (let i = 13; i < 16; i++) {
        const date = new Date(cycleStart);
        date.setDate(date.getDate() + i);
        newMarkedDates.push({
          date: date.toISOString().split('T')[0],
          type: 'ovulation',
          phase: 'ovulation'
        });
      }

      // Luteal Phase (Days 17-28)
      for (let i = 16; i < cycleLength; i++) {
        const date = new Date(cycleStart);
        date.setDate(date.getDate() + i);
        newMarkedDates.push({
          date: date.toISOString().split('T')[0],
          type: 'predicted',
          phase: 'luteal'
        });
      }
    }

    setMarkedDates(newMarkedDates);
    updateCurrentPhase(new Date(), newMarkedDates);
  };

  const updateCurrentPhase = (today, dates) => {
    const todayString = today.toISOString().split('T')[0];
    const currentMarking = dates.find(mark => mark.date === todayString);
    setCurrentPhase(currentMarking?.phase || null);
  };

  const handleDateSelect = (date) => {
    setLastPeriodDate(date);
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isDateMarked = (day) => {
    const dateString = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString()
      .split('T')[0];
    return markedDates.find(mark => mark.date === dateString);
  };

  const getPhaseDescription = (phase) => {
    switch (phase) {
      case 'menstrual':
        return 'Menstrual Phase: Period flow occurs as the uterine lining sheds';
      case 'follicular':
        return 'Follicular Phase: Follicles in ovaries develop, preparing for ovulation';
      case 'ovulation':
        return 'Ovulation Phase: A mature egg is released from the ovary';
      case 'luteal':
        return 'Luteal Phase: The body prepares for possible pregnancy';
      default:
        return 'Select your last period start date to begin tracking';
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const marked = isDateMarked(day);
      const dateString = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        .toISOString()
        .split('T')[0];
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(dateString)}
          className={`h-12 rounded-full flex items-center justify-center transition-colors relative
            ${marked ? getMarkingColor(marked.type, marked.phase) : 'hover:bg-gray-100'}
            ${lastPeriodDate === dateString ? 'ring-2 ring-blue-500' : ''}
          `}
        >
          {day}
          {marked && marked.type === 'predicted' && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          )}
        </button>
      );
    }

    return days;
  };

  const getMarkingColor = (type, phase) => {
    if (type === 'predicted') {
      switch (phase) {
        case 'menstrual':
          return 'bg-red-100 hover:bg-red-200';
        case 'follicular':
          return 'bg-yellow-100 hover:bg-yellow-200';
        case 'ovulation':
          return 'bg-green-100 hover:bg-green-200';
        case 'luteal':
          return 'bg-purple-100 hover:bg-purple-200';
        default:
          return 'bg-gray-100 hover:bg-gray-200';
      }
    }
    
    switch (type) {
      case 'period':
        return 'bg-red-200 hover:bg-red-300';
      case 'ovulation':
        return 'bg-green-300 hover:bg-green-400';
      case 'fertile':
        return 'bg-purple-200 hover:bg-purple-300';
      default:
        return 'bg-gray-100 hover:bg-gray-200';
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-gray-500 text-sm">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Cycle Information</h3>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">
                  {lastPeriodDate ? `Last period started: ${new Date(lastPeriodDate).toLocaleDateString()}` : 'Select your last period start date'}
                </span>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Current Phase:</div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  {getPhaseDescription(currentPhase)}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold mb-2">Phase Legend</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-200"></div>
                <span>Menstrual Phase (Days 1-5)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-100"></div>
                <span>Follicular Phase (Days 6-13)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-100"></div>
                <span>Ovulation Phase (Days 14-16)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-100"></div>
                <span>Luteal Phase (Days 17-28)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}