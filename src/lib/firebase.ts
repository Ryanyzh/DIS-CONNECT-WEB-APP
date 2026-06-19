import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

export const STATUS_IDS: Record<string, string> = {
	Open: "e252e869-ceff-5a1f-987f-c781100eda4c",
	"In Review": "22a6d9cf-7356-55e3-b1c7-223b34bd0225",
	"Waiting for Response": "c8b8f6f5-d021-5086-94c0-8aad835a92fe",
	Resolved: "15d186e3-c9eb-5c97-8765-1da3093041a9",
	Closed: "ece14a06-c6fd-55e6-8017-1cad1c82d0ce",
	Escalated: "52YiKzCj6wkXszMAt8xn",
};
