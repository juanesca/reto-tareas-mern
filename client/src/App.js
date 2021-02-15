import React, {useEffect,useState} from 'react';

import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter,Route,Switch,Redirect, Router} from 'react-router-dom';

import { toast } from 'react-toastify';

import axios from 'axios';

import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Signup from './Pages/Signup';

import {localGet} from './functions/localStorage';

toast.configure();

function App() {
    const checkAuthenticated = async () => {
        try {
            axios.post("http://localhost:5000/auth/verify",null,{headers: { jwt_token: localGet('token')}})
            .then(res => {
                const parseRes = await res.json();

                parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
            });
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(()=>{
        checkAuthenticated();
    },[]);

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const setAuth = boolean => {
        setIsAuthenticated(boolean);
    };

    return (
        <div>
            <Router>
                <Switch>
                    <Route exact path="/login" render={props => !isAuthenticated ? (<Login {...props} setAuth={setAuth} />) : (<Redirect to="/dashboard" />)} />
                    <Route exact path="/signup" render={props => !isAuthenticated ? (<Signup {...props} setAuth={setAuth} />) : (<Redirect to="/dashboard" />)} />
                    <Route exact path="/dashboard" render={props => isAuthenticated ? (<Dashboard {...props} setAuth={setAuth} />) : (<Redirect to="/login" />)} />
                </Switch>
            </Router>
        </div>
    )
}

export default App;
