import { Button } from "@mui/base/Button";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../../components/InputField/InputField";
import MessageContainer from "../../components/MessageContainer/MessageContainer";
import socket from "../../server";
import "./chatPageStyle.css";

const ChatPage = ({ user }) => {
  const { id } = useParams(); // 유저가 접속한 방의 id를 url에서 가져옴
  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const leaveRoom = () => {
    socket.emit("leaveRoom", user, (res) => {
      if (res.ok) navigate("/"); // 다시 채팅방 리스트 페이지로 돌아감
    });
  };

  useEffect(() => {
    socket.on("message", (res) => {
      console.log("res", res);
      setMessageList((prev) => prev.concat(res));
    });

    socket.emit("joinRoom", id, (res) => {
      if (res && res.ok) {
        console.log("successfully join", res);
      } else {
        console.log("fail to join", res);
      }
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    socket.emit("sendMessage", message, (res) => {
      if (!res.ok) {
        console.log("error message", res.error);
      }
      setMessage("");
    });
  };

  return (
    <div>
      <div className="App">
        <nav>
          <Button
            onClick={leaveRoom}
            className="back-button"
          >
            ←
          </Button>
          <div className="nav-user">{user.name}</div>
        </nav>
        <div>
          {messageList.length > 0 ? (
            <MessageContainer
              messageList={messageList}
              user={user}
            />
          ) : null}
        </div>
        <InputField
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default ChatPage;
