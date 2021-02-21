import React, { useState, useEffect } from 'react';
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

  const onChange =async e => {
    await setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { email, pass, name };
      await axios.post('http://localhost:5000/auth/signup', body, { headers: { "Content-type": "application/json" } })
        .then( res => {
            const data = res.data;

          if (data.jwtToken) {
            sendEmail();
            localSave('token', data.jwtToken);
            localSave('user_id', data.user_id);
            setAuth(true);
            toast.success('Register Succesfully');
          } else {
            setAuth(false);
            toast.error(data.msg);
          }
        });
    } catch (err) {
      console.error(err.message);
    }
  };

  const sendEmail = async () => {
    try {
      await axios.post('http://localhost:5000/send',{email, subject: 'Bienvenido', name, pass});
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <Navi />
      <div className="container-fluid d-flex justify-content-center" style={{paddingTop: '10vh'}}>


      <div className="card" style={{ width: "35rem", height: "30rem" }}>
          <div className="card-header" style={{textAlign: 'center'}}>Sign Up</div>
          <form onSubmit={onSubmitForm} className="h-100" style={{paddingBottom: '0px'}}>
            <div className="card-body" style={{height: '80%'}}>
            <div className="form-group row">
          <label htmlFor="email" className="col-sm-3 col-form-label">Email</label>
          <div className="col-sm-9">
            <input 
            type="email" 
            className="form-control" 
            id="email"
            onChange={e => onChange(e)}
            name="email"
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="pass" className="col-sm-3 col-form-label">Contraseña</label>
          <div className="col-sm-9">
            <input 
            type="password" 
            className="form-control" 
            id="pass"
            name="pass"
            onChange={e => onChange(e)}
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="name" className="col-sm-3 col-form-label">Nombre</label>
          <div className="col-sm-9">
            <input 
            type="text" 
            className="form-control" 
            id="name"
            name="name"
            onChange={e => onChange(e)}
            />
          </div>
        </div>
            </div>
            <div className="card-footer" style={{marginBottom: '0px'}}>
            <button className="btn btn-primary btn-block" type="submit">Registrarme</button>
            </div>
          </form>
        </div>



      </div>
      <Foot/>
    </div>
  )
}

export default Signup
