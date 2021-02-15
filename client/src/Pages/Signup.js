import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { localSave } from '../functions/localStorage';

const Signup = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: '',
    pass: '',
    name: ''
  });

  const { email, pass, name } = inputs;

  const onChange = e => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { email, pass, name };
      await axios.post('http://localhost:5000/signup', body, { headers: { "Content-type": "application/json" } })
        .then(res => {
          const parseRes = await res.json();

          if (parseRes.jwtToken) {
            localSave('token', parseRes.jwtToken);
            setAuth(true);
            toast.success('Register Succesfully');
          } else {
            setAuth(false);
            toast.error(parseRes);
          }
        });
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmitForm} >
        <div className="form-group row">
          <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input 
            type="email" 
            className="form-control" 
            id="email"
            value={email}
            onChange={e => onChange(e)}
            name="email"
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="pass" className="col-sm-2 col-form-label">Contraseña</label>
          <div className="col-sm-10">
            <input 
            type="password" 
            className="form-control" 
            id="pass"
            value={pass}
            name="pass"
            onChange={e => onChange(e)}
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="name" className="col-sm-2 col-form-label">Nombre</label>
          <div className="col-sm-10">
            <input 
            type="text" 
            className="form-control" 
            id="name"
            name="name"
            value={name}
            onChange={e => onChange(e)}
            />
          </div>
        </div>
        <button class="btn btn-primary" type="submit">Registrarme</button>
      </form>
    </div>
  )
}

export default Signup
