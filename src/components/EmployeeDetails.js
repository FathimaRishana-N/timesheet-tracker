import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";

const EmployeeDetails = () => {
  const { user_id } = useParams();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/projects/${user_id}`);
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [user_id]);

  const removeProject = async (project_id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/removeProject`, {
        headers: { "Content-Type": "application/json" },
        data: { project_id, user_id }
      });
      if (response.data === 'Project removed successfully') {
        setProjects(projects.filter((project) => project.project_id !== project_id));
        alert("Project removed successfully.");
      }
    } catch (error) {
      console.error("Error removing project:", error);
      alert("Error removing project.");
    }
  };
  

  return (
    <div>
    <Navbar />
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
      <div className="card p-4" style={{ maxWidth: '800px', width: '100%' }}>
        <h2 className="text-center text-primary mb-4">Projects Assigned to Employee {user_id}</h2>
        {projects.length > 0 ? (
          <table className="table table-bordered text-center">
            <thead className="table-primary">
              <tr>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.project_id}>
                  <td>{project.project_id}</td>
                  <td>{project.project_name}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeProject(project.project_id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No projects assigned to this employee.</p>
        )}
    </div>
      </div>
    </div>
  );
};
export default EmployeeDetails;
