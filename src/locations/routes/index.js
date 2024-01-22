const express = require("express");
const router = express.Router();
router.use("/", require("./location"));
module.exports = router;