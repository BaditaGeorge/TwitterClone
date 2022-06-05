import { BiImage } from "react-icons/bi";
import * as react from "react";
import { CgProfile } from "react-icons/cg";
import { GiCancel } from "react-icons/gi";
import { Button, IconButton } from "@mui/material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import VideoInput from "./videoInput";
import ImageUploading, {
  onImageRemove,
  onImageUpdate,
} from "react-images-uploading";
import Picker from "emoji-picker-react";
import FeedAPI from "../../apis/feedAPI";

const createChirp = function (data) {
  console.log(data);
  FeedAPI.createChirp(data).then(([status, data]) => {
    console.log(status);
    console.log(data);
  });
};

const readVideo = function (file) {
  if (!file) {
    return;
  }

  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.addEventListener("load", (event) => {
      resolve(event.target.result);
    });
    reader.readAsDataURL(file);
  });
};

export default function InputPost() {
  const [tweetText, setTweetText] = react.useState("");
  const [showEmojis, setShowEmojis] = react.useState(false);

  const [images, setImages] = react.useState([]);
  const onImageChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
  };
  const [source, setSource] = react.useState();
  const [file, setFile] = react.useState();

  const height = 400;
  const width = 400;
  console.log(file);

  return (
    <>
      <div className="feedPageContainer">
        <div className="tweetContainer">
          <div className="profilePicture">
            <CgProfile size={50} />
          </div>
          <div className="tweetInformations">
            <textarea
              onChange={(e) => {
                setTweetText(e.target.value);
              }}
              value={tweetText}
              className="tweetTextArea"
              placeholder="What's happening?"
            />
            <div style={{ display: "flex", flexDirection: "row" }}>
              {images.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image["data_url"]} alt="" width="100" />
                  <button
                    className="tweetButtons deleteImage"
                    onClick={() => setImages([])}
                  >
                    <GiCancel size={22} />
                  </button>
                </div>
              ))}
            </div>
            {source && (
              <video
                style={{ marginTop: "-80px" }}
                className="VideoInput_video"
                width={width}
                height={height}
                controls
                src={source}
              />
            )}
            <div style={{ display: "flex", flexDirection: "row" }}>
              <IconButton onClick={() => setShowEmojis((prev) => !prev)}>
                <EmojiEmotionsIcon />
              </IconButton>
              <div className="tweetAddButtons">
                <ImageUploading
                  multiple
                  value={images}
                  onChange={onImageChange}
                  maxNumber={4}
                  dataURLKey="data_url"
                >
                  {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                  }) => (
                    // write your building UI
                    <div className="upload__image-wrapper">
                      <button
                        className="tweetButtons"
                        style={isDragging ? { color: "red" } : undefined}
                        onClick={onImageUpload}
                        {...dragProps}
                      >
                        <BiImage size={32} />
                      </button>
                      &nbsp;
                    </div>
                  )}
                </ImageUploading>
              </div>
              <VideoInput
                width={width}
                height={height}
                setSource={setSource}
                setFile={setFile}
              />
              <Button
                variant="contained"
                onClick={() => {
                  if (!file) {
                    createChirp({
                      text: tweetText,
                      images: images,
                    });
                  } else {
                    readVideo(file).then((videoData) => {
                      createChirp({
                        text: tweetText,
                        images: images,
                        video: videoData,
                      })
                    });
                  }
                }}
              >
                Post
              </Button>
            </div>
            {showEmojis && (
              <div style={{ position: "absolute" }}>
                <Picker
                  onEmojiClick={(e, emoji) => {
                    setTweetText((prev) => prev + emoji.emoji);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
