import * as react from "react";
import NavBar from "../nav/navBar";
import "./feedPage.css";
import { BiImage } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { GiCancel } from "react-icons/gi";
import ImageUploading, {
  onImageRemove,
  onImageUpdate,
} from "react-images-uploading";

function FeedPage() {
  const [tweetText, setTweetText] = react.useState();

  const [images, setImages] = react.useState([]);
  const onImageChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
  };

  return (
    <>
      <NavBar />
      <div className="feedPageContainer">
        <div className="tweetContainer">
          <div className="profilePicture">
            <CgProfile size={50} />
          </div>
          <div className="tweetInformations">
            <textarea
              onChange={(text) => {
                setTweetText(text);
              }}
              className="tweetTextArea"
              placeholder="What's happening?"
            />
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
            <div className="tweetAddButtons">
              <ImageUploading
                multiple
                value={images}
                onChange={onImageChange}
                maxNumber={1}
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
          </div>
        </div>
        {/* <div className="feedContainer"></div> */}
      </div>
    </>
  );
}

export default FeedPage;
