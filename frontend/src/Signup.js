import React, { useContext, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "./Store";
import Axios from "axios";
import { toast } from "react-toastify";
const ACTIONS = {
  FETCH_REQUEST: "fetch_request",
  FETCH_SUCCESS: "fetch_success",
  FETCH_FAILED: "fetch_failed",
};
const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_REQUEST:
      return { ...state, loading: true };
    case ACTIONS.FETCH_FAILED:
      return { ...state, loading: false };
    case ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false };
    default:
      return state;
  }
};
function Signup() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userDetails, search } = state;
  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });
  const [name, setName] = useState("");

  const [isPasswordShow, setPasswordShow] = useState(false);
  const [email, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const validatePassword = (password) => {
    return password.match(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
    );
  };
  const signupHandler = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      if (validatePassword(password)) {
        try {
          dispatch({ type: ACTIONS.FETCH_REQUEST });
          const { data } = await Axios.post(
            "http://localhost:5000/user/sign-up",
            {
              name,
              email,
              password,
            }
          );
          localStorage.setItem("userDetails", JSON.stringify(data));
          ctxDispatch({ type: ACTIONS.SIGN_UP, payload: data });
          toast.success(name + " signed up successfully!");
          dispatch({ type: "FETCH_SUCCESS" });
          navigate("/expense");
        } catch (err) {
          console.error(err);
          toast.error("Error signing up");
          dispatch({ type: ACTIONS.FETCH_FAILED });
        }
      } else {
        toast.error(
          "Password should contain atleast 8 - 15 characters, 1 special character, 1 digit and 1 uppercase!"
        );
      }
    } else {
      toast.error("Password mismatch!");
    }
  };
  return (
    <section>
      <div className="signin-container signup-container">
        <div className="signin-container-header">Sign Up</div>
        <form onSubmit={signupHandler} className="signin-form signup-form">
          <div className="input-fields">
            <label htmlFor="name">
              Name<span>*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              placeholder="Enter Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-fields">
            <label htmlFor="email">
              Email<span>*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              placeholder="Enter Email"
              onChange={(e) => setMail(e.target.value)}
              required
            />
          </div>
          <div className="input-fields">
            <label htmlFor="password">
              Password<span>*</span>
            </label>
            <input
              type={isPasswordShow ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Atleast 8 characters, 1 special, 1 digit, 1 uppercase"
              required
            />
          </div>
          <div className="input-fields">
            <label htmlFor="confirmPassword">
              Confirm Password<span>*</span>
            </label>
            <input
              type={isPasswordShow ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-fields">
            <input
              type="checkbox"
              id="showPassword"
              onChange={() => setPasswordShow(!isPasswordShow)}
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>
          <button type="submit" className="signin-button">
            SIGNUP
          </button>
          <h3>
            Already have an account
            <Link to="/signin">Login</Link>
          </h3>
        </form>
      </div>
    </section>
  );
}

export default Signup;
