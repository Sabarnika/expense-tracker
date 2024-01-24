import React, { useState, useEffect,useContext } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { Store } from "./Store";
function Expense() {
  const navigate=useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const { userDetails } = state;
  const [expenses, setExpenses] = useState([]);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const addOrUpdateExpense = async (e) => {
    e.preventDefault();
    if (!reason || !amount || !date) {
      console.error("Please fill in all fields");
      return;
    }
    try {
      let response;
      if (editingExpenseId) {
        // Update expense
        response = await axios.put(
          `http://localhost:5000/expense-tracker/update/${editingExpenseId}`,
          {
            reason: reason,
            amount: parseFloat(amount),
            date: new Date(date),
          }
        );
      } else {
        // Add new expense
        response = await axios.post("http://localhost:5000/expense-tracker/create", {
          reason: reason,
          amount: parseFloat(amount),
          date: new Date(date),
        });
      }

      if (response.status === 201 || response.status === 200) {
        await fetchExpenses();
        setReason("");
        setAmount("");
        setDate("");
        setEditingExpenseId(null);
      } else {
        console.error("Request Failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/expense-tracker/fetch");
      setExpenses(response.data.expenses);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/expense-tracker/delete/${id}`);
      if (response.status === 200) {
        fetchExpenses();
      } else {
        console.error("Delete Failed");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const editExpense = (id) => {
    const expenseToEdit = expenses.find((expense) => expense._id === id);
    if (expenseToEdit) {
      setReason(expenseToEdit.reason);
      setAmount(expenseToEdit.amount.toString());
      setDate(expenseToEdit.date.slice(0, 10));
      setEditingExpenseId(id);
    }
  };
  useEffect(() => {
    fetchExpenses();
  }, []);
  const logoutHandler = () => {
    navigate("/");
    localStorage.removeItem("userDetails");
    ctxDispatch({ type: "SIGN_OUT" });
    toast.success(userDetails.user.name + " signed out successfully");
  };
  return (
    <div>
      <div className="signout">
        <h1>Expense Tracker</h1>
        <button className="btn btn-primary" onClick={logoutHandler}>Log Out</button>
      </div>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label className="label">Reason</Form.Label>
          <Form.Control
            type="text"
            className="inputele"
            value={reason}
            placeholder="Reason"
            style={{ width: "500px" }}
            onChange={(e) => setReason(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="label">Amount</Form.Label>
          <Form.Control
            type="number"
            className="inputele"
            placeholder="Amount"
            value={amount}
            style={{ width: "500px" }}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="label">Date</Form.Label>
          <Form.Control
            type="date"
            className="inputele"
            style={{ width: "500px" }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Form.Group>
        <div className="d-flex justify-content-center align-items-center">
          <Button variant="primary" type="submit" onClick={addOrUpdateExpense}>
            {editingExpenseId ? "Update" : "Add"}
          </Button>
        </div>
      </Form>
      <div className="tabel">
        <h2>Expense List</h2>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Reason</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {expenses &&
              expenses.map((expense) => (
                <tr key={expense?._id}>
                  <td>{expense && expense.reason}</td>
                  <td>{expense && `$${expense.amount}`}</td>
                  <td>
                    {expense && new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td>
                    <Button
                      variant="secondary"
                      onClick={() => editExpense(expense?._id)}
                    >
                      Edit
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => deleteExpense(expense?._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Expense;
