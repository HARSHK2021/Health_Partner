// import Menstruation from "../models/MenstruationRecord.js";
// import mailSender  from "../services/sendGrid.js"


// export const logPeriod = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const { startDate } = req.body;

//         if (!startDate) {
//             return res.status(400).json({ message: "Period start date is required" });
//         }

//         const parsedDate = moment(startDate, "YYYY-MM-DD").toDate();
//         const month = moment(parsedDate).month() + 1; // Convert to 1-12 format
//         const year = moment(parsedDate).year();

//         let record = await Menstruation.findOne({ user: userId });

//         if (!record) {
//             record = new Menstruation({ user: userId, periodDates: [{ startDate: parsedDate, month, year }] });
//         } else {
//             record.periodDates.push({ startDate: parsedDate, month, year });
//         }

//         // Sort period dates by latest first
//         record.periodDates.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

//         // Calculate cycle length & predict next period
//         if (record.periodDates.length > 1) {
//             const cycleLengths = record.periodDates.map((entry, index, arr) => {
//                 if (index === 0) return null;
//                 return moment(arr[index - 1].startDate).diff(moment(entry.startDate), "days");
//             }).filter(Boolean);

//             const avgCycleLength = Math.round(cycleLengths.reduce((sum, len) => sum + len, 0) / cycleLengths.length);
//             record.averageCycleLength = avgCycleLength;
//             record.predictedNextPeriod = moment(parsedDate).add(avgCycleLength, "days").toDate();
//         }

//         // Determine the current menstrual phase
//         record.currentPhase = getCurrentPhase(record);

//         await record.save();

//         res.status(201).json({ message: "Period logged successfully", record });
//     } catch (error) {
//         res.status(500).json({ message: "Error logging period", error: error.message });
//     }
// };

// // ➤ **2️⃣ Retrieve Period Data**
// export const getPeriodData = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const record = await Menstruation.findOne({ user: userId });

//         if (!record) {
//             return res.status(404).json({ message: "No period data found" });
//         }

//         res.status(200).json(record);
//     } catch (error) {
//         res.status(500).json({ message: "Error retrieving period data", error: error.message });
//     }
// };

// // ➤ **3️⃣ Predict Next Period & Determine Current Phase**
// const getCurrentPhase = (record) => {
//     if (!record || !record.periodDates.length) return "Unknown";

//     const lastPeriod = moment(record.periodDates[0].startDate);
//     const today = moment();
//     const cycleLength = record.averageCycleLength || 28;

//     const daysSinceLastPeriod = today.diff(lastPeriod, "days");

//     if (daysSinceLastPeriod <= 5) {
//         return "Menstruation (Period)";
//     } else if (daysSinceLastPeriod <= cycleLength / 2) {
//         return "Follicular Phase";
//     } else if (daysSinceLastPeriod === Math.floor(cycleLength / 2)) {
//         return "Ovulation";
//     } else {
//         return "Luteal Phase";
//     }
// };

// // ➤ **4️⃣ Email Reminders**
// export const sendPeriodNotifications = async () => {
//     try {
//         const users = await Menstruation.find({ predictedNextPeriod: { $exists: true } }).populate("user");

//         for (const record of users) {
//             const userEmail = record.user.email;
//             const nextPeriodDate = moment(record.predictedNextPeriod);
//             const today = moment();

//             if (today.isSame(nextPeriodDate.clone().subtract(7, "days"), "day")) {
//                 sendMail(userEmail, "Period Reminder", "Your period is expected in 7 days. Take care!");
//             } else if (today.isSame(nextPeriodDate, "day")) {
//                 sendMail(userEmail, "Period Started", "Your period is expected to start today.");
//             } else if (today.isSame(nextPeriodDate.clone().subtract(record.averageCycleLength / 2, "days"), "day")) {
//                 sendMail(userEmail, "Ovulation Reminder", "You're likely ovulating today. Stay healthy!");
//             }
//         }
//     } catch (error) {
//         console.error("Error sending period notifications:", error.message);
//     }
// };

import mongoose from 'mongoose';
import Cycle from '../models/Cycle.js';
import User from '../models/User.js';
import  mailSender from '../services/sendGrid.js';
import { scheduleNotification } from '../utils/cronJobs.js'

// Record a new period
export const recordPeriodStart = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { startDate, predicted, symptoms = [], flow = [] } = req.body;
   
    const userId = req.user._id;
    const user = await User.findById(userId).session(session);

    if (!user) {
      throw new Error('User not found');
    }

    // 1. Create new cycle record
    const newCycle = new Cycle({
      user: userId,
      startDate,
      symptoms,
      flow,
      isPredicted: predicted || false
    });

    // 2. Update user's last period date
    user.lastPeriodDate = startDate;
    user.cycleHistory.push(newCycle._id);

    // 3. Calculate and update next predicted period
    if (user.cycleHistory.length > 1) {
      const cycles = await Cycle.find({ 
        user: userId, 
        isPredicted: false 
      }).sort({ startDate: -1 }).limit(6).session(session);
      
      if (cycles.length >= 2) {
        // Weight recent cycles more heavily
        let totalWeight = 0;
        let weightedSum = 0;
        
        cycles.forEach((cycle, index) => {
          const weight = cycles.length - index;
          if (index > 0) {
            const diff = (cycles[index-1].startDate - cycle.startDate) / (1000 * 60 * 60 * 24);
            weightedSum += diff * weight;
            totalWeight += weight;
          }
        });
        
        const avgCycleLength = Math.round(weightedSum / totalWeight);
        const nextPredicted = new Date(startDate);
        nextPredicted.setDate(nextPredicted.getDate() + avgCycleLength);
        
        user.averageCycleLength = avgCycleLength;
        user.nextPredictedPeriod = nextPredicted;

        // Create predicted cycle record if not matched with actual
        const existing = await Cycle.findOne({ 
          user: userId, 
          startDate: { 
            $gte: new Date(nextPredicted.getTime() - 86400000),
            $lte: new Date(nextPredicted.getTime() + 86400000)
          }
        }).session(session);
        
        if (!existing) {
          const predictedCycle = new Cycle({
            user: userId,
            startDate: nextPredicted,
            isPredicted: true,
            predictionAccuracy: null
          });
          await predictedCycle.save({ session });
        }
      }
    }

    // 4. Check if this period matches any predictions
    const matchedPrediction = await Cycle.findOne({
      user: userId,
      startDate: { 
        $gte: new Date(new Date(startDate).getTime() - 3 * 86400000),
        $lte: new Date(new Date(startDate).getTime() + 3 * 86400000)
      },
      isPredicted: true,
      predictionAccuracy: null
    }).session(session);

    if (matchedPrediction) {
      const diffDays = Math.abs((new Date(startDate) - matchedPrediction.startDate) / (1000 * 60 * 60 * 24));
      const accuracy = Math.max(0, 100 - (diffDays * 20));
      matchedPrediction.predictionAccuracy = accuracy;
      await matchedPrediction.save({ session });
    }

    // 5. Schedule notifications for real periods
    if (!predicted) {
      const notificationDates = calculateNotificationDates(
        startDate, 
        user.averageCycleLength,
        user.averagePeriodLength
      );

      await scheduleNotification({
        userId: user._id.toString(),
        email: user.email,
        dates: notificationDates,
        cycleId: newCycle._id
      });
    }

    await user.save({ session });
    await newCycle.save({ session });
    await session.commitTransaction();

    // 6. Send confirmation email
    await mailSender(
      user.email,
      "Period Recorded",
      `Your period starting ${new Date(startDate).toDateString()} was recorded successfully.`
    );

    res.status(201).json({
      success: true,
      cycle: newCycle,
      nextPredictedPeriod: user.nextPredictedPeriod,
      matchedPrediction: matchedPrediction ? {
        id: matchedPrediction._id,
        accuracy: matchedPrediction.predictionAccuracy
      } : null
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Period recording error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to record period',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
};

// Get current cycle phase
export const getCurrentPhase = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user?.lastPeriodDate) {
      return res.json({ phase: 'no_data' });
    }

    const today = new Date();
    const lastPeriod = new Date(user.lastPeriodDate);
    const daysSincePeriod = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24));
    
    let phase, nextPhase, daysRemaining;
    const avgCycleLength = user.averageCycleLength || 28;
    const periodLength = user.averagePeriodLength || 5;

    if (daysSincePeriod < periodLength) {
      phase = 'menstruation';
      nextPhase = 'follicular';
      daysRemaining = periodLength - daysSincePeriod;
    } 
    else if (daysSincePeriod < avgCycleLength - 14) {
      phase = 'follicular';
      nextPhase = 'ovulation';
      daysRemaining = (avgCycleLength - 14) - daysSincePeriod;
    } 
    else if (daysSincePeriod < avgCycleLength - 7) {
      phase = 'ovulation';
      nextPhase = 'luteal';
      daysRemaining = (avgCycleLength - 7) - daysSincePeriod;
    } 
    else {
      phase = 'luteal';
      nextPhase = 'menstruation';
      daysRemaining = avgCycleLength - daysSincePeriod;
    }

    res.json({
      phase,
      nextPhase,
      daysRemaining,
      daysSincePeriod,
      ovulationDate: calculateOvulationDate(user.lastPeriodDate, avgCycleLength),
      fertileWindow: calculateFertileWindow(user.lastPeriodDate, avgCycleLength)
    });

  } catch (error) {
    console.error('Phase calculation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get cycle phase',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get cycle history
export const getCycleHistory = async (req, res) => {
  try {
    const cycles = await Cycle.find({ 
      user: req.user._id 
    }).sort({ startDate: -1 });

    const history = cycles.map(cycle => ({
      id: cycle._id,
      startDate: cycle.startDate,
      endDate: cycle.endDate,
      cycleLength: cycle.cycleLength,
      periodLength: cycle.periodLength,
      symptoms: cycle.symptoms,
      flow: cycle.flow,
      ovulationDate: cycle.ovulationDate,
      isPredicted: cycle.isPredicted,
      predictionAccuracy: cycle.predictionAccuracy,
      createdAt: cycle.createdAt
    }));

    res.json({ success: true, history });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get cycle history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper functions
const calculateNotificationDates = (startDate, cycleLength = 28, periodLength = 5) => {
  const dates = [];
  const start = new Date(startDate);
  
  // Period end reminder
  const periodEnd = new Date(start);
  periodEnd.setDate(periodEnd.getDate() + periodLength);
  dates.push({
    date: periodEnd,
    type: 'period_end',
    message: 'Your period is likely ending today. Track any symptoms.'
  });

  // Ovulation reminder (14 days before next period)
  const ovulationDate = new Date(start);
  ovulationDate.setDate(ovulationDate.getDate() + (cycleLength - 14));
  dates.push({
    date: ovulationDate,
    type: 'ovulation',
    message: 'You\'re likely ovulating today. Stay hydrated!'
  });

  // Next period reminder (3 days before)
  const nextPeriod = new Date(start);
  nextPeriod.setDate(nextPeriod.getDate() + cycleLength - 3);
  dates.push({
    date: nextPeriod,
    type: 'period_reminder',
    message: 'Your period may start in 3 days. Be prepared!'
  });

  return dates;
};

const calculateOvulationDate = (lastPeriod, cycleLength) => {
  const ovulation = new Date(lastPeriod);
  ovulation.setDate(ovulation.getDate() + (cycleLength - 14));
  return ovulation;
};

const calculateFertileWindow = (lastPeriod, cycleLength) => {
  const ovulation = calculateOvulationDate(lastPeriod, cycleLength);
  const start = new Date(ovulation);
  start.setDate(start.getDate() - 5);
  const end = new Date(ovulation);
  end.setDate(end.getDate() + 2);
  
  return {
    start,
    end
  };
};




export const updatePredictionFeedback = async (req, res) => {
  try {
    const { accurate, adjustment } = req.body;

    // Ensure valid adjustment
    const adjustedDays = parseInt(adjustment, 10);
    if (isNaN(adjustedDays)) {
      return res.status(400).json({ error: "Invalid adjustment value" });
    }

    // Fetch last recorded cycle
    const lastCycle = await Cycle.findOne().sort({ startDate: -1 });

    if (!lastCycle) {
      return res.status(404).json({ error: "No cycle data found" });
    }

    // Store feedback in last cycle record
    lastCycle.predictionFeedback = {
      accurate,
      adjustment: adjustedDays,
    };

    await lastCycle.save();

    // If prediction was incorrect, adjust future cycle estimates
    if (accurate === "no") {
      const newCycleLength = lastCycle.cycleLength + adjustedDays;

      // Update user's average cycle length
      await Cycle.updateMany(
        { userId: lastCycle.userId },
        { $set: { avgCycleLength: newCycleLength } }
      );
    }

    res.json({ message: "Prediction feedback updated successfully" });
  } catch (error) {
    console.error("Error updating prediction feedback:", error);
    res.status(500).json({ error: "Server error" });
  }
};