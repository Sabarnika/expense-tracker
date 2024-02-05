import React, { useContext, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "./Store";
import { toast } from "react-toastify";
import { getError } from "./Util";
import Axios from "axios";
import Loading from "./Loading";
import './Login.css'
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAILED":
      return { ...state, loading: false };
    default:
      return state;
  }
};
function Signin() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showpass, setShowpass] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const { data } = await Axios.post("https://expense-tracker-back.vercel.app/user/sign-in", {
        email,
        password: pass,
      }); 
      localStorage.setItem("userDetails", JSON.stringify(data));
      ctxDispatch({ type: "SIGN_IN", payload: data });
      toast.success(data.user.name + " signed up successfully");
      dispatch({ type: "FETCH_SUCCESS" });
      navigate("/expense");
    } catch (err) {
      dispatch({ type: "FETCH_FAILED" });
      toast.error(getError(err));
    }
  };
  return (
    <div>
      {loading && <Loading />}
      <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group col-sm-6">
          <label htmlFor="email">
            Email<span>*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            id="email"
            placeholder="Enter here"
          />
        </div>
        <div className="form-group col-sm-6">
          <label htmlFor="pass">
            Password<span>*</span>
          </label>
          <input
            type={showpass ? "text" : "password"}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="form-control"
            id="pass"
            placeholder="Enter here"
          />
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            onChange={() => setShowpass(!showpass)}
            id="exampleCheck1"
          />
          <label className="form-check-label" htmlFor="exampleCheck1">
            Show Password
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
      <h4>Don't you have account?</h4>
      <Link to="/user/sign-up">Register</Link>
    </div>
</div>
  );
}
export default Signin;
