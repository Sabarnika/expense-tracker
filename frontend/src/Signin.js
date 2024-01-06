import React, { useContext, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "./Store";
import Axios from "axios";
import { toast } from "react-toastify";
import { getError } from "./Util";
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
  const [isPasswordShow, setPasswordShow] = useState(false);
  const [email, setMail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: ACTIONS.FETCH_REQUEST });
      const { data } = await Axios.get("http://localhost:5000/user/sign-in", {
        email,
        password,
      });
      localStorage.setItem("userDetails", JSON.stringify(data));
      ctxDispatch({ type: ACTIONS.SIGN_IN, payload: data });
      toast.success(data.users.name + " signed in successfully!");
      dispatch({ type: ACTIONS.FETCH_SUCCESS });
      navigate("/expense");
    } catch (err) {
      dispatch({ type: ACTIONS.FETCH_FAILED });
      toast.error(getError(err));
    }
  };
  return (
    <section>
      <div className="signin-container signup-container">
        <div className="signin-container-header">Sign In</div>
        <form onSubmit={loginHandler} className="signin-form signup-form">
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
            <input
              type="checkbox"
              id="showPassword"
              onChange={() => setPasswordShow(!isPasswordShow)}
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>
          <button type="submit" className="signin-button">
            LOGIN
          </button>
          <h3>
            Register to start
            <Link to="/sgn-up">Register</Link>
          </h3>
        </form>
      </div>
    </section>
  );
}

export default Signup;
