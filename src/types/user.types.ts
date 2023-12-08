import firebase from "firebase/compat/app";

export type UserType = {
  id: string;
  displayName: string;
  email: string;
  // createdAt: firebase.firestore.Timestamp;
};
