import React from "react";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";

function Register() {
  const [data, setData] = useState({});

  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
    //console.log(data)
  };

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      //console.log("data", data);
      let { title, name, email, phone, password, street, city, pincode } = data;
      let address = { street, city, pincode };
      //console.log("add", address);

      let userData = { title, name, email, phone, password, address };
      //console.log("userData", userData);
      let response = await axios.post(
        "http://localhost:4000/register",
        userData
      );
      //console.log("response", response.data);
      if (response.status === 201) {
        toast.success(response.data.message);
        setTimeout(() => navigate("/", { replace: true }), 1500);
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="register">
      <h1>Join BookManagement </h1>
      <form onSubmit={onSubmitHandler}>
        <div>
          <input
            type="text"
            placeholder="title.."
            name="title"
            required
            onChange={onChangeHandler}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="name.."
            name="name"
            required
            onChange={onChangeHandler}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="phone .."
            name="phone"
            required
            onChange={onChangeHandler}
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="emailId .."
            name="email"
            required
            onChange={onChangeHandler}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="password .."
            name="password"
            required
            onChange={onChangeHandler}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="street  .."
            name="street"
            required
            onChange={onChangeHandler}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="city .."
            name="city"
            required
            onChange={onChangeHandler}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="pincode .."
            name="pincode"
            required
            onChange={onChangeHandler}
          />
        </div>
        <div>
          <input type="submit" />
        </div>
      </form>
      <div>
        <br></br>
        <span>Already have an account?</span>
        <NavLink to={"/login"}>Sign in</NavLink>
      </div>
    </div>
  );
}
export default Register;
