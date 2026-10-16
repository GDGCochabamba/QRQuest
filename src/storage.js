// Per-device user data in localStorage. Shape of the "users" key:
//   { [username]: { Badges: string[], Points: number, Redeemed: string[] } }
const USERS_KEY = "users";

const readUsers = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(USERS_KEY));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

const writeUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

export const userExists = (userId) => Object.hasOwn(readUsers(), userId);

export const createUser = (userId) => {
  const users = readUsers();
  users[userId] = { Badges: [], Points: 0, Redeemed: [] };
  writeUsers(users);
};

// Missing user or missing field reads as empty
const readField = (userId, field) => {
  const value = readUsers()[userId]?.[field];
  return Array.isArray(value) ? value : [];
};

// Add a value to one of the user's arrays (no duplicates)
const addToField = (userId, field, value) => {
  const users = readUsers();
  const user = users[userId] ?? { Badges: [], Points: 0, Redeemed: [] };
  const current = Array.isArray(user[field]) ? user[field] : [];
  if (!current.includes(value)) user[field] = [...current, value];
  users[userId] = user;
  writeUsers(users);
};

export const getBadges = (userId) => readField(userId, "Badges");
export const addBadge = (userId, badgeId) => addToField(userId, "Badges", badgeId);
export const getMeals = (userId) => readField(userId, "Meals");
export const addMeal = (userId, mealId) => addToField(userId, "Meals", mealId);
export const getRedeemed = (userId) => readField(userId, "Redeemed");
export const redeemReward = (userId, rewardId) => addToField(userId, "Redeemed", rewardId);
