const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");

const usersRouter = require("./routes/users");
const path = require("path");

mongoose.connect(
  //.env명령어로 실행하면 오류가 뜬다. 왜그럴까? 위에서 config설정 다해줬는데...
  "mongodb+srv://hyunkyu:hyunkyu1234@cluster0.vpbup.mongodb.net/gractor?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.once("open", () => console.log("Connected to DB!"));

app.use(express.json());
app.use(cors());

app.use("/api/users", usersRouter);

// app.use(express.static(path.join(__dirname, '../frontend/build')));
// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
// );

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
