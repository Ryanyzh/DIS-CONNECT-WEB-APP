import {
	signInWithEmailAndPassword,
	signOut as firebaseSignOut,
	type User,
} from "firebase/auth";
import { auth } from "./firebase";

export async function signInAndGetToken(email: string, password: string): Promise<string> {
	const credential = await signInWithEmailAndPassword(auth, email, password);
	const idToken = await credential.user.getIdToken();
	return idToken;
}

export async function getIdToken(forceRefresh = false): Promise<string | null> {
	return (await auth.currentUser?.getIdToken(forceRefresh)) ?? null;
}

export async function signOut(): Promise<void> {
	return firebaseSignOut(auth);
}

export function getCurrentUser(): User | null {
	return auth.currentUser;
}
