import * as React from "react";
import { Button, Typography } from "@mui/material";
import "./NotificationPopup.css";

function Item() {}

export default function NotificationsPopUp({
  title = "Text",
  action = "View More",
  data = [{ img: "", title: "AA", content: "BB" }],
  isOpen = false,
  elementAaction = () => {},
}) {
  if (!isOpen) return null;

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
        backgroundColor: "white",
        zIndex: '1',
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
          {title}
        </Typography>
        <Button
          style={{ position: "absolute", right: "5px", marginTop: "3px" }}
          variant="outlined"
        >
          {action}
        </Button>
      </div>
      {data.map((el, index) => (
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
            zIndex: "2",
          }}
          onClick={elementAaction}
        >
          <img
            style={{ position: "absolute", top: "10px", left: "8px" }}
            alt=""
            src={el.img}
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
              {el.title}
            </h6>
            <p style={{ marginLeft: "15%", fontSize: "12px" }}>{el.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
