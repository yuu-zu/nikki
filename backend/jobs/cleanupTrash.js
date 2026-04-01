const dotenv = require("dotenv");
const path = require("path");
const { initializeFirebase } = require("../config/firebase");
const { isExpired } = require("../../utils/date");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function cleanupTrash() {
  const { db } = initializeFirebase();
  const snapshot = await db.collection("notes").where("isDeleted", "==", true).get();

  const tasks = [];
  snapshot.forEach((doc) => {
    const note = doc.data();
    if (isExpired(note.deletedAt, 30)) {
      tasks.push(doc.ref.delete());
    }
  });

  await Promise.all(tasks);
  console.log(`Removed ${tasks.length} expired note(s) from trash.`);
}

cleanupTrash().catch((error) => {
  console.error("Cleanup failed:", error.message);
  process.exit(1);
});
