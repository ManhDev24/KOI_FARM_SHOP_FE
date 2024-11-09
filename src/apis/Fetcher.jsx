import axios from "axios";
import { useSelector } from "react-redux";
import { getLocalStorage } from "../utils/LocalStorage";

const user = getLocalStorage('user');
const accessToken = user ? user.accessToken : '';

const fetcher = axios.create({
  headers: {
    "Content-Type": "application/json",
    Authorization: `${accessToken}`,
  },
});

export default fetcher;
