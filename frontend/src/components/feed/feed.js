import * as react from "react";

import InputPost from "./inputPost";
import { userProfileState } from "../../state/atoms";
import { useRecoilValue } from "recoil";
import FeedCard from "./feedCard";
import FeedAPI from "../../apis/feedAPI";
import { Button, formControlClasses } from "@mui/material";

function FeedBodyLeft() {
  return <div className="feedBodyLeft"></div>;
}

function loadFeedData(setFeed, setPage, page) {
  FeedAPI.loadFeed(page).then(([status, data]) => {
    if (status >= 400 && status < 500) {
      alert(data["message"]);
    }

    if (data.length > 0) {
      setPage(page);
    }

    if (page > 0) {
      setFeed((feed) => feed.concat(data));
    } else {
      setFeed(data);
    }
  });
}

function FeedBodyCenter() {
  const images = [
    "https://playtech.ro/wp-content/uploads/2022/01/trailer-nou-the-batman-bruce-wayne-tinta-the-riddler.jpg",
    "https://playtech.ro/wp-content/uploads/2022/01/trailer-nou-the-batman-bruce-wayne-tinta-the-riddler.jpg",
    "https://playtech.ro/wp-content/uploads/2022/01/trailer-nou-the-batman-bruce-wayne-tinta-the-riddler.jpg",
    "https://playtech.ro/wp-content/uploads/2022/01/trailer-nou-the-batman-bruce-wayne-tinta-the-riddler.jpg",
  ];
  const [feed, setFeed] = react.useState([]);
  const [page, setPage] = react.useState(0);

  react.useEffect(() => {
    loadFeedData(setFeed, setPage, page);
  }, []);

  const user = useRecoilValue(userProfileState);
  const text = `Lizards are a widespread group of squamate reptiles, with over 6,000
  species, ranging across all continents except Antarctica`;
  const video = "http://localhost:5050/video1.mp4";
  return (
    <div className="feedBodyCenter">
      {/* <FeedCard images={images} owner={user} text={text} /> */}
      {/* <FeedCard video={video} owner={user} text={text} /> */}
      {/* <FeedCard owner={user} text={text} /> */}
      {feed.map((feedEntry) => (
        <FeedCard
          key={feedEntry._id}
          text={feedEntry.text}
          images={feedEntry.images}
          video={feedEntry.video}
          owner={user}
        ></FeedCard>
      ))}
      <Button
        style={{ marginTop: "25px" }}
        onClick={() => {
          loadFeedData(setFeed, setPage, page + 1);
        }}
        variant="contained"
      >
        Load More
      </Button>
    </div>
  );
}

function FeedBodyRight() {
  return <div className="feedBodyRight"></div>;
}

function FeedBody() {
  return (
    <div className="feedBody">
      <FeedBodyLeft />
      <FeedBodyCenter />
      <FeedBodyRight />
    </div>
  );
}

export default function Feed() {
  return (
    <>
      <InputPost />
      <FeedBody></FeedBody>
    </>
  );
}
