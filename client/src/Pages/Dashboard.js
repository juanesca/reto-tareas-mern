import React, { useState, useEffect } from "react";
import axios from "axios";

import { Modal, ModalBody, ModalFooter, ModalHeader }  from 'reactstrap'

import { Link } from 'react-router-dom';

import Foot from '../Components/Footer';

import { localGet, localRemove } from "../functions/localStorage";

import { toast } from 'react-toastify';

const Dashboard = ({ setAuth }) => {
  const [tasks, setTasks] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [tipoModal, setTipoModal] = useState('');
  const [newTask, setNewTask] = useState({
    name: '',
    img: '',
    priority: '',
    ven_date: '',
    user_id: localGet('user_id')
  })
  const [userName, setUserName] = useState("");
  const [deleteTaskID, setDeleteTaskID] = useState('');
  const [editTaskID, setEditTaskID] = useState('');

  useEffect(async() => {
    await getProfile();
    getTasks();
  }, []);

  const formatVenDate= (date) => {
    const d = date.split('T');
    return d[0];
  }

  const modalIns = () => {
    setModalInsertar(!modalInsertar);
  };

  const u_name = (name) => {
    setUserName(name);
  }

  const getProfile = async () => {
    try {
      await axios
        .post("http://localhost:5000/user", { id: localGet('user_id')}, {
          headers: { jwt_token: localGet("token") },
        })
        .then(async (res) => {
          console.log(res.data[0]);
          await u_name(res.data[0].name)
        });
    } catch (err) {
      console.error(err);
    }
  };

  const getTasks = async () => {
    try {
      const user_id = localGet('user_id');
      await axios
        .post("http://localhost:5000/task", {user_id: user_id}, {
          headers: { jwt_token: localGet("token") },
        })
        .then((res) => {
          setTasks(res.data);
          console.log(userName);
        });
    } catch (err) {
      console.error(err.message);
    }
  };

  const deleteTask = async (taskID) => {
    await axios.post(`http://localhost:5000/task/delete/${taskID}`, null, {
      headers: { jwt_token: localGet("token") },
    });
    getTasks();
  };

  const handleChange = async (e) => {
    await setNewTask({ ...newTask, [e.target.name]: e.target.value });
    console.log({newTask});
  };

  const handlePhoto = async (e) => {
    await setNewTask({ ...newTask, img: e.target.files[0] });
  };

  const postTask = async (e) => {
    e.preventDefault();
    const formData = {
      name: newTask.name,
      img: newTask.img,
      priority: newTask.priority,
      ven_date: newTask.ven_date,
      user_id: localGet('user_id')
    };

    await axios
      .post("http://localhost:5000/task/add", formData, {
        headers: { jwt_token: localGet("token")},
      })
      .then((res) => {console.log(res); modalIns(); getTasks()})
      .catch((err) => console.log(err));
  };

  const putTask = async (taskID) =>{
    const formData = {
      name: newTask.name,
      img: newTask.img,
      priority: newTask.priority,
      ven_date: newTask.ven_date,
    };
    await axios.post(`http://localhost:5000/task/edit/${taskID}`, formData, {headers: {jwt_token: localGet('token')}})
    .then(res => {
      modalIns();
      getTasks();
    })
    .catch(err => {
      console.log(err.message);
    })
  };

  const selectTask = (task) => {
    setTipoModal('actualizar');
    setNewTask({
      _id: task._id,
      name: task.name,
      img: task.img,
      priority: task.priority,
      ven_date: task.ven_date
    })
  }

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

  return (
    <div>
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
          <ul className="navbar-nav ml-auto nav-pills">
            <li className="nav-item nav-white">{userName}</li>
            {'   '}
            <li className="nav-item btn btn-white" onClick={e => logout(e)} >Log out</li>
          </ul>
        </div>
      </div>
    </nav>
      <div className="container-fluid">
      <br/><br/><br/>
      <button className="btn btn-success" onClick={() =>{ setNewTask(null); setTipoModal('insertar'); modalIns()}} >Agregar tarea</button>
      <br/><br/>
      <div className="d-flex flex-wrap align-content-around justify-content-center">
        {tasks.map((task) => (
          <div key={task._id} className="col mb-4">
            <div className="card" style={{width: '18rem'}}>
              <img src={task.img} className="card-img-top" alt="..." />
              <div className="card-body">
                <div className="row">
                  <label className="col-sm-2" ></label>
                  <h5 className="card-title">{task.name}</h5>
                </div>
                <div className="row">
                <label className="col-sm-2" ></label>
                  <p className="card-text">{task.priority}</p>
                </div>
                <div className="row">
                <label className="col-sm-2" ></label>
                  <p className="card-text">{() => formatVenDate(task.ven_date)}</p>
                </div>
              </div>
              <div className="card-body">
                <button className="btn btn-primary" onClick={() => {selectTask(task); modalIns(); setEditTaskID(task._id)}} >Editar</button>
                
                <button className="btn btn-danger" onClick={() => {setDeleteTaskID(task._id); setModalEliminar(true)}} >Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalInsertar} >
          <ModalHeader style={{display: 'block'}}>
            <span style={{float: 'right'}} onClick={()=>this.modalInsertar()} >x</span>
          </ModalHeader>
          <ModalBody>
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
        <label htmlFor="name" className="col-sm-2 col-form-label">
          Titulo
        </label>
        <div className="col-sm-10">
          <input
            type="text"
            className="form-control"
            id="name"
            onChange={(e) => handleChange(e)}
            name="name"
            value={newTask?newTask.name: ''}
          />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="date" className="col-sm-2 col-form-label">
          Fecha Vencimiento
        </label>
        <div className="col-sm-10">
          <input
            type="date"
            className="form-control"
            id="date"
            onChange={(e) => handleChange(e)}
            name="ven_date"
            value={newTask?newTask.ven_date: ''}
          />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="priority" className="col-sm-2 col-form-label">
          Prioridad
        </label>
        <div className="col-sm-10">
          <select
            className="form-control"
            id="priority"
            onChange={(e) => handleChange(e)}
            name="priority"
            value={newTask?newTask.priority: ''}
          >
            <option selected>Choose...</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>
      </div>
          </ModalBody>
          <ModalFooter>
            {tipoModal === 'insertar' ? 
            (<button className="btn btn-success" onClick={(e) => postTask(e)} >
              OK
            </button>) :
            (<button className="btn btn-success" onClick={() => putTask(editTaskID)} >
            OK
          </button>)
          }
            
            <button className="btn btn-danger" onClick={() => modalIns()} >
              Cancel
            </button>
          </ModalFooter>
      </Modal>
      <Modal  isOpen={modalEliminar}>
            <ModalBody>
               Estás seguro que deseas eliminar esta tarea ?
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=> {deleteTask(deleteTaskID); setDeleteTaskID(null); setModalEliminar(false) }} >Sí</button>
              <button className="btn btn-secundary" onClick={()=> setModalEliminar(false)}>No</button>
            </ModalFooter>
          </Modal>
    </div>
    <Foot />
    </div>
    
  );
};

export default Dashboard;
