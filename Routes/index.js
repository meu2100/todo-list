const express = require("express");
const router = express.Router();
const root = require("./root");
const oauth = require("./oauth");
const todos = require("./todos");
const users = require("./users");
const authHandler = require("../middlewares/auth-handler");
const passport = require('../config/passport')

router.use("/", root);
router.use("/oauth", oauth);
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

router.get(
  "/login/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/oauth2/login/facebook",
  passport.authenticate("facebook", {
    successRedirect: "/todos",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.post("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }return res.redirect("/login");
  });
});

module.exports = router;
