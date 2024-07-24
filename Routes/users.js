const express = require("express");
const router = express.Router();
const db = require("../models");
const User = db.User;
const bcrypt = require("bcryptjs");

router.post("/", (req, res, next) => {
  const { mail, name, password, confirmPassword } = req.body;

  if (!mail || !password) {
    req.flash("error", "email 及 password 為必填");
    return res.redirect("back");
  }

  if (password !== confirmPassword) {
    req.flash("error", "驗證密碼與密碼不符");
    return res.redirect("back");
  }

  return User.count({ where: { mail } })
    .then((rowCount) => {
      if (rowCount > 0) {
        req.flash("error", "email 已註冊");
        return;
      }
      return bcrypt
        .hash(password, 10)
        .then((hash) => User.create({ mail, name, password: hash }));
    })
    .then((user) => {
      if (!user) {
        return res.redirect("back");
      }

      req.flash("success", "註冊成功");
      return res.redirect("/login");
    })
    .catch((error) => {
      error.errorMessage = "註冊失敗";
      next(error);
    });
});
module.exports = router;
