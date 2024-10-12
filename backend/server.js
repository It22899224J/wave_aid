// server.js
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const bodyParser = require("body-parser");

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");

exports.admin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Reference to Firestore
exports.db = admin.firestore();
const adminUserRouter = require("./routes/adminUserRoutes");
app.use("/adminUser", adminUserRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});