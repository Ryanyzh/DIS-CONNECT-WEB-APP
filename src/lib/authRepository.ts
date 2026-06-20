import { signInWithEmailAndPassword, signOut as firebaseSignOut, type User } from "firebase/auth";
import { auth } from "./firebase";

export class AccessDeniedError extends Error {
	constructor() {
		super("access-denied");
		this.name = "AccessDeniedError";
	}
}

export async function signInAsHr(email: string, password: string): Promise<void> {
	const credential = await signInWithEmailAndPassword(auth, email, password);
	const tokenResult = await credential.user.getIdTokenResult();
	if (tokenResult.claims["role"] !== "hr") {
		await firebaseSignOut(auth);
		throw new AccessDeniedError();
	}
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
