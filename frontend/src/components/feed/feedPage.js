import * as react from "react";
import NavBar from "../nav/navBar";
import "./feedPage.css";
import Feed from "./feed";
import io from "socket.io-client";
import { useRecoilValue } from "recoil";
import { userProfileState } from "../../state/atoms";

function FeedPage() {
  const [notifications, setNotifications] = react.useState([]);
  const profile = useRecoilValue(userProfileState);

  react.useEffect(() => {
    if (profile) {
      const newSocket = io("http://localhost:5050");
      newSocket.emit("postCreationBinding", { userID: profile.id });
      newSocket.on("notify", (notification) => {
        setNotifications((notifications) => {
          return [notification, ...notifications];
        });
      });
      return () => {
        newSocket.disconnect();
        newSocket.close();
      };
    }
  }, [profile]);

  return (
    <>
      <NavBar notifications={notifications} />
      <Feed />
    </>
  );
}

export default FeedPage;
