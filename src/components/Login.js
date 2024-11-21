import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/login', { username, password })
            .then(res => {
                if (res.data && res.data.role) {
                    console.log("Login successful", res.data);
                        if (res.data.role === 'admin') {
                        navigate("/admin-dashboard");
                    } else if (res.data.role === 'employee') {
                        navigate("/TimesheetTable", { state: { employeeId: res.data.employeeId } });
                    }
                } else {
                    alert("Invalid login! Please try again.");
                }
            })
            .catch(err => {
                console.error("Login error: ", err);
                    alert("Login failed. Username or Password is incorrect.");
            });
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: 'linear-gradient(to bottom right, #3F51B5, #BBDEFB)' }}>
            <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center">User Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Username" 
                            onChange={e => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Password" 
                            onChange={e => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                    <p className="text-center mt-3">Not a Member? <a href="/signup" className="text-primary">Sign up</a></p>
                </form>
            </div>
        </div>
    );
};

export default Login;
