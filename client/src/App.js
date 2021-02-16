import React, {useEffect,useState, Fragment} from 'react';

import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter as Router,Route,Switch,Redirect} from 'react-router-dom';

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
            await axios.post("http://localhost:5000/auth/verify",null,{headers: { jwt_token: localGet('token')}})
            .then(async res => {
                const parseRes = await res.data;
                console.log(res);
                parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
                console.log('OK');
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
        <Fragment>
            <Router>
                <Switch>
                    <Route exact path="/login" render={props => !isAuthenticated ? (<Login {...props} setAuth={setAuth} />) : (<Redirect to="/dashboard" />)} />
                    <Route exact path="/" render={props => !isAuthenticated ? (<Signup {...props} setAuth={setAuth} />) : (<Redirect to="/dashboard" />)} />
                    <Route exact path="/dashboard" render={props => isAuthenticated ? (<Dashboard {...props} setAuth={setAuth} />) : (<Redirect to="/login" />)} />
                </Switch>
            </Router>
        </Fragment>
    )
}

export default App;
