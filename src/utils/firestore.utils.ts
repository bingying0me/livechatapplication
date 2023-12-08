import { firestore } from "./firebaseConfig";
import { RoomList } from "../types/room.types";
import { ChatMessage } from "../types/chatmessage.types";
import { UserAuthType } from "../types/userAuth.types";
import { doc, collection, getDocs, addDoc, getDoc } from "firebase/firestore";

export const addRoom = async (userAuth: UserAuthType, roomData: RoomList) => {
  const user1RoomsRef = collection(firestore, `users/${userAuth.uid}/rooms`);
  const user2RoomsRef = collection(firestore, `users/${roomData.userId}/rooms`);
  const user2RoomData = {
    userId: userAuth.uid,
    name: userAuth.displayName,
    date: roomData.date,
  };
  try {
    const docRef1 = await addDoc(user1RoomsRef, roomData);
    const docRef2 = await addDoc(user2RoomsRef, user2RoomData);
    return { docRef1, docRef2 };
  } catch (error) {
    console.error("Error adding room", error);
  }
};

export const getRoomList = async (userId: string) => {
  const userRoomsRef = collection(firestore, `users/${userId}/rooms`);
  try {
    const snapshot = await getDocs(userRoomsRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching rooms", error);
  }
};

export const getRoom = async (userId: string, roomId: string) => {
  const roomRef = doc(firestore, `users/${userId}/rooms/${roomId}`);
  try {
    const snapshot = await getDoc(roomRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as RoomList;
    } else {
      console.log("No such room!");
    }
  } catch (error) {
    console.error("Error fetching room", error);
  }
};

export const getUserList = async () => {
  const userRef = collection(firestore, `users`);
  try {
    const snapshot = await getDocs(userRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching rooms", error);
  }
};

export const addRoomMessage = async (
  userAuth: UserAuthType,
  roomId: string,
  messagesData: ChatMessage
) => {
  const user1RoomMessageRef = collection(
    firestore,
    `users/${userAuth.uid}/rooms/${roomId}/messages`
  );
  const user1RoomRef = doc(firestore, `users/${userAuth.uid}/rooms/${roomId}`);
  const user1Room = await getDoc(user1RoomRef);
  const user1RoomData = user1Room.data();
  const user2Id = user1RoomData && user1RoomData.userId;
  const user2RoomRef = collection(firestore, `users/${user2Id}/rooms`);
  const user2Room = await getDocs(user2RoomRef);
  const user2RoomId = user2Room.docs.map((doc) => {
    const data = doc.data();
    if (data.userId === userAuth.uid) {
      return doc.id;
    }
  });
  const user2RoomMessageRef = collection(
    firestore,
    `users/${user2Id}/rooms/${user2RoomId}/messages`
  );
  try {
    const docRef1 = await addDoc(user1RoomMessageRef, messagesData);
    const docRef2 = await addDoc(user2RoomMessageRef, messagesData);
    return { docRef1, docRef2 };
  } catch (error) {
    console.error("Error adding room", error);
  }
};

export const getRoomMessageList = async (userId: string, roomId: string) => {
  const userRoomsMessagesRef = collection(
    firestore,
    `users/${userId}/rooms/${roomId}/messages`
  );
  try {
    const snapshot = await getDocs(userRoomsMessagesRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching messages", error);
  }
};
