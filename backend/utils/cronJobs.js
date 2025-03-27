// import cron from "node-cron";
// import { sendPeriodNotifications } from "../controllers/menstruationController.js"; 

// // Run every day at midnight
// cron.schedule("0 0 * * *", () => {
//     console.log("Running daily period reminder task...");
//     sendPeriodNotifications();
// });

// export default cron;
import cron from 'node-cron';
import User from '../models/User.js';
import Cycle from '../models/Cycle.js';

import mailSender from '../services/sendGrid.js';

// In-memory store for scheduled jobs
const activeJobs = new Map();

export const scheduleNotification = async ({ userId, email, dates, cycleId }) => {
  // Cancel any existing jobs for this user
  if (activeJobs.has(userId)) {
    activeJobs.get(userId).forEach(job => job.stop());
  }

  const newJobs = dates.map(notification => {
    const job = cron.schedule(
      // Run daily at 9am and check if today is the notification date
      '0 9 * * *', 
      async () => {
        try {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const notificationDate = new Date(notification.date);
          notificationDate.setHours(0, 0, 0, 0);
          
          if (notificationDate.getTime() === today.getTime()) {
            // Verify cycle still exists
            const cycle = await Cycle.findById(cycleId);
            if (!cycle) return;
            
            await mailSender(email, `${notification.type.replace('_', ' ')}`, notification.message);
            
            // One-time notifications stop after sending
            if (notification.type !== 'period_reminder') {
              job.stop();
            }
          }
        } catch (error) {
          console.error('Notification error:', error);
        }
      },
      {
        scheduled: true,
        timezone: 'America/New_York' // Set your preferred timezone
      }
    );
    return job;
  });

  activeJobs.set(userId, newJobs);
};

// Daily cleanup of old jobs
cron.schedule('0 0 * * *', () => {
  activeJobs.forEach((jobs, userId) => {
    if (jobs.every(job => !job.task)) {
      activeJobs.delete(userId);
    }
  });
});