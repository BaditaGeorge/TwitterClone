import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { TextField, CardActions, Button } from "@mui/material";
import Badge from "@mui/material/Badge";
import { IconButton } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ChatIcon from "@mui/icons-material/Chat";
import ShareIcon from "@mui/icons-material/Share";
import ReactPlayer from "react-player";
import { userProfileState } from "../../state/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FeedAPI from "../../apis/feedAPI";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const DEFAULT_AVATAR = "http://localhost:5050/batman.jpg";

function CardImages({ images }) {
  const slicedImgs = images.length > 1 ? images.slice(1) : [];

  return (
    <div style={{ position: "relative" }}>
      <div>
        <CardMedia component="img" height="280" image={images[0]} alt="img" />
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
  );
}

function DeleteAlertDialog({ open, setOpen }) {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this post? This can't be undone!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setOpen(false)}
          style={{ backgroundColor: "red" }}
          variant="contained"
        >
          Yes
        </Button>
        <Button
          onClick={() => setOpen(false)}
          style={{ backgroundColor: "blue" }}
          variant="contained"
          autoFocus
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function EditModalDialog({
  open,
  setOpen,
  owner,
  userID,
  comments,
  setComments,
  post,
  images = null,
  text = null,
  video = null,
}) {
  const [postImages, setPostImages] = React.useState(images);
  const [postText, setPostText] = React.useState(text);
  const [postVideo, setPostVideo] = React.useState(video);
  return (
    <Dialog
      maxWidth="xl"
      open={open}
      onClose={() => {
        setPostImages(images);
        setPostText(text);
        setPostVideo(video);
        setOpen(false);
      }}
    >
      <DialogActions>
        <Button
          onClick={() => {
            setPostImages(images);
            setPostText(text);
            setPostVideo(video);
            setOpen(false);
          }}
          style={{ backgroundColor: "blue" }}
          variant="contained"
          autoFocus
        >
          Close
        </Button>
        <Button
          onClick={() => {
            FeedAPI.updateChirp(post, {
              images: postImages,
              text: postText,
              vidoe: postVideo,
            }).then(([status, data]) => {
              window.location.reload();
            });
          }}
          variant="contained"
          autoFocus
        >
          Save
        </Button>
      </DialogActions>
      <DialogContent
        style={{ display: "flex", flexDirection: "row", overflow: "hidden" }}
      >
        <div style={{ width: "60vw", height: "70vh" }}>
          <textarea
            style={{ resize: "none", width: "100%" }}
            defaultValue={postText}
            onChange={(e) => setPostText(e.target.value)}
          ></textarea>
          {(postImages.length > 0 || video) && (
            <div className="slide-container">
              <Slide>
                {postImages.map((image, index) => (
                  <div className="each-slide" key={index}>
                    <div
                      style={{
                        backgroundImage: `url(${image})`,
                        height: "60vh",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                      }}
                    >
                      <Button
                        variant="contained"
                        style={{ backgroundColor: "red", margin: "10px" }}
                        onClick={() => {
                          setPostImages(
                            postImages
                              .filter((postImage) => postImage !== image)
                              .map((postImage) => postImage)
                          );
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
                {postVideo && (
                  <div>
                    <div className="video">
                      <Button
                        variant="contained"
                        style={{ backgroundColor: "red", margin: "10px" }}
                        onClick={() => {
                          setPostVideo(null);
                        }}
                      >
                        Delete
                      </Button>
                      <CardVideo video={postVideo} />
                    </div>
                  </div>
                )}
              </Slide>
            </div>
          )}
        </div>
        <div
          style={{
            width: "30vw",
            height: "70vh",
            marginLeft: "20px",
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          <Header owner={owner} userID={userID} />
          <CommentSection
            comments={comments}
            setComments={setComments}
            post={post}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ContextMenu({
  owner,
  userID,
  comments,
  setComments,
  post,
  images = null,
  text = null,
  video = null,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);

  return (
    <>
      <div style={{ position: "absolute", right: "0px" }}>
        <IconButton
          id="demo-positioned-button"
          aria-controls={open ? "demo-positioned-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <MenuItem
            onClick={() => {
              FeedAPI.removeChirp(post).then(([status, data]) => {
                window.location.reload();
              });
            }}
          >
            Delete
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpenEditModal(true);
              handleClose();
            }}
          >
            Edit
          </MenuItem>
        </Menu>
      </div>
      <EditModalDialog
        open={openEditModal}
        setOpen={setOpenEditModal}
        owner={owner}
        userID={userID}
        comments={comments}
        setComments={setComments}
        post={post}
        images={images}
        text={text}
        video={video}
      />
      <DeleteAlertDialog open={openDeleteModal} setOpen={setOpenDeleteModal} />
    </>
  );
}

function Header({
  owner,
  userID,
  comments = null,
  setComments = null,
  post = null,
  images = null,
  video = null,
  postLikes = null,
  setPostLikes = null,
  text = null,
}) {
  const [profile, setProfile] = useRecoilState(userProfileState);
  const { followees } = profile;
  const isOwnerFollow = followees.includes(owner._id);

  const handleFollow = () => {
    if (!isOwnerFollow) {
      FeedAPI.createFollow(owner._id).then(([status, data]) => {
        setProfile((profile) => ({
          ...profile,
          followees: [...followees, owner._id],
        }));
      });
    } else {
      FeedAPI.removeFollow(owner._id).then(([status, data]) => {
        setProfile((profile) => ({
          ...profile,
          followees: followees
            .filter((followee) => followee !== owner._id)
            .map((followee) => followee),
        }));
      });
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "row", position: "relative" }}
    >
      <div style={{ width: "40px", margin: "5px" }}>
        <CardMedia
          component="img"
          height="40"
          image={owner.avatar ? owner.avatar : ""}
          alt="green iguana"
        />
      </div>
      <div style={{ marginTop: "5px" }}>
        <Typography gutterBottom variant="h5" component="div">
          {owner.name}
        </Typography>
      </div>
      {owner._id !== userID && owner._id && userID && (
        <Button
          style={{
            height: "4vh",
            marginTop: "1vh",
            marginLeft: "2vh",
            backgroundColor: isOwnerFollow ? "red" : "blue",
          }}
          variant="contained"
          onClick={handleFollow}
        >
          {isOwnerFollow ? `Unfollow` : `Follow`}
        </Button>
      )}
      {owner._id === userID && post && (
        <ContextMenu
          owner={owner}
          userID={userID}
          comments={comments}
          setComments={setComments}
          video={video}
          post={post}
          images={images}
          text={text}
        />
      )}
    </div>
  );
}

function PostComment({ comment }) {
  return (
    <div
      style={{
        border: "1px solid black",
        width: "fit-content",
        backgroundColor: "gray",
        marginRight: "5px",
        marginTop: "5px",
        marginBottom: "5px",
      }}
    >
      <div
        style={{
          marginTop: "2px",
          marginLeft: "2px",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <img src={comment.userAvatar} width="25px" height="25px" />
        <p style={{ fontSize: "15px", marginTop: "0px", marginBottom: "0px" }}>
          {comment.userName}
        </p>
      </div>
      <p>{comment.text}</p>
    </div>
  );
}

function PostComments({ comments }) {
  return (
    <div style={{ width: "30vw" }}>
      {comments.map((comment) => (
        <PostComment key={comment._id} comment={comment} />
      ))}
    </div>
  );
}

function InputComment({ post, setComments }) {
  const user = useRecoilValue(userProfileState);
  const [comment, setComment] = React.useState("");

  const handleCommentPOST = () => {
    FeedAPI.commentChirp(post, comment, user.name, user.avatar).then(
      ([status, data]) => {
        setComments((prevComments) => [...prevComments, data]);
        setComment("");
      }
    );
  };

  return (
    <div
      style={{
        width: "500px",
        height: "30px",
        marginBottom: "10px",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <textarea
        onChange={(e) => setComment(e.target.value)}
        value={comment}
        type="text"
        style={{
          height: "100%",
          width: "60%",
          resize: "none",
          fontSize: "20px",
        }}
      />
      <Button
        style={{ marginTop: "5px" }}
        onClick={handleCommentPOST}
        color="primary"
        variant="outlined"
      >
        Post
      </Button>
    </div>
  );
}

function CommentSection({ comments, setComments, post }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <InputComment post={post} setComments={setComments} />
      <PostComments comments={comments} />
    </div>
  );
}

export default function FeedCard({
  chirpID,
  images,
  video,
  text,
  owner,
  likes,
  comments,
  isLiked,
}) {
  const [showCommSection, setShowCommSection] = React.useState(false);
  const [postComments, setPostComments] = React.useState(comments);
  const [postLikes, setPostLikes] = React.useState(likes);
  const [isPostLiked, setIsPostLiked] = React.useState(isLiked);
  const profile = useRecoilValue(userProfileState);

  const handleLike = () => {
    if (isPostLiked) {
      FeedAPI.removeLike(chirpID).then(([status, data]) => {
        setIsPostLiked(false);
        setPostLikes(postLikes.filter((like) => like._id !== data._id));
      });
    } else {
      FeedAPI.likeChirp(chirpID).then(([status, data]) => {
        setIsPostLiked(true);
        setPostLikes([...postLikes, data]);
      });
    }
  };

  const displayComments = () => {
    setShowCommSection(!showCommSection);
  };

  return (
    <Card sx={{ maxWidth: 650, minWidth: 650, marginTop: "10px" }}>
      <Header
        owner={owner}
        userID={profile.id}
        comments={postComments}
        setComments={setPostComments}
        video={video}
        images={images}
        postLikes={postLikes}
        setPostLikes={setPostLikes}
        post={chirpID}
        text={text}
      />
      {images.length > 0 && <CardImages images={images} />}
      {video && <CardVideo video={video} />}
      <CardContent>
        <Typography variant="h6" color="text.secondary">
          {text}
        </Typography>
      </CardContent>
      <CardActions style={{ marginTop: "-20px" }}>
        <IconButton onClick={handleLike}>
          <Badge badgeContent={postLikes.length} color="error">
            <ThumbUpAltIcon color={isPostLiked ? "primary" : ""} />
          </Badge>
        </IconButton>
        <IconButton>
          <ShareIcon color="primary" />
        </IconButton>
        <IconButton onClick={displayComments}>
          <Badge badgeContent={postComments.length} color="error">
            <ChatIcon color="primary" />
          </Badge>
        </IconButton>
      </CardActions>
      {showCommSection && (
        <CardActions>
          <CommentSection
            comments={postComments}
            setComments={setPostComments}
            post={chirpID}
          />
        </CardActions>
      )}
    </Card>
  );
}
