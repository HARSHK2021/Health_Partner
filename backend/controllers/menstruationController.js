import Menstruation from "../models/MenstruationRecord.js";
import mailSender  from "../services/sendGrid.js"


export const logPeriod = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate } = req.body;

        if (!startDate) {
            return res.status(400).json({ message: "Period start date is required" });
        }

        const parsedDate = moment(startDate, "YYYY-MM-DD").toDate();
        const month = moment(parsedDate).month() + 1; // Convert to 1-12 format
        const year = moment(parsedDate).year();

        let record = await Menstruation.findOne({ user: userId });

        if (!record) {
            record = new Menstruation({ user: userId, periodDates: [{ startDate: parsedDate, month, year }] });
        } else {
            record.periodDates.push({ startDate: parsedDate, month, year });
        }

        // Sort period dates by latest first
        record.periodDates.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

        // Calculate cycle length & predict next period
        if (record.periodDates.length > 1) {
            const cycleLengths = record.periodDates.map((entry, index, arr) => {
                if (index === 0) return null;
                return moment(arr[index - 1].startDate).diff(moment(entry.startDate), "days");
            }).filter(Boolean);

            const avgCycleLength = Math.round(cycleLengths.reduce((sum, len) => sum + len, 0) / cycleLengths.length);
            record.averageCycleLength = avgCycleLength;
            record.predictedNextPeriod = moment(parsedDate).add(avgCycleLength, "days").toDate();
        }

        // Determine the current menstrual phase
        record.currentPhase = getCurrentPhase(record);

        await record.save();

        res.status(201).json({ message: "Period logged successfully", record });
    } catch (error) {
        res.status(500).json({ message: "Error logging period", error: error.message });
    }
};

// ➤ **2️⃣ Retrieve Period Data**
export const getPeriodData = async (req, res) => {
    try {
        const userId = req.user.id;
        const record = await Menstruation.findOne({ user: userId });

        if (!record) {
            return res.status(404).json({ message: "No period data found" });
        }

        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving period data", error: error.message });
    }
};

// ➤ **3️⃣ Predict Next Period & Determine Current Phase**
const getCurrentPhase = (record) => {
    if (!record || !record.periodDates.length) return "Unknown";

    const lastPeriod = moment(record.periodDates[0].startDate);
    const today = moment();
    const cycleLength = record.averageCycleLength || 28;

    const daysSinceLastPeriod = today.diff(lastPeriod, "days");

    if (daysSinceLastPeriod <= 5) {
        return "Menstruation (Period)";
    } else if (daysSinceLastPeriod <= cycleLength / 2) {
        return "Follicular Phase";
    } else if (daysSinceLastPeriod === Math.floor(cycleLength / 2)) {
        return "Ovulation";
    } else {
        return "Luteal Phase";
    }
};

// ➤ **4️⃣ Email Reminders**
export const sendPeriodNotifications = async () => {
    try {
        const users = await Menstruation.find({ predictedNextPeriod: { $exists: true } }).populate("user");

        for (const record of users) {
            const userEmail = record.user.email;
            const nextPeriodDate = moment(record.predictedNextPeriod);
            const today = moment();

            if (today.isSame(nextPeriodDate.clone().subtract(7, "days"), "day")) {
                sendMail(userEmail, "Period Reminder", "Your period is expected in 7 days. Take care!");
            } else if (today.isSame(nextPeriodDate, "day")) {
                sendMail(userEmail, "Period Started", "Your period is expected to start today.");
            } else if (today.isSame(nextPeriodDate.clone().subtract(record.averageCycleLength / 2, "days"), "day")) {
                sendMail(userEmail, "Ovulation Reminder", "You're likely ovulating today. Stay healthy!");
            }
        }
    } catch (error) {
        console.error("Error sending period notifications:", error.message);
    }
};