const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { encryptDiaryContent } = require("../../services/encryptionService");
const { isExpired } = require("../../utils/date");

function createNotesRoutes({ db }) {
  const router = express.Router();

  function getBaseUrl(req) {
    return req.app?.locals?.baseUrl || process.env.APP_BASE_URL || "http://localhost:3000";
  }

  async function cleanupExpiredTrash() {
    const snapshot = await db.collection("notes").where("isDeleted", "==", true).get();
    const tasks = [];

    snapshot.forEach((doc) => {
      if (isExpired(doc.data().deletedAt, 30)) {
        tasks.push(doc.ref.delete());
      }
    });

    await Promise.all(tasks);
  }

  router.get("/", async (req, res) => {
    try {
      await cleanupExpiredTrash();
      const query = (req.query.q || "").toLowerCase();
      const includeTrash = String(req.query.includeTrash || "false") === "true";
      const snapshot = await db.collection("notes").where("ownerId", "==", req.user.uid).get();
      const notes = [];

      snapshot.forEach((doc) => {
        const note = doc.data();
        const matches = !query || note.title.toLowerCase().includes(query);
        const visibilityMatch = includeTrash ? note.isDeleted : !note.isDeleted;

        if (matches && visibilityMatch) {
          notes.push({ id: doc.id, ...note });
        }
      });

      notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      return res.json(notes);
    } catch (error) {
      return res.status(500).json({ message: error.message || "Unable to load notes." });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const { title, content, encryptionKey } = req.body;
      if (!title || !content || !encryptionKey) {
        return res.status(400).json({ message: "Title, content, and encryption key are required." });
      }

      const id = uuidv4();
      const encryptedContent = encryptDiaryContent(content, encryptionKey);
      const now = new Date().toISOString();
      const note = {
        id,
        ownerId: req.user.uid,
        title,
        encryptedContent,
        isDeleted: false,
        deletedAt: "",
        shareToken: "",
        sharedTestKey: "",
        createdAt: now,
        updatedAt: now,
      };

      await db.collection("notes").doc(id).set(note);
      return res.status(201).json(note);
    } catch (error) {
      return res.status(500).json({ message: error.message || "Unable to create note." });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const { title, content, encryptionKey } = req.body;
      const noteRef = db.collection("notes").doc(req.params.id);
      const doc = await noteRef.get();

      if (!doc.exists) return res.status(404).json({ message: "Note not found." });
      const note = doc.data();
      if (note.ownerId !== req.user.uid) {
        return res.status(403).json({ message: "You do not have permission to edit this note." });
      }

      const updates = { updatedAt: new Date().toISOString() };
      if (title) updates.title = title;
      if (content && encryptionKey) updates.encryptedContent = encryptDiaryContent(content, encryptionKey);

      await noteRef.update(updates);
      const updatedDoc = await noteRef.get();
      return res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (error) {
      return res.status(500).json({ message: error.message || "Unable to update note." });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const noteRef = db.collection("notes").doc(req.params.id);
      const doc = await noteRef.get();

      if (!doc.exists) return res.status(404).json({ message: "Note not found." });
      const note = doc.data();
      if (note.ownerId !== req.user.uid) {
        return res.status(403).json({ message: "You do not have permission to delete this note." });
      }

      await noteRef.update({
        isDeleted: true,
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return res.json({ message: "Note moved to trash successfully." });
    } catch (error) {
      return res.status(500).json({ message: error.message || "Unable to delete note." });
    }
  });

  router.post("/:id/restore", async (req, res) => {
    try {
      const noteRef = db.collection("notes").doc(req.params.id);
      const doc = await noteRef.get();

      if (!doc.exists) return res.status(404).json({ message: "Note not found." });
      const note = doc.data();
      if (note.ownerId !== req.user.uid) {
        return res.status(403).json({ message: "You do not have permission to restore this note." });
      }

      await noteRef.update({
        isDeleted: false,
        deletedAt: "",
        updatedAt: new Date().toISOString(),
      });

      const restoredDoc = await noteRef.get();
      return res.json({ id: restoredDoc.id, ...restoredDoc.data() });
    } catch (error) {
      return res.status(500).json({ message: error.message || "Unable to restore note." });
    }
  });

  router.post("/:id/share", async (req, res) => {
    try {
      const noteRef = db.collection("notes").doc(req.params.id);
      const doc = await noteRef.get();

      if (!doc.exists) return res.status(404).json({ message: "Note not found." });
      const note = doc.data();
      if (note.ownerId !== req.user.uid) {
        return res.status(403).json({ message: "You do not have permission to share this note." });
      }

      const shareToken = uuidv4();
      const sharedTestKey = req.body.sharedTestKey || "";

      await noteRef.update({
        shareToken,
        sharedTestKey,
        updatedAt: new Date().toISOString(),
      });

      return res.json({
        shareLink: `${getBaseUrl(req)}#share/${shareToken}`,
        encryptedContent: note.encryptedContent,
        testKey: sharedTestKey,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message || "Unable to share note." });
    }
  });

  return router;
}

function createSharedNotesRoutes({ db }) {
  const router = express.Router();

  router.get("/:shareToken", async (req, res) => {
    try {
      const snapshot = await db.collection("notes").where("shareToken", "==", req.params.shareToken).limit(1).get();
      if (snapshot.empty) {
        return res.status(404).json({ message: "Shared note not found." });
      }

      const note = snapshot.docs[0].data();
      return res.json({
        title: note.title,
        encryptedContent: note.encryptedContent,
        sharedTestKey: note.sharedTestKey || "",
      });
    } catch (error) {
      return res.status(500).json({ message: error.message || "Unable to load shared note." });
    }
  });

  return router;
}

module.exports = {
  createNotesRoutes,
  createSharedNotesRoutes,
};
