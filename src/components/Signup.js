import React, { useState } from 'react';
import axios from'axios';
import { useNavigate } from 'react-router-dom';
const Signup = () => {
    const [user, setUser] = useState({
        username:'',
        password:'',
        department:'',
        role:''

})
    const navigate =useNavigate();
    const submitUser =(e)=>{
        e.preventDefault();
        axios.post('http://localhost:5000/user',user)
        .then(res=>{console.log(res);
            navigate('/')
        })
        .catch(err=>console.log(err))}
    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: 'linear-gradient(to bottom right, #3F51B5, #BBDEFB)' }}>
            <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <form onSubmit={submitUser}>
                    <div className="mb-3">
                        <input type="text" name="username" onChange={e=>setUser({...user,username:e.target.value})} className="form-control" placeholder="Full Name" required />
                    </div>
                    <div className="mb-3">
                        <input type="password" name="password" onChange={e=>setUser({...user,password:e.target.value})} className="form-control" placeholder="password" required />
                    </div>
                    <div className="mb-3">
                        <input type="text"  name="Department" onChange={e=>setUser({...user,department:e.target.value})} className="form-control" placeholder="Department" required />
                    </div>
                    <div className="mb-3">
                        <input type="text" name="role" onChange={e=>setUser({...user,role:e.target.value})} className="form-control" placeholder="role" required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Submit</button>
                    <p className="text-center mt-3"><a href="/" className="text-primary">Log in</a></p>
                </form>
            </div>
        </div>
    );
};

export default Signup;