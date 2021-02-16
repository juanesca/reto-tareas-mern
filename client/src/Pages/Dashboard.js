import React, { useState, useEffect } from "react";
import axios from "axios";

import { Modal, ModalBody, ModalFooter, ModalHeader }  from 'reactstrap'

import Navi from '../Components/NavbarLogged';
import Foot from '../Components/Footer'

import { localGet } from "../functions/localStorage";

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

  useEffect(() => {
    getTasks();
  }, []);

  const modalIns = () => {
    setModalInsertar(!modalInsertar);
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
      .then((res) => console.log(res))
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

  return (
    <div>
      <Navi setAuth={setAuth} />
      <div className="container-fluid">
      <br/><br/><br/>
      <button className="btn btn-succes" onClick={() =>{ setNewTask(null); setTipoModal('insertar'); modalIns()}} >Agregar tarea</button>
      <br/><br/>
      <div className="d-flex flex-wrap align-content-around justify-content-center">
        {tasks.map((task) => (
          <div key={task._id} className="col mb-4">
            <div className="card" style="width: 18rem;">
              <img src={task.img} className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">{task.name}</h5>
                <p className="card-text">{task.priority}</p>
                <p className="card-text">{task.ven_date}</p>
              </div>
              <div className="card-body">
                <button className="btn btn-primary" onClick={() => {selectTask(task); modalIns()}} >Editar</button>
                
                <button className="btn btn-danger" onClick={() => {selectTask(task); setModalEliminar(true)}} >Eliminar</button>
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
            <option value="3">Alta</option>
            <option value="2">Media</option>
            <option value="1">Baja</option>
          </select>
        </div>
      </div>
          </ModalBody>
          <ModalFooter>
            {tipoModal === 'insertar' ? 
            <button className="btn btn-success" onClick={(e) => postTask(e)} >
              OK
            </button> :
            <button className="btn btn-success" onClick={() => putTask()} >
            OK
          </button>
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
              <button className="btn btn-danger" onClick={()=> deleteTask()} >Sí</button>
              <button className="btn btn-secundary" onClick={()=> setModalEliminar(false)}>No</button>
            </ModalFooter>
          </Modal>
    </div>
    <Foot />
    </div>
    
  );
};

export default Dashboard;
