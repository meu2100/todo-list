const passport = require("passport");
const localStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const FacebookStrategy = require("passport-facebook");

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

passport.use(
  new FacebookStrategy(
    {
      clientID: 816968827221158,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/oauth2/login/facebook",
      profileFields: ["email", "displayName"],
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      const email = profile.email[0].value;
      const name = profile.displayName;
    

      return User.findOne({
        attributes: ["id", "name", "email"],
        where: { email },
        raw: true,
      })
        .then((user) => {
          if (user) return done(null, user);

          const randomPwd = Math.random().toString(36).slice(-8);

          return bcrypt
            .hash(randomPwd, 10)
            .then((hash) => User.create({ name, email, password: hash }))
            .then((user) =>
              done(null, { id: user.id, name: user.name, email: user.email })
            );
        })
        .catch((error) => {
          error.errorMessage = "登入失敗";
          done(error);
        });
    }
  )
);

module.exports = passport