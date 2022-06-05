import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import { IconButton } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ChatIcon from '@mui/icons-material/Chat';
import ShareIcon from "@mui/icons-material/Share";
import ReactPlayer from 'react-player';

const DEFAULT_AVATAR = 'http://localhost:5050/batman.jpg';

function CardImages({ images }) {
  const slicedImgs = images.length > 1 ? images.slice(1) : [];

  return (
    <div style={{ position: "relative" }}>
      <div>
        <CardMedia
          component="img"
          height="280"
          image={images[0]}
          alt="img"
        />
      </div>
      {slicedImgs.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            position: "absolute",
            right: "0px",
            bottom: "0px",
            border: "1px solid black",
            backgroundColor: "white",
          }}
        >
          {slicedImgs.map((img, index) => (
            <CardMedia
              key={index}
              sx={{ margin: "5px" }}
              component="img"
              height="60"
              image={img}
              alt="img"
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CardVideo({ video }) {
  return (
    <div style={{ maxWidth: "300px" }}>
      <ReactPlayer controls url={video} />
    </div>
  )
}

function Header({ user }) {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ width: "40px", margin: "5px" }}>
        <CardMedia
          component="img"
          height="40"
          image={user.img ? user.img : DEFAULT_AVATAR}
          alt="green iguana"
        />
      </div>
      <div style={{ marginTop: "5px" }}>
        <Typography gutterBottom variant="h5" component="div">
          {user.name}
        </Typography>
      </div>
    </div>
  );
}

export default function FeedCard({ images, video, text, owner }) {
  return (
    <Card sx={{ maxWidth: 650, minWidth: 650, marginTop: '10px' }}>
      <Header user={owner} />
      {images.length > 0 && <CardImages images={images} />}
      {video && <CardVideo video={video} /> }
      <CardContent>
        <Typography variant="h6" color="text.secondary">
          {text}
        </Typography>
      </CardContent>
      <CardActions style={{ marginTop: "-20px" }}>
        <IconButton>
          <ThumbUpAltIcon color="primary" />
        </IconButton>
        <IconButton>
          <ShareIcon color="primary" />
        </IconButton>
        <IconButton>
          <ChatIcon color="primary" />
        </IconButton>
      </CardActions>
    </Card>
  );
}