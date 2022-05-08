import * as react from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        backgroundColor: "black",
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="buttons"
        style={{
          display: "flex",
          flexDirection: "row",
          height: "5vh",
          justifyContent: "right",
        }}
      >
        <div style={{ marginRight: "2vw", marginTop: "2vh" }}>
          <Button
            style={{ marginRight: "2px" }}
            variant="outlined"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>
        </div>
      </div>
      <div style={{ marginLeft: "33%", marginTop: "10%" }}>
        <p style={{ fontSize: "60px", color: "white" }}>Chirpper</p>
      </div>
    </div>
  );
}

export default LandingPage;
