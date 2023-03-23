import axios from "axios";

let baseURL = "https://painting-game.onrender.com/";
// if (process.env.NODE_ENV === "production") {
//   baseURL = "https://App-name.herokuapp.com";
// } else {
//   baseURL = "http://localhost:8000";
// }

export default axios.create({
  baseURL,
});
