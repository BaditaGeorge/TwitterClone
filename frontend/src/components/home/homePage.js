import * as react from "react";
import FormBodyWrapper from "../bodyWrapper/formBodyWrapper";
import { AuthAPI } from "../../apis";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  return (
    <FormBodyWrapper>
      <h1>You are logged in!</h1>
      <button
        onClick={() => {
          AuthAPI.logoutUser().then(([status, data]) => {
            if (status === 200) {
              localStorage.removeItem("token");
              navigate("/");
            }
          });
        }}
      >
        Request
      </button>
      <button
        onClick={() => {
          AuthAPI.getUser().then(([status, data]) => {
            console.log(data);
          });
        }}
      >
        Request2
      </button>
    </FormBodyWrapper>
  );
}

export default HomePage;
