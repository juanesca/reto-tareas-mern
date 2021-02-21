import React, { useState } from "react";
import axios from "axios";

import { toast } from "react-toastify";
import { localSave } from "../functions/localStorage";

import Navi from "../Components/Navbar";
import Foot from "../Components/Footer";
import { Redirect } from "react-router-dom";

const Login = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    pass: "",
  });

  const { email, pass } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitFrom = async (e) => {
    e.preventDefault();
    try {
      const body = { email, pass };
      await axios
        .post("http://localhost:5000/auth/login", body, {
          headers: { "Content-type": "application/json" },
        })
        .then((res) => {
          const parseRes = res.data;

          if (parseRes.jwtToken) {
            localSave("token", parseRes.jwtToken);
            localSave("user_id", parseRes.user_id);
            setAuth(true);
            toast.success("Logged in Succesfully");
            <Redirect to="/dashboard" />;
          } else {
            setAuth(false);
            toast.error(parseRes);
          }
        });
    } catch (err) {
      console.error(err.message);
    }
  };
  return (
    <div>
      <Navi />
      <div className="container-fluid d-flex justify-content-center" style={{paddingTop: '10vh'}}>
        <div className="card" style={{ width: "35rem", height: "30rem" }}>
          <div className="card-header" style={{textAlign: 'center'}}>Log In</div>
          <form onSubmit={onSubmitFrom} className="h-100" style={{paddingBottom: '0px'}}>
            <div className="card-body" style={{height: '80%'}}>
              <div className="form-group row">
                <label htmlFor="email" className="col-sm-3 col-form-label">
                  Email
                </label>
                <div className="col-sm-9">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => onChange(e)}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="pass" className="col-sm-3 col-form-label">
                  Contraseña
                </label>
                <div className="col-sm-9">
                  <input
                    type="password"
                    className="form-control"
                    id="pass"
                    name="pass"
                    value={pass}
                    onChange={(e) => onChange(e)}
                  />
                </div>
              </div>
            </div>
            <div className="card-footer" style={{marginBottom: '0px'}}>
              <button className="btn btn-success btn-block">OK</button>
            </div>
          </form>
        </div>
      </div>

      <Foot />
    </div>
  );
};

export default Login;
