import axios from "axios";
import { useSelector } from "react-redux";
import { getLocalStorage } from "../utils/LocalStorage";


const fetcher = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

export default fetcher;
