import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ChatPage from "./pages/Chatpage/Chatpage";
import RoomListPage from "./pages/RoomListPage/RoomListPage";
import socket from "./server";

function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessageList((prev) => prev.concat(message));
    });
    socket.on("rooms", (res) => {
      setRooms(res);
    });
    askUserName();
  }, []);

  const askUserName = () => {
    const userName = prompt("당신의 이름을 입력하세요");
    console.log("uuu", userName);

    socket.emit("login", userName, (res) => {
      if (res?.ok) {
        setUser(res.data);
      }
    });
  };
  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("sendMessage", message, (res) => {
      setMessage("");
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={<RoomListPage rooms={rooms} />}
        />
        <Route
          exact
          path="/room/:id"
          element={<ChatPage user={user} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
