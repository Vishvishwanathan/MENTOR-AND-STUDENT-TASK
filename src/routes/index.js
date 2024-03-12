const express = require('express');
const AssignRoutes = require("./studentmentor.js");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send(`
    <h1 style="text-align:center">Welcome to Backend of Assign mentor</h1>`);
});
router.use("/", AssignRoutes);

module.exports = router;