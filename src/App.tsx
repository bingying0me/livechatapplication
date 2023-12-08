import { BrowserRouter, Routes, Route } from "react-router-dom";
import Rooms from "./pages/Rooms.tsx";
import ChatRoom from "./pages/ChatRoom.tsx";
import NavBarComponent from "./components/NavBarComponent.tsx";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<NavBarComponent />}>
            <Route index element={<Rooms />} />
            <Route path="chatroom/:id" element={<ChatRoom />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
