import axios from "axios";

const fetcher = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

export default fetcher;
