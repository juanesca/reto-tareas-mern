import React, { useState } from "react";
import axios from "axios";
import { localGet } from "../functions/localStorage";

const CTask = () => {
  const [newTask, setNewTask] = useState({
    name: "",
    img: "",
    priority: "",
    ven_date: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name: newTask.name,
      img: newTask.img,
      priority: newTask.priority,
      ven_date: newTask.ven_date,
    };

    await axios
      .post("http://localhost:5000/task/add", formData, {
        headers: { jwt_token: localGet("token") },
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const handleChange = async (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handlePhoto = async (e) => {
    setNewTask({ ...newTask, img: e.target.files[0] });
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="form-group row">
        <label htmlFor="img" className="col-sm-2 col-form-label">
          Foto
        </label>
        <div className="col-sm-10">
          <input
            type="file"
            className="form-control"
            id="img"
            accept=".png, .jpg, .jpeg"
            onChange={(e) => handlePhoto(e)}
            name="img"
          />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="email" className="col-sm-2 col-form-label">
          Email
        </label>
        <div className="col-sm-10">
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => onChange(e)}
            name="email"
          />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="email" className="col-sm-2 col-form-label">
          Email
        </label>
        <div className="col-sm-10">
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => onChange(e)}
            name="email"
          />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="email" className="col-sm-2 col-form-label">
          Email
        </label>
        <div className="col-sm-10">
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => onChange(e)}
            name="email"
          />
        </div>
      </div>
    </form>
  );
};

export default CTask;
