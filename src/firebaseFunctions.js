import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";


// Add a badge to a user's Badges array (no duplicates)
export const addBadge = async (userId, badge) => {
  const userRef = doc(db, "Users", userId);
  await updateDoc(userRef, {
    Badges: arrayUnion(badge),
  });
};

// Remove a badge from a user's Badges array
export const removeBadge = async (userId, badge) => {
  const userRef = doc(db, "Users", userId);
  await updateDoc(userRef, {
    Badges: arrayRemove(badge),
  });
};

export const getBadges = async (userId) => {
  const snap = await getDoc(doc(db, "Users", userId));
  return snap.data()?.Badges ?? [];
};