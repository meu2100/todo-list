const express = require("express");
const router = express.Router();
const todos = require("./todos");
const users = require("./users");
const passport = require("passport");
const localStrategy = require("passport-local");
const authHandler = require("../middlewares/auth-handler");
const bcrypt = require('bcryptjs')

const db = require("../models");
const User = db.User;

passport.use(
  new localStrategy({ usernameField: "mail" }, (username, password, done) => {
    return User.findOne({
      attributes: ["id", "name", "mail", "password"],
      where: { mail: username },
      raw: true,
    })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: "mail 或密碼錯誤" });
        }
        return bcrypt.compare(password, user.password).then((isMatch) => {
          if (!isMatch) {
            return done(null, false, { message: "mail 或密碼錯誤" });
          }

          return done(null, user);
        });
      })
      .catch((error) => {
        error.errorMessage = "登入失敗";
        done(error);
      });
  })
);

passport.serializeUser((user, done) => {
  const { id, name, mail } = user;
  return done(null, { id, name, mail });
});

passport.deserializeUser((user, done) => {
  done(null, { id: user.id });
});

router.use("/todos", authHandler, todos);
router.use("/users", users);

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/register", (req, res) => {
  return res.render("register");
});

router.get("/login", (req, res) => {
  return res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/todos",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.post("/logout", (req, res) => {
  req.logout((error) => {
    if (error) {
      next(error);
    }

    return res.redirect("/login");
  });
});

// 匯出路由器
module.exports = router;
