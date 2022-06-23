import { Button } from "@mui/material";
import * as react from "react";
import "../feed/feedPage.css";
import NavBar from "../nav/navBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const { v4: uuidv4 } = require("uuid");

function StreamCard({ streamer }) {
  const navigate = useNavigate();
  return (
    <>
      <div
        style={{
          width: "90%",
          height: "150px",
          display: "flex",
          flexDirection: "row",
          marginBottom: "10px",
          border: "1px solid black",
        }}
      >
        <div style={{ widht: "30%", padding: "10px" }}>
          <img
            src="http://localhost:5050/batman.jpg"
            width="120px"
            height="120px"
          />
        </div>
        <div style={{ width: "40%", marginLeft: "10px", textAlign: "center" }}>
          <p style={{ fontWeight: "bold", fontSize: "25px" }}>User</p>
          <p style={{ fontWeight: "bold", fontSize: "20px" }}>
            {streamer.name}
          </p>
        </div>
        <div
          style={{
            width: "30%",
            justifyContent: "center",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              style={{
                backgroundColor: "blue",
                color: "white",
                width: "85%",
              }}
              onClick={() => {
                navigate(`/stream/${streamer.roomID}/false`);
              }}
            >
              Start Watching
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function StreamList() {
  const navigate = useNavigate();
  const [streamList, setStreamList] = react.useState([]);

  react.useEffect(() => {
    axios
      .get("http://localhost:5050/streams", { withCredentials: true })
      .then((resp) => {
        setStreamList(resp.data);
      });
  }, []);

  return (
    <div className="feedBody">
      <div className="feedBodyLeft"></div>
      <div className="feedBodyCenter">
        <Button
          variant="outlined"
          style={{
            backgroundColor: "blue",
            color: "white",
            marginBottom: "20px",
            width: "150px",
            height: "60px",
          }}
          onClick={() => {
            const roomID = uuidv4();
            navigate(`/stream/${roomID}/${true}`);
          }}
        >
          Start Streaming
        </Button>
        {streamList.map((streamer, index) => (
          <StreamCard key={index} streamer={streamer} />
        ))}
      </div>
      <div className="feedBodyRight"></div>
    </div>
  );
}

export default function StreamPage() {
  return (
    <>
      <NavBar notifications={undefined} />
      <StreamList />
    </>
  );
}
