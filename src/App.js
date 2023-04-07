import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Create from "./Pages/Create";
import Login from "./Pages/Login";
import Protected from "./Components/Protected";
import Contact from "./Pages/Contact";
import View from "./Pages/View";
import Delete from "./Pages/Delete";
import AddReview from "./Pages/AddReview";
import GetReviews from "./Pages/GetReviews";

function App() {
  return (
    <div className="App">
      <ToastContainer position="top-center" />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Protected Component={Home} />}></Route>
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<Protected Component={Create} />} />
          <Route
            path="/create/:id"
            element={<Protected Component={Create} />}
          />
          <Route path="/view/:id" element={<Protected Component={View} />} />
          <Route
            path="/delete/:id"
            element={<Protected Component={Delete} />}
          />
          <Route
            path="/review/:id"
            element={<Protected Component={AddReview} />}
          />
          <Route
            path="/getReviews/:id"
            element={<Protected Component={GetReviews} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
