const express = require("express");
const router = express.Router();
router.use("/", require("./organisations"));
module.exports = router;