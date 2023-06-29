const express = require("express");

const router = express.Router();

router.post("/", async (req, res) => {
    res.send({ success: true, message: "API ok 🔥" })
});

module.exports = app => app.use("/", router);