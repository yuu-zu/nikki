const express = require("express");
const bcrypt = require("bcrypt");

function createUserRoutes({ db }) {
  const router = express.Router();

  router.get("/me", async (req, res) => {
    try {
      const doc = await db.collection("users").doc(req.user.uid).get();
      if (!doc.exists) {
        return res.status(404).json({ message: "User not found." });
      }

      const user = doc.data();
      return res.json({
        uid: user.uid,
        username: user.username,
        email: user.email,
        displayName: user.displayName || user.username,
        birthDate: user.birthDate || "",
        gender: user.gender || "",
        personalKeyHint: user.personalKeyHint || "",
      });
    } catch (error) {
      return res.status(500).json({ message: error.message || "Unable to load profile." });
    }
  });

  router.put("/me", async (req, res) => {
    try {
      const { displayName, birthDate, email, gender, personalKey } = req.body;
      const updates = {
        updatedAt: new Date().toISOString(),
      };

      if (displayName !== undefined) updates.displayName = displayName;
      if (birthDate !== undefined) updates.birthDate = birthDate;
      if (email !== undefined) updates.email = email;
      if (gender !== undefined) updates.gender = gender;
      if (personalKey) {
        updates.personalKeyHint = `Personal key ready (${personalKey.length} chars)`;
        updates.personalKeyHash = await bcrypt.hash(personalKey, 10);
      }

      await db.collection("users").doc(req.user.uid).update(updates);
      const updatedDoc = await db.collection("users").doc(req.user.uid).get();
      const user = updatedDoc.data();

      return res.json({
        message: "Profile updated successfully.",
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
      return res.status(500).json({ message: error.message || "Unable to update profile." });
    }
  });

  return router;
}

module.exports = createUserRoutes;
