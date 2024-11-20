import React, { useState , useEffect} from "react";
import axios from 'axios';
import Navbar from "./Navbar";
import Select from "react-select";


const ProjectAdd = () => {
  const [projects, setProjects] = useState({
    project_name: '',
    start_date: '',
  });
  const [assignedEmployees, setAssignedEmployees] = useState([""]);
  const [message, setMessage] = useState("");
  const [allEmployees, setAllEmployees] = useState([]);
//adding more than one employee
const handleEmployeeSelection = (selectedOptions) => {
  setAssignedEmployees(selectedOptions || []);
};
  //fetch employeeId
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getEmployees");
        setAllEmployees(response.data.map(emp => ({
          label: `${emp.username} (${emp.user_id})`,
          value: emp.user_id
        })));
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };

    fetchEmployees();
  }, []);

  // Add project and associated employees
  const AddProject = async (e) => {
    e.preventDefault();

    const projectData = {
      project_name: projects.project_name,
      start_date: projects.start_date,
      assignedEmployees: assignedEmployees.map((emp) => emp.value),
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
                className="form-control"/>
            </div>
            <div className="mb-3">
              <label className="form-label">Assign Employees:</label>
              <Select isMulti
                name="employees"
                options={allEmployees}
                value={assignedEmployees}
                onChange={handleEmployeeSelection}
                placeholder="Select employees"
                getOptionLabel={(e) => `${e.label}`}
                className="react-select-container"
                classNamePrefix="react-select"/>
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
