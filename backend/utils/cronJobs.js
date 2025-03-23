import cron from "node-cron";
import { sendPeriodNotifications } from "../controllers/menstruationController.js"; // Adjust path if needed

// Run every day at midnight
cron.schedule("0 0 * * *", () => {
    console.log("Running daily period reminder task...");
    sendPeriodNotifications();
});

export default cron;
