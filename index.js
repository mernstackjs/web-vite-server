require("dotenv").config();
const { PORT, MONGO_URL } = process.env;
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const router = require("./router");
const { isAuthantication } = require("./middleware/isAuthantication");
const { sendMail } = require("./utility/sendmail");
const port = PORT;
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.listen(port, () => console.log(`server is running on port ${port}`));

app.use("/", router());

app.get("/send", (req, res) => {
  const mail = {
    to: "mernstack.js@gmail.com",
    subject: "Subject",
    text: "Text is here",
    html: "html is here",
  };
  sendMail(mail.to, mail.subject, mail.text, mail.html);
  res.send("sms is sent");
});
