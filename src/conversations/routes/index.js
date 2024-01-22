const express = require("express");
const router = express.Router();
router.use("/", require("./conversations"));
module.exports = router;
