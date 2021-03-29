const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
// const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const request = require("request");

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
app.get("/", (req, res) => res.send("Hello world"));
app.use("/api/users", usersRouter);

// app.use(express.static(path.join(__dirname, '../frontend/build')));
// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
// );
const server = http.Server(app);
server.listen(3000, () => console.log("hello"));

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  setInterval(() => {
    request(
      {
        method: "GET",
        uri: "https://api.upbit.com/v1/ticker?markets=KRW-BTC",
      },
      (err, result) => {
        console.log(err);
        console.log(JSON.parse(result.body));
        console.log("hello============");
        const parsedData = JSON.parse(result.body);
        socket.emit("data", parsedData);
      }
    );
  }, 4000);
});
