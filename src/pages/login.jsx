import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminService from "../service/admin.service";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading } = useSelector((state) => state.admin);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    AdminService.loginAdmin(dispatch, { username, password }, navigate);
  };

  return (
    <main className="form-signin w-[100%] h-[100vh] flex items-center justify-center m-auto">
      <form onSubmit={(e) => submitHandler(e)} className="w-[30%]">
        <h1 className="h3 mb-3 fw-normal">Profilga kirish</h1>

        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="floatingInput"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="name@example.com"
          />
          <label for="floatingInput">Username</label>
        </div>
        <div className="form-floating my-3">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <label for="floatingPassword">Password</label>
        </div>

        <button
          disabled={isLoading}
          className="btn btn-primary w-100 py-2"
          type="submit"
        >
          Kirish
        </button>
      </form>
    </main>
  );
};

export default Login;
