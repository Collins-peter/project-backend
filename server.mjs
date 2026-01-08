import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import db from "./Database/dataBase.mjs";
import { createServer } from "http";
import { Server } from "socket.io";
import createPackage from "./controller/createPackage.mjs";
import trackPackage from "./controller/trackPackage.mjs";
import updateStatus from "./controller/updateStatus.mjs";

const app = express();
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin : "http://localhost:5173",
        methods : ["GET", "POST"]
    }
})

//CONNECTING FRONTEND URL
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

//CHECKING DATABASE CONNECTION
db.connect((error) => {
    if (error) {
        console.error("Database connection failed:", error);
    } else {
        console.log("mySQL connected...")
    }
});

//SOCKET CONNECTION
io.on("connection", (socket) => {
    console.log("Client Connected:" , socket.id);
});

//ROUTERS
app.post("/admin/create-tracker", createPackage);
app.put("/admin/update-status", updateStatus);
app.get("/admin/track-package/:trackId", trackPackage);

//MAKING io AVAILABLE GLOBALLY FOR CONTROLLER
global.io = io;

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
    console.log(`Running on localhost: ${PORT}`);
});
