const express = require("express");
const router = express.Router();
router.use("/", require("./bookings"));
router.use("/", require("./adminBookingRoutes"))
module.exports = router;