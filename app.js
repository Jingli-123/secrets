//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const { Schema } = mongoose;

const app = express();

console.log(process.env.API_KEY);

//Level 1 Username and password only
//level 2 Encryption
//level 3 environment, use dotenv

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://127.0.0.1:27017/userDB")
  .then(() => {
    console.log("Successful connect to mongodb.");
  })
  .catch((e) => {
    console.log(e);
  });
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
}); //plugin use before we create mongoose schema.
const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/logout", function (req, res) {
  res.render("home");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  console.log(req.body.password);
  const newUser = new User({
    email: `${req.body.username}`,
    password: `${req.body.password}`,
  });
  newUser
    .save()
    .then((saveObject) => {
      console.log("Rgist successful.");
      console.log(saveObject);
    })
    .catch((e) => {
      console.log(e);
    });
  res.render("secrets");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ email: username })
    .then((data) => {
      if (data) {
        if (data.password === password) {
          res.render("secrets");
        }
      }
      if (!data) {
        console.log("user is not exists.");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
