import React from 'react';
import { format, eachDayOfInterval } from 'date-fns';

function FertileWindow({ data }) {
  const cycle = data[0];
  const fertileWindow = eachDayOfInterval({
    start: new Date(cycle.fertileWindow.start),
    end: new Date(cycle.fertileWindow.end)
  });

  return (
    <div className="space-y-4">
      <div className="flex space-x-1">
        {fertileWindow.map((date, index) => {
          const isOvulation = format(date, 'yyyy-MM-dd') === cycle.ovulationDate;
          
          return (
            <div
              key={index}
              className={`flex-1 p-2 rounded-lg text-center ${
                isOvulation
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-900'
              }`}
            >
              <div className="text-sm">{format(date, 'd')}</div>
              <div className="text-xs">{format(date, 'MMM')}</div>
              {isOvulation && (
                <div className="text-xs mt-1">Ovulation</div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="text-sm text-purple-600 text-center">
        Fertile Window: {format(new Date(cycle.fertileWindow.start), 'MMM d')} - {format(new Date(cycle.fertileWindow.end), 'MMM d')}
      </div>
    </div>
  );
}

export default FertileWindow;