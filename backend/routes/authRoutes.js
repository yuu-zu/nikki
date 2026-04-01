const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { sendOtpEmail } = require("../../services/emailService");

function createAuthRoutes({ admin, db }) {
  const router = express.Router();

  function getBaseUrl(req) {
    return req.app?.locals?.baseUrl || process.env.APP_BASE_URL || "http://localhost:3000";
  }

  router.post("/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required." });
      }

      const existingUsername = await db.collection("users").where("username", "==", username).limit(1).get();
      const existingEmail = await db.collection("users").where("email", "==", email).limit(1).get();

      if (!existingUsername.empty || !existingEmail.empty) {
        return res.status(409).json({ message: "Username or email already exists." });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      const pendingId = uuidv4();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      await db.collection("pendingUsers").doc(pendingId).set({
        username,
        email,
        passwordHash,
        otp,
        expiresAt,
        createdAt: new Date().toISOString(),
      });

      await sendOtpEmail(email, otp, username);

      return res.json({
        message: "OTP sent to email successfully.",
        pendingId,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message || "Unable to register." });
    }
  });

  router.post("/verify-otp", async (req, res) => {
    try {
      const { pendingId, otp } = req.body;
      const doc = await db.collection("pendingUsers").doc(pendingId).get();

      if (!doc.exists) {
        return res.status(404).json({ message: "Pending registration not found." });
      }

      const pendingUser = doc.data();
      if (pendingUser.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP." });
      }

      if (new Date(pendingUser.expiresAt).getTime() < Date.now()) {
        return res.status(400).json({ message: "OTP has expired." });
      }

      const authUser = await admin.auth().createUser({
        email: pendingUser.email,
        password: `${uuidv4()}!Temp`,
        displayName: pendingUser.username,
      });

      await db.collection("users").doc(authUser.uid).set({
        uid: authUser.uid,
        username: pendingUser.username,
        email: pendingUser.email,
        passwordHash: pendingUser.passwordHash,
        displayName: pendingUser.username,
        birthDate: "",
        gender: "",
        personalKeyHint: "",
        createdAt: new Date().toISOString(),
      });

      await db.collection("pendingUsers").doc(pendingId).delete();

      return res.json({ message: "Account verified successfully. Please log in." });
    } catch (error) {
      return res.status(500).json({ message: error.message || "Unable to verify OTP." });
    }
  });

  router.post("/login", async (req, res) => {
    try {
      const { identifier, password } = req.body;
      if (!identifier || !password) {
        return res.status(400).json({ message: "Email/username and password are required." });
      }

      let snapshot = await db.collection("users").where("email", "==", identifier).limit(1).get();
      if (snapshot.empty) {
        snapshot = await db.collection("users").where("username", "==", identifier).limit(1).get();
      }

      if (snapshot.empty) {
        return res.status(401).json({ message: "Account not found." });
      }

      const userDoc = snapshot.docs[0];
      const user = userDoc.data();
      const isMatch = await bcrypt.compare(password, user.passwordHash);

      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password." });
      }

      const token = jwt.sign(
        {
          uid: user.uid,
          username: user.username,
          email: user.email,
          displayName: user.displayName || user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Login successful.",
        token,
        user: {
          uid: user.uid,
          username: user.username,
          email: user.email,
          displayName: user.displayName || user.username,
          birthDate: user.birthDate || "",
          gender: user.gender || "",
          personalKeyHint: user.personalKeyHint || "",
        },
      });
    } catch (error) {
      return res.status(500).json({ message: error.message || "Unable to login." });
    }
  });

  router.post("/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }

      const snapshot = await db.collection("users").where("email", "==", email).limit(1).get();
      if (snapshot.empty) {
        return res.status(404).json({ message: "Email does not exist." });
      }

      const link = `${getBaseUrl(req)}#login`;
      return res.json({
        message: `Password reset flow can be connected here. For now, return to ${link} and log in with your account.`,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message || "Unable to start password reset." });
    }
  });

  return router;
}

module.exports = createAuthRoutes;
