import React, { useState } from "react";
import axios from "axios";

import { toast } from "react-toastify";
import { localSave } from "../functions/localStorage";

import Navi from '../Components/Navbar';
import Foot from '../Components/Footer';

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
        .post("http://localhost:5000/login", body, {
          headers: { "Content-type": "application/json" },
        })
        .then((res) => {
          const parseRes = res.json();

          if (parseRes.jwtToken) {
            localSave("token", parseRes.jwtToken);
            setAuth(true);
            toast.success("Logged in Succesfully");
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
      <div className="container-fluid">
        <form onSubmit={onSubmitFrom}>
        <div className="form-group row">
          <label htmlFor="email" className="col-sm-2 col-form-label">
            Email
          </label>
          <div className="col-sm-10">
            <input 
            type="email" 
            className="form-control" 
            id="email" 
            name='email'
            value={email}
            onChange={e => onChange(e)}
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="pass" className="col-sm-2 col-form-label">
            Contraseña
          </label>
          <div className="col-sm-10">
            <input 
            type="password" 
            className="form-control" 
            id="pass"
            name="pass"
            value={pass}
            onChange={e => onChange(e)}
            />
          </div>
        </div>
        <button className='btn btn-success btn-block' >Log in</button>
      </form>
      </div>
      

      <Foot/>
    </div>
  );
};

export default Login;
