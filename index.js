const express = require('express');
const HTTP_SERVER = express();
const cors = require("cors");
const bodyparser = require("body-parser");

// // Configure the server to accept JSON
HTTP_SERVER.use(bodyparser.json());

// ENABLING CORS
const PORT = 5000
HTTP_SERVER.listen(PORT,()=> {
    console.log("server start successful");
})
HTTP_SERVER.use(cors());

// // REGISTERING ALL THE CONTROLLERS
HTTP_SERVER.use("/api/events", require("./controllers/events.controller"));

HTTP_SERVER.all("/", (req, res) => {
  return res.status(200).json({
    message: "Request Successful",
  });
});