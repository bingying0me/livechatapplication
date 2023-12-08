import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getRoomMessageList, addRoomMessage } from "../utils/firestore.utils";
import { ChatMessage } from "../types/chatmessage.types";
import { useParams } from "react-router-dom";
import {
  onSnapshot,
  collection,
  query,
  orderBy,
} from 'firebase/firestore';
import { firestore } from '../utils/firebaseConfig';

const ChatRoom = () => {
  const { authUser } = useAuth();
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const { id } = useParams();

  const sendMessage = async () => {
    if (!authUser || !id || message.trim() === "") return;

    const newMessage = {
      text: message,
      sender: authUser.displayName,
      time: new Date().toLocaleString(),
    };

    const fetchedNewMessage = await addRoomMessage(authUser, id, newMessage);

    if (fetchedNewMessage) {
      setChatMessages([...chatMessages, newMessage]);
      setMessage("");
    }
  };

  useEffect(() => {
    if (!authUser || !id) return;

    const fetchMessage = async () => {
      const fetchedMessage = await getRoomMessageList(authUser.uid, id);
      if (fetchedMessage) {
        // Sort messages by time before setting the state
        const sortedMessages = fetchedMessage.sort((a, b) =>
          new Date(a.time).getTime() - new Date(b.time).getTime()
        );
        setChatMessages(sortedMessages);
      }
    };
    fetchMessage();

    if (id) {
      const messageRef = query(
        collection(firestore, `users/${authUser.uid}/rooms/${id}/messages`),
        orderBy('time', 'asc')
      );

      const unsubscribeMessages = onSnapshot(messageRef, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((messageDoc) => {
          const data = messageDoc.data() as ChatMessage;
          return {
            ...data,
            id: messageDoc.id,
          };
        });
        setChatMessages(fetchedMessages);
      });

      return () => {
        unsubscribeMessages();
      };
    }

  }, [authUser, id]);

  return (
    <div className="flex flex-col h-full text-white">
      <div className="text-3xl font-bold mb-4">Chat Room</div>

      <div className="contents overflow-y-auto p-4">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className="m-2 p-4 border-2 rounded-md inline-block"
            style={{ maxWidth: "80%" }}
          >
            <div className="font-bold">
              {msg.sender} - {msg.time}
            </div>
            <div>{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center p-4 bg-gray-300 dark:bg-gray-700">
        <input
          type="text"
          className="flex-1 p-2 border rounded-md mr-2 focus:outline-none text-black"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          className="bg-gray-900 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
          onClick={sendMessage}
        >
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white rotate-90"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 20"
          >
            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;