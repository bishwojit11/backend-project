const express = require("express");
const router = express.Router();
router.use("/", require("./notifications"));
module.exports = router;