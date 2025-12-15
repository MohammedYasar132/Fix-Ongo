const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");
const twilio = require("twilio");

const port = process.env.PORT || 3000;

/* ======================
   TWILIO CLIENT
====================== */
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/* ======================
   SESSION & FLASH
====================== */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fixongo_secret",
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

/* ======================
   VIEW ENGINE
====================== */
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
   CONTACT / QUOTE FORM → WHATSAPP
====================== */
app.post("/submit-form", async (req, res) => {
  const { name, phone, email, message } = req.body;

  const whatsappMessage = `
📩 *New Contact / Quote Request - Fixongo*

👤 Name: ${name}
📞 Phone: ${phone}
📧 Email: ${email}
💬 Message: ${message}
  `;

  try {
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: process.env.MY_WHATSAPP_NUMBER,
      body: whatsappMessage,
    });

    req.flash("success", "Message sent successfully via WhatsApp!");
    res.redirect("/"); // redirect to homepage or desired page
  } catch (error) {
    console.error("❌ WhatsApp Error:", error);
    req.flash("error", "Failed to send WhatsApp message.");
    res.redirect("/");
  }
});

/* ======================
   MAIN REPAIR FORM → WHATSAPP
====================== */
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

  const whatsappMessage = `
📱 *New Repair Request - Fixongo*

👤 Name: ${name}
📞 Phone: ${phone}
📧 Email: ${email}
📲 Device: ${device}
🏷 Brand: ${brand}
⚠ Issue: ${issue}
📦 Model: ${model}
🏠 Address: ${address}
📍 Area: ${area}
🛠 Faults: ${faults}
  `;

  try {
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: process.env.MY_WHATSAPP_NUMBER,
      body: whatsappMessage,
    });

    req.flash(
      "success",
      "Repair request sent successfully! We will contact you shortly."
    );
    res.redirect("/contactus");
  } catch (error) {
    console.error("❌ WhatsApp Error:", error);
    req.flash("error", "Failed to send WhatsApp message.");
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
  res.status(500).render("error.ejs", {
    message: "Something went wrong",
  });
});

/* ======================
   SERVER
====================== */
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
