import axios from "axios";
import React, {useState,useEffect} from "react";
import {Link} from 'react-router-dom'
import { toast } from "react-toastify";
import { localGet, localRemove } from "../functions/localStorage";

const NavbarLogged = ({ setAuth }) => {
  const [name, setName] = useState("");

  const getProfile = async () => {
    try {
      await axios
        .post("http://localhost:5000/user", null, {
          headers: { jwt_token: localGet("token") },
        })
        .then(async (res) => {
          setName(res.data.name);
        });
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async (e) => {
    e.preventDefault();
    try {
      localRemove('token');
      localRemove('user_id');
      setAuth(false);
      toast.success("Logout successfully");
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3">
      <div className="container">
        <Link className="navbar-brand" to="/dashboard">
          TasksApp
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">{name}</li>
            <li className="nav-item" onClick={e => logout(e)} >Log out</li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarLogged;
