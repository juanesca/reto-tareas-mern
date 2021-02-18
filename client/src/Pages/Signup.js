import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { localSave } from '../functions/localStorage';

import Navi from '../Components/Navbar';
import Foot from '../Components/Footer';

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
      await axios.post('http://localhost:5000/auth/signup', body, { headers: { "Content-type": "application/json" } })
        .then(async res => {
          const parseRes = await res.data;

          if (parseRes.jwtToken) {
            sendEmail();
            localSave('token', parseRes.jwtToken);
            localSave('user_id', parseRes.user_id);
            setAuth(true);
            toast.success('Register Succesfully');
          } else {
            setAuth(false);
            toast.error(parseRes.msg);
          }
        });
    } catch (err) {
      console.error(err.message);
    }
  };

  const sendEmail = async () => {
    try {
      await axios.post('http://localhost:5000/send',{email, subject: 'Bienvenido', name});
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <Navi />
      <div className="container-fluid" >
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
        <button className="btn btn-primary" type="submit">Registrarme</button>
      </form>
      </div>
      
      <Foot/>
    </div>
  )
}

export default Signup
