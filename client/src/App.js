import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginSignup from "./components/LoginSignup";
import Home from "./components/Home";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginSignup />,
  },
  {
    path: "home",
    element: <Home />,
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
