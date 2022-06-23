import * as react from "react";
import NavBar from "../nav/navBar";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { Button, ClickAwayListener } from "@mui/material";
import { useRecoilValue } from "recoil";
import { userProfileState } from "../../state/atoms";
import io from "socket.io-client";
import { Peer } from "peerjs";

const peerOptions = {
  host: "/",
  port: "3001",
};

function startingVideoStreaming(
  setStream,
  setSocket,
  setChats,
  roomID,
  profileName = undefined
) {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      const newSocket = io("http://localhost:5050");
      const peer = new Peer(roomID, peerOptions);
      setStream(stream);
      peer.on("open", () => {
        newSocket.emit("join-room", roomID, roomID, profileName);
      });
      newSocket.on("user-connected", (id) => {
        peer.call(id, stream);
      });
      newSocket.on("on-chat-recv", (chatMsg) => {
        setChats((prevChats) => [...prevChats, chatMsg]);
      });
      setSocket(newSocket);
      newSocket.on("disconnect", () => {
        newSocket.close();
      });
    });
}

function StreamVideo({
  isNew,
  setSocket,
  roomID,
  stream,
  setStream,
  setChats,
  profile,
}) {
  return (
    <>
      <div
        style={{
          display: "flex",
          width: "60%",
          height: "100px",
          justifyContent: "center",
          marginRight: "20px",
        }}
      >
        <div style={{ width: "400px", padding: "10px" }}>
          <ReactPlayer controls url={stream} />
          {isNew && (
            <Button
              variant="outlined"
              style={{
                backgroundColor: "blue",
                color: "white",
                marginTop: "10px",
              }}
              onClick={() => {
                startingVideoStreaming(
                  setStream,
                  setSocket,
                  setChats,
                  roomID,
                  profile.name
                );
              }}
            >
              Start Stream
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

function StreamChat({ chats, setChats, socket }) {
  const profile = useRecoilValue(userProfileState);
  const [msg, setMsg] = react.useState("");
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", width: "40%" }}>
        <div
          style={{
            height: "700px",
            width: "70%",
            border: "1px solid black",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "100%",
              overflowY: "scroll",
              height: "630px",
            }}
          >
            {chats.map((chat, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid black",
                  maxWidth: "100%",
                  marginBottom: "10px",
                }}
              >
                <p style={{ fontSize: "12px", fontWeight: "bold" }}>
                  {chat.user}
                </p>
                <p>{chat.content}</p>
              </div>
            ))}
          </div>
          <textarea
            style={{
              resize: "none",
              width: "80%",
              height: "60px",
              position: "absolute",
              bottom: "0px",
            }}
            value={msg}
            onChange={(e) => {
              setMsg(e.target.value);
            }}
          ></textarea>
          <Button
            variant="outlined"
            style={{
              backgroundColor: "blue",
              color: "white",
              height: "60px",
              width: "15%",
              position: "absolute",
              right: "10px",
              bottom: "5px",
            }}
            onClick={() => {
              const chatMsg = {
                user: profile.name,
                content: msg,
              };
              setChats((prevChats) => [...prevChats, chatMsg]);
              if (socket) {
                socket.emit("on-chat-send", chatMsg);
              }
              setMsg("");
            }}
          >
            Send
          </Button>
        </div>
      </div>
    </>
  );
}

function StreamContainer() {
  const { id, isNew } = useParams();
  const [socket, setSocket] = react.useState(null);
  const profile = useRecoilValue(userProfileState);
  const [stream, setStream] = react.useState(
    "http://localhost:5050/videos/mbHRckUDpHMfapFxktECI.mp4"
  );
  react.useEffect(() => {
    if (profile.email.length > 0 && isNew === "false") {
      const newSocket = io("http://localhost:5050");
      setSocket(newSocket);
      const peer = new Peer(undefined, peerOptions);
      peer.on("open", (peerID) => {
        newSocket.emit("join-room", id, peerID, undefined);
      });
      newSocket.on("on-chat-recv", (chatMsg) => {
        setChats((prevChats) => [...prevChats, chatMsg]);
      });
      peer.on("call", (conn) => {
        conn.answer();
        conn.on("stream", (recvStream) => {
          setStream(recvStream);
        });
      });

      return () => {
        newSocket.disconnect();
        newSocket.close();
      };
    }
  }, [profile]);
  const [chats, setChats] = react.useState([]);
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <StreamVideo
          isNew={isNew === "true"}
          roomID={id}
          setSocket={setSocket}
          stream={stream}
          setStream={setStream}
          setChats={setChats}
          profile={profile}
        />
        <StreamChat chats={chats} setChats={setChats} socket={socket} />
      </div>
    </>
  );
}

export default function StreamMain() {
  return (
    <>
      <NavBar notifications={undefined} />
      <StreamContainer />
    </>
  );
}
