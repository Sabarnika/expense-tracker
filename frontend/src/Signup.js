import React, { useContext, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "./Store";
import { toast } from "react-toastify";
import { getError } from "./Util";
import Axios from "axios";
import Loading from "./Loading";
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
function Signup() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCpass] = useState("");
  const [showpass, setShowpass] = useState("");
  const validatePassword = (pass) => {
    return pass.match(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.\s).{8,15}$/
    );
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    if (pass == cpass) {
      if (validatePassword(pass)) {
        try {
          dispatch({ type: "FETCH_REQUEST" });
          const { data } = await Axios.post(
            "https://expense-tracker-back.vercel.app/user/sign-up",
            {
              name,
              email,
              password: pass,
            }
          );
          localStorage.setItem("userDetails", JSON.stringify(data));
          ctxDispatch({ type: "SIGN_UP", payload: data });
          toast.success(data.user.name + " signed up successfully");
          dispatch({ type: "FETCH_SUCCESS" });
          navigate("/");
        } catch (err) {
          dispatch({ type: "FETCH_FAILED" });
          toast.error(getError(err));
        }
      } else {
        toast.error(
          "Password should contain atleast 1 special character,1 digit ans 1 uppercase of 8-15 characters"
        );
      }
    } else {
      toast.error("Password Mismatch");
    }
  };
  return (
    <div>
      {loading && <Loading />}
      <div className="signup-container">
        <h1>Sign up</h1>
      <form onSubmit={handleSignup}>
        <div className="form-group col-sm-6">
          <label htmlFor="name">
            Name<span>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            placeholder="Enter here"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
            placeholder="Enter Password"
          />
          <p>Password should contain atleast 1 special character,1 digit ans 1 uppercase of 8-15 characters</p>
        </div>
        <div className="form-group col-sm-6">
          <label htmlFor="cpass">
            Re-enter Password<span>*</span>
          </label>
          <input
            type={showpass ? "text" : "password"}
            value={cpass}
            onChange={(e) => setCpass(e.target.value)}
            className="form-control"
            id="cpass"
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
          Register
        </button>
      </form>
      <h4>Already have an account?
      <Link to="/user/sign-in">Login</Link>
      </h4>
    </div>
    </div>
  );
}
export default Signup;
