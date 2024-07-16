const express = require("express");
const router = express.Router();
const db = require("../models");
const User = db.User;

router.post("/", (req, res) => {
  return res.send(req.body);
});

module.exports = router