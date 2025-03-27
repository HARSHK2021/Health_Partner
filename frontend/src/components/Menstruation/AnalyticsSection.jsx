import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function AnalyticsSection({ userData }) {
  // Mock data for the chart
  const cycleData = [
    { month: 'Jan', length: 28, prediction: 28 },
    { month: 'Feb', length: 29, prediction: 28 },
    { month: 'Mar', length: 27, prediction: 28 },
    { month: 'Apr', length: 28, prediction: 28 },
    { month: 'May', length: 30, prediction: 28 },
    { month: 'Jun', length: 28, prediction: 28 },
  ]

  return (
    <div className="backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 rounded-xl p-6 shadow-xl">
      <h2 className="text-2xl font-semibold mb-4 text-purple-800 dark:text-purple-200">Cycle Analytics</h2>
      
      <div className="h-[300px] mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={cycleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[20, 40]} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="length" 
              stroke="#8884d8" 
              name="Actual Length"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="prediction" 
              stroke="#82ca9d" 
              name="Predicted Length"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-700/50">
          <h3 className="font-semibold mb-2">Prediction Accuracy</h3>
          <p className="text-2xl font-bold text-purple-600">92%</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Last 6 cycles</p>
        </div>
        
        <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-700/50">
          <h3 className="font-semibold mb-2">Average Cycle Length</h3>
          <p className="text-2xl font-bold text-purple-600">28.3</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">days</p>
        </div>
        
        <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-700/50">
          <h3 className="font-semibold mb-2">Period Duration</h3>
          <p className="text-2xl font-bold text-purple-600">5.2</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">days</p>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsSection