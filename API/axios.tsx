import axios from "axios";

// Testing
// const BASE_URL = "http://localhost:4000";
//Live
const BASE_URL = "https://us-central1-millennialsprime.cloudfunctions.net/api";

export default axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  //   back end server
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
