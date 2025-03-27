import { CalendarDaysIcon, ChartBarIcon, HeartIcon } from '@heroicons/react/24/outline'

function CycleDashboard({ userData }) {
  const { currentPhase, nextPredictedPeriod } = userData
  
  const getPhaseColor = (phase) => {
    const colors = {
      menstruation: 'bg-red-500',
      follicular: 'bg-blue-500',
      ovulation: 'bg-green-500',
      luteal: 'bg-purple-500'
    }
    return colors[phase] || 'bg-gray-500'
  }

  return (
    <div className="backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 rounded-xl p-6 mb-8 shadow-xl">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center p-4 rounded-lg bg-white/50 dark:bg-gray-700/50">
          <CalendarDaysIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          <h3 className="mt-2 font-semibold">Current Phase</h3>
          <p className={`mt-1 px-3 py-1 rounded-full ${getPhaseColor(currentPhase.phase)} text-white`}>
            {currentPhase.phase}
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {currentPhase.daysRemaining} days remaining
          </p>
        </div>

        <div className="flex flex-col items-center p-4 rounded-lg bg-white/50 dark:bg-gray-700/50">
          <HeartIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          <h3 className="mt-2 font-semibold">Next Period</h3>
          <p className="mt-1 text-lg text-purple-700 dark:text-purple-300">
            {nextPredictedPeriod.toLocaleDateString()}
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            in {Math.ceil((nextPredictedPeriod - new Date()) / (1000 * 60 * 60 * 24))} days
          </p>
        </div>

        <div className="flex flex-col items-center p-4 rounded-lg bg-white/50 dark:bg-gray-700/50">
          <ChartBarIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          <h3 className="mt-2 font-semibold">Cycle Length</h3>
          <p className="mt-1 text-lg text-purple-700 dark:text-purple-300">
            {userData.averageCycleLength} days
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            average cycle
          </p>
        </div>
      </div>
    </div>
  )
}

export default CycleDashboard