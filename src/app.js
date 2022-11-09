const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const hbs = require("hbs");
const path = require("path");
const mongoose = require("mongoose");
const db = require("./db");
const async = require("hbs/lib/async");
var bodyParser = require("body-parser");
const { json } = require("express/lib/response");
const res = require("express/lib/response");
const bcrypt = require("bcrypt");


const app = express();

const port = 3300 || process.env.port;

const staticPath = path.join(__dirname, "../public");
const viewPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.use(express.static(staticPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "hbs");
app.set("views", viewPath);
hbs.registerPartials(partialsPath);

app.get("/", (req, res) => {
  res.render("signin");
});

app.get("/home", (req, res) => {
  res.render("index");
});


app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/contactus", (req, res) => {
  res.render("contact");
});

app.post("/registered", async (req, res) => {
  try {
    const isExist = await db.Account.findOne({ email: req.body.email });
    if (!isExist) {
      const pwd = req.body.password;
      const cpwd = req.body.cnfpassword;
      if (pwd == cpwd) {
        const data = new db.Account({
          fstname: req.body.fname,
          midname: req.body.mname,
          lstname: req.body.lname,
          email: req.body.email,
          phone: req.body.phone,
          dob: req.body.dob,
          password: req.body.password,
        });
        const result = await data.save();
        res.send("Your account created successfully.");
      } else {
        res.send("Password doesn't match.");
      }
    } else {
      res.send("Email already exists.");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/log", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userMail = await db.Account.findOne({ email:email });
    const isMatch = await bcrypt.compare(password, userMail.password);
    if (isMatch) {
      res.status(201).render("index");
    } else {
      res.status(404).send("Please check your email or password.");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/contact", async(req, res) => {
    try {
        const data = new db.Contact({
            email : req.body.email,
            query : req.body.query
        })

        await data.save();
        res.status(201).send("We will contact you soon.")
    } catch (error) {
        res.status(404).send("Server problem.")
    }
})

app.listen(process.env.PORT || port, () => {
  console.log(`Listening at ${port}`);
});
