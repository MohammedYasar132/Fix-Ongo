const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");

const port = process.env.PORT || 3000;

/* ======================
   SESSION & FLASH
====================== */
app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

/* ======================
   MIDDLEWARES
====================== */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ======================
   ROUTES
====================== */
app.get("/", (req, res) => res.render("index.ejs"));
app.get("/aboutus", (req, res) => res.render("aboutus.ejs"));
app.get("/contactus", (req, res) => res.render("contactus.ejs"));
app.get("/pricing", (req, res) => res.render("pricing.ejs"));
app.get("/services", (req, res) => res.render("services.ejs"));
app.get("/test", (req, res) => res.render("test.ejs"));

/* ======================
   NODEMAILER SETUP
====================== */
if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
  console.error("❌ Gmail credentials missing in environment variables");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Verify SMTP once at startup
transporter.verify((err) => {
  if (err) {
    console.error("❌ SMTP Error:", err);
  } else {
    console.log("✅ SMTP Server is ready to send emails");
  }
});

/* ======================
   CONTACT FORM (ALL PAGES)
====================== */
app.post("/submit-form", async (req, res) => {
  const { name, email, phone, message } = req.body;
  console.log("Form Data:", name, phone, email, message);

  try {
    await transporter.sendMail({
      from: `"FixOngo Website" <${process.env.GMAIL_USER}>`,
      to: "fixongobanglore@gmail.com",
      subject: "New Contact Form Submission",
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    req.flash("success", "Email sent successfully!");
    res.redirect("/");
  } catch (err) {
    console.error("❌ Email Error:", err);
    req.flash("error", "Failed to send email. Please try again.");
    res.redirect("/");
  }
});

/* ======================
   MAIN REPAIR FORM
====================== */
app.post("/submit-main-form", async (req, res) => {
  const { name, phone, email, device, brand, issue, model, address, faults, area } = req.body;

  console.log("Repair Request:", name, phone, email);

  try {
    await transporter.sendMail({
      from: `"FixOngo Website" <${process.env.GMAIL_USER}>`,
      to: "fixongobanglore@gmail.com",
      subject: "New Repair Request",
      html: `
        <h3>New Repair Request</h3>
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
      `,
    });

    req.flash("success", "Repair request sent successfully!");
    res.redirect("/contactus");
  } catch (err) {
    console.error("❌ Email Error:", err);
    req.flash("error", "Failed to send repair request.");
    res.redirect("/contactus");
  }
});

/* ======================
   SITEMAP
====================== */
app.get("/sitemap.xml", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "sitemap.xml"), {
    headers: { "Content-Type": "application/xml" },
  });
});

/* ======================
   ERROR HANDLER
====================== */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("error.ejs", { message: "Something went wrong" });
});

/* ======================
   SERVER
====================== */
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
