const express = require("express");
const app = express();
const port = process.env.PORT || 3333;
const cors = require("cors");

app.use(express.json());

const server = require("http").createServer(app);

require("./App/Configs/dotenv");
require('./socket.io')(server);


app.use(cors());

const db = require("./App/Models");

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });



app.get("/", (req, res) => {
  console.log("here we are");
  res.send("we are here");
});

//routes
const reg = require("./App/Routes/register.routes");
const log = require("./App/Routes/login.routes");
const users = require('./App/Routes/getUsers.routes');
const message = require("./App/Routes/getMessage.routes");
const send = require('./App/Routes/sendMessage.routes');

app.use("/api", reg);
app.use("/api", log);
app.use("/api", users);
app.use("/api", message);
app.use("/api", send);

server.listen(port, () => {
  console.log(`connect to http://localhost:${port}`);
});