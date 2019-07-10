const express = require("express");
const server = express();
const userRouter = require("./users/userRouter");

server.use(express.json());
server.use(logger);
server.use(userRouter);


server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const log = {
    method: req.method,
    url: req.url,
    time: new Date()
  };
  console.log(log);
  next();
}

module.exports = server;
