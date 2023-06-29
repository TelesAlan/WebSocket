const express = require("express");
const cors = require("cors");
const WebSocketServer = require("./webSocket");

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "*"
}));
app.use(express.json());

// Router to get status of server
app.get("/turnOn", (req, res) => {
    wss.broadcast({
        lightIsActive: true, 
        willIsBeautiful: true
    });

    res.json({
        success: true, 
        status: 200
    });
});
// Get all controllers inside path app/controllers
require("./app/controllers")(app);

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`>> Server Express is running in port ${process.env.PORT || 3000}`);
});

// Init Web Socket Server
const wss = WebSocketServer(server);

setInterval(() => {
    wss.broadcast({
        lux: Number(Math.random().toFixed(1)), // Level of lux in ambient
        luxIsActive: Math.random() < 0.5,

        humid: Number((Math.random() * 100).toFixed(2)), // Level humid of earth
        ph: Number((Math.random() * (14 - 7) + 7).toFixed(2)),
        temp: Number((Math.random() * 100).toFixed(2)),

        bombIsActive: Math.random() < 0.5,
        reservoirIsFull: Math.random() < 0.5,

        time: new Date()
    });
}, 10000);