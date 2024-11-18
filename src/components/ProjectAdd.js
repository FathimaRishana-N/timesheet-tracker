import React, { useState } from "react";
import axios from 'axios';
import Navbar from "./Navbar";

const ProjectAdd = () => {
  const [projects, setProjects] = useState({
    project_name: '',
    start_date: '',
  });
  const [assignedEmployees, setAssignedEmployees] = useState([""]);
  const [message, setMessage] = useState("");
//adding more than one employee
  const handleAddEmployee = () => {
    setAssignedEmployees([...assignedEmployees, ""]);
  };

  const handleEmployeeChange = (index, value) => {
    const updatedEmployees = [...assignedEmployees];
    updatedEmployees[index] = value;
    setAssignedEmployees(updatedEmployees);
  };

  // Add project and associated employees
  const AddProject = async (e) => {
    e.preventDefault();

    const projectData = {
      project_name: projects.project_name,
      start_date: projects.start_date,
      assignedEmployees: assignedEmployees,
    };

    try {
      const response = await axios.post('http://localhost:5000/addProject', projectData);
      setMessage(response.data);

      // Reset form on successful addition
      setProjects({ project_name: '', start_date: '' });
      setAssignedEmployees([""]);
    } catch (err) {
      setMessage("Error adding project or employees: " + err.response.data || "Server error");
    }
  };

  return (
    <div>
    <Navbar />
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
      <div className="card p-4" style={{ maxWidth: '800px', width: '100%' }}>
          <h2 className="text-center text-primary mb-4">Add New Project</h2>

          {message && (
            <div className={`alert ${message.includes("Error") ? 'alert-danger' : 'alert-success'} text-center`}>
              {message}
            </div>
          )}

          <form onSubmit={AddProject}>
            <div className="mb-3">
              <label className="form-label">Project Name:</label>
              <input
                type="text"
                value={projects.project_name}
                onChange={e => setProjects({ ...projects, project_name: e.target.value })}
                className="form-control"
                placeholder="Enter project name"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Start Date:</label>
              <input
                type="date"
                value={projects.start_date}
                onChange={e => setProjects({ ...projects, start_date: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Assigned Employees:</label>
              {assignedEmployees.map((employee, index) => (
                <div className="input-group mb-2" key={index}>
                  <input
                    type="text"
                    value={employee}
                    onChange={(e) => handleEmployeeChange(index, e.target.value)}
                    className="form-control"
                    placeholder={`Enter Employee-ID ${index + 1}`}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddEmployee}
                className="btn btn-outline-primary mt-2 w-100"
              >
                Add Another Employee
              </button>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectAdd;
