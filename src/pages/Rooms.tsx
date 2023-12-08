import { useEffect, useState } from "react";
import { addRoom } from "../utils/firestore.utils";
import { useAuth } from "../context/AuthContext";
import { RoomList } from "../types/room.types";
import { UserType } from "../types/user.types";
import { useNavigate } from "react-router-dom";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { firestore } from "../utils/firebaseConfig";

const Rooms = () => {
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const [roomList, setRoomList] = useState<RoomList[]>([]);
  const [userList, setUserList] = useState<UserType[]>([]);

  const addUserRoom = async (userId: string, userName: string) => {
    if (!authUser || !roomList) return;

    // Check if a room already exists for the userId
    const existingRoom = roomList.find((room) => room.userId === userId);

    if (existingRoom) {
      // If a room exists, navigate to that room
      navigate(`/chatroom/${existingRoom.id}`);
    } else {
      // Create a new room
      await addRoom(authUser, {
        userId: userId,
        name: userName,
        date: Date.now().toString(),
      });
    }
  };

  const handleAddUserRoomClick = (user: UserType) => {
    addUserRoom(user.id || '', user.displayName || '');
  };

  const handleRoomClick = (room: RoomList) => {
    navigate(`/chatroom/${room.id}`);
  };

  useEffect(() => {
    if (!authUser) return;

    const roomRef = query(
      collection(firestore, `users/${authUser.uid}/rooms`),
      orderBy("date", "asc")
    );

    const unsubscribeRoom = onSnapshot(roomRef, (snapshot) => {
      const roomData = snapshot.docs.map((roomRef) => {
        const data = roomRef.data() as RoomList;
        return {
          ...data,
          id: roomRef.id,
        };
      });
      console.log("roomData", roomData)
      setRoomList(roomData || "Unknown Room");
    });

    const userRef = query(collection(firestore, `users`));

    const unsubscribeUser = onSnapshot(userRef, (snapshot) => {
      const userData = snapshot.docs.map((userRef) => {
        const data = userRef.data() as UserType;
        if (userRef.id !== authUser.uid) {
          return {
            ...data,
            id: userRef.id,
          };
        }
      }).filter(Boolean) as UserType[];
      setUserList(userData || "Unknown User");
    });

    return () => {
      unsubscribeRoom();
      unsubscribeUser();
    };
  }, [authUser]);

  return (
    <div className="flex justify-between">
      <div className="m-5">
        <h3 className="text-3xl font-bold dark:text-white">Rooms</h3>
        <div className="flex flex-wrap">
          {roomList &&
            roomList.map((room) => (
              <div
                key={room.id}
                onClick={() => handleRoomClick(room)}
                className="flex justify-between bg-gray-900 p-5 m-2 border-2 rounded-md border-white text-white hover:bg-gray-700 cursor-pointer"
              >
                {room.name}
              </div>
            ))}
        </div>
      </div>
      <div className="m-5">
        <h3 className="text-3xl font-bold dark:text-white">Users</h3>
        {userList &&
          userList.map((user) => (
            <div
              key={user.id}
              className="p-5 border-b-2 border-white text-white hover:bg-gray-700 cursor-pointer"
              onClick={() => handleAddUserRoomClick(user)}
            >
              <div>{user.displayName}</div>
              <div>{user.email}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Rooms;
