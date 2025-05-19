const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const ejsMate = require("ejs-mate");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require('connect-mongo');

app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL, // Example: mongodb+srv://username:password@cluster.mongodb.net/dbname
    }),
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// Middile wares
// Serve static files and views
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Pass flash messages to views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/aboutus", (req, res) => {
  res.render("aboutus.ejs");
});

app.get("/contactus", (req, res) => {
  res.render("contactus.ejs");
});

app.get("/pricing", (req, res) => {
  res.render("pricing.ejs");
});

app.get("/services", (req, res) => {
  res.render("services.ejs");
});

app.get("/test", (req, res) => {
  res.render("test.ejs");
});

// Contact form For all Pages
app.post("/submit-form", async (req, res) => {
  const { name, email, phone, message } = req.body;
  console.log(name, phone, email, message);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // use App Password if 2FA enabled
      },
    });

    await transporter.sendMail({
      from: `"Website Contact" <${process.env.GMAIL_USER}>`,
      to: "sakabnouman@gmail.com",
      subject: "New Contact Form Submission",
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    req.flash("success", "Email sent successfully!");
    res.redirect("/home");
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to send email. Please try again.");
    res.redirect("/home");
  }
});

// Contact form for the contact us page

app.post("/submit-main-form", async (req, res) => {
  const {
    name,
    phone,
    email,
    device,
    brand,
    issue,
    model,
    address,
    faults,
    area,
  } = req.body;
  console.log(
    name,
    phone,
    email,
    device,
    brand,
    issue,
    model,
    address,
    faults,
    area
  );

  const output = `
    <h3>New Repair Request Received</h3>
    <ul>
      <li><strong>Name:</strong> ${name}</li>
      <li><strong>Phone:</strong> ${phone}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Device:</strong> ${device}</li>
      <li><strong>Brand:</strong> ${brand}</li>
      <li><strong>Issue:</strong> ${issue}</li>
      <li><strong>Model:</strong> ${model}</li>
      <li><strong>Address:</strong> ${address}</li>
      <li><strong>Faults:</strong> ${faults}</li>
      <li><strong>Area:</strong> ${area}</li>
    </ul>
  `;

  try {
    // Transporter setup
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // use App Password if 2FA enabled
      },
    });

    // Send mail
    await transporter.sendMail({
      from: `"Website Contact" <${process.env.GMAIL_USER}>`,
      to: "sakabnouman@gmail.com",
      subject: "New Repair Request",
      html: output,
    });
    req.flash("success", "Email sent successfully!");
    res.redirect("/contactus");
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to send email. Please try again.");
    res.redirect("/contactus");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
