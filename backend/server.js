const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// MySQL database connection
const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'timesheet'
});

app.get('/', (req, res) => {
    return res.json("From Backend side");
});

// Login validation
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM user WHERE username = ?";  
    const values = [username];

    db.query(sql, values, (err, data) => {
        if (err) {
            console.log(err);
            return res.json("An error occurred while logging in.");
        }
        if (data.length === 0) {
            return res.json("Invalid credentials");
        }
        const user = data[0];
        if (user.password !== password) {
            return res.json("Invalid password");
        }
        const response = {
          username: user.username,
          role: user.role,
      };
      if (user.role === 'employee') {
          response.employeeId = user.user_id; 
      }

      res.json(response);
  });
});

//save user data
app.post('/user', (req, res) => {
    const sql = "INSERT INTO user (username, password, department, role) VALUES (?, ?, ?, ?)";
    const values = [
        req.body.username,
        req.body.password,
        req.body.department,
        req.body.role
    ];
    
    db.query(sql, values, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
});

//  add project and assign employees
//get employees in the dropdown list
app.get("/getEmployees", (req, res) => {
  const query = "SELECT user_id, username FROM user WHERE role = 'employee'";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching employees:", err);
      res.status(500).json({ error: "Failed to fetch employees." });
      return;
    }

    res.json(results); 
  });
});
//add project
// get all employees
app.get("/getEmployees", (req, res) => {
    const query = "SELECT user_id, username FROM users WHERE role = 'employee'"; // Assuming a `users` table with employee info
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching employees:", err);
        return res.json({ message: "Server error" });
      }
      res.json(results); 
    });
  });
  
  // add a project with assigned employees
  app.post("/addProject", (req, res) => {
    const { project_name, start_date, assignedEmployees } = req.body;
  
    const projectQuery = "INSERT INTO projects (project_name, start_date) VALUES (?, ?)";
    db.query(projectQuery, [project_name, start_date], (err, result) => {
      if (err) {
        console.error("Error adding project:", err);
        return res.json({ message: "Error adding project" });
      }
  
      // Get the last inserted project ID
      const projectId = result.insertId;
  
      // Insert project-employee associations
      const projectEmployeeQuery = "INSERT INTO project_employees (project_id, employee_id) VALUES ?";
      const values = assignedEmployees.map((empId) => [projectId, empId]);
  
      db.query(projectEmployeeQuery, [values], (err) => {
        if (err) {
          console.error("Error associating employees with project:", err);
          return res.json({ message: "Error associating employees with project" });
        }
  
        res.json({ message: "Project and employees added successfully" });
      });
    });
  });
  
  
//fetch Employees List from user table -dashboard
  app.get('/employees', (req, res) => {
    const sql = "SELECT user_id, username FROM user WHERE role = 'employee'";
    db.query(sql, (err, results) => {
      if (err) return res.json({ error: "Error fetching employees" });
      res.json(results);
    });
  });
//delete employee from employee list
app.delete('/deleteEmployee/:user_id', (req, res) => {
    const { user_id } = req.params;
    const query = "DELETE FROM user WHERE user_id = ?";
    
    db.query(query, [user_id], (err, result) => {
      if (err) {
        console.error("Error deleting employee:", err);
        return res.json("Error deleting employee.");
      }
  
      if (result.affectedRows === 0) {
        return res.json("Employee not found.");
      }
  
      res.json("Employee deleted successfully");
    });
  });
    
// Fetch projects for a specific employee join projects and project_employees table
app.get('/projects/:user_id', (req, res) => {
    const { user_id } = req.params;
    const sql = `SELECT p.project_id, p.project_name 
                 FROM project_employees pe
                 JOIN projects p ON pe.project_id = p.project_id
                 WHERE pe.employee_id = ?`;
    db.query(sql, [user_id], (err, data) => {
        if (err) return res.json("Error fetching projects.");
        res.json(data);
    });
});

// Remove project assignment for an employee
app.delete('/removeProject', (req, res) => {
    const { project_id, user_id } = req.body;
    const sql = `DELETE FROM project_employees WHERE project_id = ? AND employee_id = ?`;
    db.query(sql, [project_id, user_id], (err, result) => {
        if (err) return res.json("Error removing project.");
        res.json("Project removed successfully");
    });
});


app.listen(5000, () => {
    console.log("Listening on port 5000");
});
