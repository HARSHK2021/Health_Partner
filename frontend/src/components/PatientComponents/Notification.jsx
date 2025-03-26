import { useState } from "react";
import { Bell, Trash2, CheckCircle } from "lucide-react";
import { create } from "zustand";

// Zustand store for notifications currently hardcoded.
const useNotificationStore = create((set) => ({
  notifications: [
    { id: 1, message: "Your lab results are ready.", read: false },
    { id: 2, message: "Upcoming appointment with Dr. Smith on March 28.", read: false },
    { id: 3, message: "Time to take your medication.", read: false },
  ],
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  clearAll: () => set({ notifications: [] }),
}));

function Notification() {
  const { notifications, markAsRead, clearAll } = useNotificationStore();
  const [filterUnread, setFilterUnread] = useState(false);

  const filteredNotifications = filterUnread
    ? notifications.filter((n) => !n.read)
    : notifications;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
        <div className="flex space-x-2">
          <button 
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition"
            onClick={() => setFilterUnread(!filterUnread)}
          >
            {filterUnread ? "Show All" : "Show Unread"}
          </button>
          <button 
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            onClick={clearAll}
          >
            <Trash2 size={16} className="mr-1" /> Clear All
          </button>
        </div>
      </div>
      {filteredNotifications.length === 0 ? (
        <p className="text-gray-500 text-center">No notifications.</p>
      ) : (
        filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`mb-4 p-4 flex items-center justify-between rounded-lg shadow-md transition-colors duration-200 ${
              notification.read ? "bg-gray-200" : "bg-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Bell size={24} className="text-blue-500" />
              <span className="text-gray-700">{notification.message}</span>
            </div>
            {!notification.read && (
              <button
                className="flex items-center px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                onClick={() => markAsRead(notification.id)}
              >
                <CheckCircle size={16} className="mr-1" />
                Mark as Read
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Notification;
