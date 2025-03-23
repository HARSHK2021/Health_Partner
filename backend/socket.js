import { Server } from "socket.io";

const activeUsers = new Map(); // Store active users { userId: socketId }

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*", // Adjust this for security
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Handle user joining (storing active users)
        socket.on("join", (userId) => {
            activeUsers.set(userId, socket.id);
            console.log(`User ${userId} connected with socket ID: ${socket.id}`);
        });

        // Handle user disconnect
        socket.on("disconnect", () => {
            for (let [userId, socketId] of activeUsers.entries()) {
                if (socketId === socket.id) {
                    activeUsers.delete(userId);
                    console.log(`User ${userId} disconnected`);
                    break;
                }
            }
        });

        // Handle sending access request
        socket.on("sendAccessRequest", ({ doctorId, patientId }) => {
            const patientSocketId = activeUsers.get(patientId);
            if (patientSocketId) {
                io.to(patientSocketId).emit("receiveAccessRequest", { doctorId, patientId });
                console.log(`Access request sent from Doctor (${doctorId}) to Patient (${patientId})`);
            }
        });

        // Handle response to access request
        socket.on("respondToAccessRequest", ({ doctorId, patientId, granted }) => {
            const doctorSocketId = activeUsers.get(doctorId);
            if (doctorSocketId) {
                io.to(doctorSocketId).emit("accessRequestResponse", { patientId, granted });
                console.log(`Patient (${patientId}) ${granted ? "granted" : "denied"} access to Doctor (${doctorId})`);
            }
        });
    });

    return io;
};
