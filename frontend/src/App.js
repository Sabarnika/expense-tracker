import React, { useContext, useReducer, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Store, reducer } from "./Store";
import Signup from "./Signup";
import Expense from "./Expense";
import Signin from "./Signin";

function App() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userDetails } = state;
  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });

  useEffect(() => {
    if (!userDetails) {
      navigate("/");
    }
  }, [userDetails, navigate]);

  return (
    // <div>
    //   <Routes>
    //     <Route path="/" element={<Signup />} />
    //     {userDetails && <Route path="/expense" element={<Expense />} />}
    //   </Routes>
    //   {userDetails === null && window.location.pathname === "/expense" && (
    //     <Link to="/">Click here to login and continue</Link>
    //   )}
    // </div>
    //<Signin />
    <Signup />
  );
}

export default App;
