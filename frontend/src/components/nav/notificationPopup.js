import * as React from "react";
import { Button, Typography } from "@mui/material";
import "./NotificationPopup.css";

function Item() {}

export default function NotificationsPopUp() {
  let arr = [];
  for (let i = 0; i < 10; i++) {
    arr.push(`SO much more text thatn something else TextWoWo${i}`);
  }
  return (
    <div
      id="cont"
      style={{
        border: "1px solid black",
        height: "85vh",
        minHeight: "120px",
        width: "380px",
        position: "absolute",
        right: "10px",
        borderRadius: "1%",
        overflowY: "scroll",
        scrollbarWidth: "none",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "48px",
          backgroundColor: "grey",
          position: "relative",
          display: "flex",
          direction: "row",
        }}
      >
        <Typography
          style={{ marginLeft: "5px", marginTop: "5px" }}
          variant="h6"
        >
          Text
        </Typography>
        <Button
          style={{ position: "absolute", right: "5px", marginTop: "3px" }}
          variant="outlined"
        >
          Disabled
        </Button>
      </div>
      {arr.map((el, index) => (
        <div
          className="item"
          key={index}
          style={{
            width: "100%",
            height: "60px",
            marginTop: "-15px",
            borderBottom: "1px solid black",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <img
            style={{ position: "absolute", top:"10px", left:"8px" }}
            alt="notification"
            src="https://play-lh.googleusercontent.com/x3XxTcEYG6hYRZwnWAUfMavRfNNBl8OZweUgZDf2jUJ3qjg2p91Y8MudeXumaQLily0"
            width="35px"
            height="35px"
          />
          <div>
            <h6
              style={{
                marginBottom: "-4px",
                marginTop: "20px",
                marginLeft: "15%",
                fontSize: "12px",
              }}
            >
              Titlu
            </h6>
            <p style={{ marginLeft: "15%", fontSize: "12px" }}>{el}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
