const mongoose = require("mongoose");
const { logger } = require("../common/helper/logger");

exports.connectDataBase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI + "/" + process.env.MAIN_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
    });
    logger.info("Database Connected");
  } catch (err) {
    logger.error(err.message);
    logger.error(err.stack);
    // Exit process with failure
    process.exit(1);
  }
};
