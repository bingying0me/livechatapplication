import { UserAuthType } from "../types/userAuth.types";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { firestore } from "../utils/firebaseConfig";

export const createUserProfileDocument = async (user: UserAuthType | null) => {
  if (!user) return undefined;

  const userRef = doc(firestore, `users/${user.uid}`);
  const snapShot = await getDoc(userRef);

  if (!snapShot.exists()) {
    const { displayName, email } = user;
    const createdAt = new Date();
    try {
      await setDoc(userRef, {
        displayName,
        email,
        createdAt,
      });
    } catch (error) {
      console.error("Error creating user", error);
    }
  }

  return userRef;
};