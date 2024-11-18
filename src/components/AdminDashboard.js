import React ,{ useEffect, useState} from "react";
import axios from'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/employees");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();}, []);

    const deleteEmployee = async (user_id) => {
      try {
        const response = await axios.delete(`http://localhost:5000/deleteEmployee/${user_id}`);
        if (response.data === 'Employee deleted successfully') {

          setEmployees(employees.filter(employee => employee.user_id !== user_id));
          alert("Employee deleted successfully.");
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert("Error deleting employee.");
      }
    };
  

  return (
    <div >
    <Navbar />
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
      <div className="card p-4" style={{ maxWidth: '800px', width: '100%' }}>
          <h1 className="text-center text-primary mb-4">Employee List</h1>
          <table className="table table-bordered text-center">
            <thead className="table-primary">
              <tr>
                <th>Employee_ID</th>
                <th>Employee Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {employees.map((employee) => (
            <tr key={employee.user_id}>
            <td>{employee.user_id}</td>
            <td>{employee.username}</td>
              <td>
                  <button className="btn btn-info me-2" onClick={()=>navigate(`/employeedetails/${employee.user_id}`)}>View Details</button>
                  <button className="btn btn-danger " onClick={() => deleteEmployee(employee.user_id)} >Delete</button>
                </td>
              </tr>
          ))}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
