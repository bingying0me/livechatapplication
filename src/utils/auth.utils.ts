import { GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebaseConfig";

import { createUserProfileDocument } from "../api/user.firestore";
import { UserAuthType } from "../types/userAuth.types";

export const signInWithGoogle = async (
  setAuthUser: React.Dispatch<React.SetStateAction<UserAuthType | null>>,
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const provider = new GoogleAuthProvider();
    const { user } = await auth.signInWithPopup(provider);
    console.log(user);
    await createUserProfileDocument(user);

    setAuthUser(user);
    setIsLoggedIn(true);
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
};

export const signOut = async (
  setAuthUser: React.Dispatch<React.SetStateAction<UserAuthType | null>>,
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    await auth.signOut();

    setAuthUser(null);
    setIsLoggedIn(false);
  } catch (error) {
    console.error("Error signing out", error);
  }
};
