import Calendar from 'react-calendar'
import { format } from 'date-fns'
import 'react-calendar/dist/Calendar.css'

function CalendarView({ userData, onDateClick }) {
  const { lastPeriodDate, nextPredictedPeriod, currentPhase } = userData

  const getTileClassName = ({ date }) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const periodStart = format(lastPeriodDate, 'yyyy-MM-dd')
    const periodEnd = format(new Date(lastPeriodDate.getTime() + (userData.averagePeriodLength * 24 * 60 * 60 * 1000)), 'yyyy-MM-dd')
    const fertileStart = format(currentPhase.fertileWindow.start, 'yyyy-MM-dd')
    const fertileEnd = format(currentPhase.fertileWindow.end, 'yyyy-MM-dd')
    const ovulation = format(currentPhase.ovulationDate, 'yyyy-MM-dd')
    
    let classes = 'relative'

    if (dateStr >= periodStart && dateStr <= periodEnd) {
      classes += ' bg-red-200 text-red-900'
    } else if (dateStr === ovulation) {
      classes += ' bg-orange-200 text-orange-900'
    } else if (dateStr >= fertileStart && dateStr <= fertileEnd) {
      classes += ' bg-green-200 text-green-900'
    }

    return classes
  }

  return (
    <div className="backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 rounded-xl p-6 mb-8 shadow-xl">
      <h2 className="text-2xl font-semibold mb-4 text-purple-800 dark:text-purple-200">Cycle Calendar</h2>
      <div className="calendar-container">
        <Calendar
          onChange={onDateClick}
          value={new Date()}
          tileClassName={getTileClassName}
          className="rounded-lg border-none shadow-lg"
        />
      </div>
      <div className="mt-4 flex gap-4 justify-center">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-200 rounded-full mr-2"></div>
          <span className="text-sm">Period</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-200 rounded-full mr-2"></div>
          <span className="text-sm">Fertile Window</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-orange-200 rounded-full mr-2"></div>
          <span className="text-sm">Ovulation</span>
        </div>
      </div>
    </div>
  )
}

export default CalendarView