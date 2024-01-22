const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const { connectDataBase } = require("./.config/databaseManager");
const app = express();
const cookieParser = require("cookie-parser");
const { logger } = require("./common/helper");
// Connect Database
connectDataBase();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors);
app.use(secureQuery);
app.use(globalLimiter);


app.get("/", (req, res) =>
  res.status(200).json({ message: "Active", details: {} })
);


const PORT = process.env.PORT;
app.listen(PORT, () => {
  logger.info(`Server started @ port ${PORT}`);
});
