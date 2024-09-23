import axios from "axios";
import { useSelector } from "react-redux";
import { getLocalStorage } from "../utils/LocalStorage";

const token = getLocalStorage("otp");
const data = getLocalStorage("user");

const fetcher = axios.create({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

export default fetcher;
