import React from "react";
import Expense from "./Expense";
import Signin from "./Signin";
import Signup from "./Signup";
import { useContext } from "react";
import { Store } from "./Store";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userDetails } = state;
  return (
    <Router>
      <Routes>
        {!userDetails && <Route path="/user/sign-up" element={<Signup/>}/>}
        {userDetails &&  <Route path="/" element={<Expense/>}/>}
        {!userDetails && <Route path="/" element={<Signup/>}/>}
        {userDetails && <Route path="/expense" element={<Expense/>}/>}
        {!userDetails && <Route path="/user/sign-in" element={<Signin/>}/>}
      </Routes>
    </Router>
  );
}
export default App;
