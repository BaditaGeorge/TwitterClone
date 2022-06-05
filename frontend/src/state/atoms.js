import { atom } from "recoil";

export const userProfileState = atom({
  key: "userProfile",
  default: {
    name: "",
    email: "",
  },
});
