import axios from "axios";

let baseURL = "https://13-233-198-227.nip.io:5443/";
// if (process.env.NODE_ENV === "production") {
//   baseURL = "https://App-name.herokuapp.com";
// } else {
//   baseURL = "http://localhost:8000";
// }

export default axios.create({
  baseURL,
});
