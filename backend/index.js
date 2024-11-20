const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'timesheetdb',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to database');
});

// Get the start date of the week
app.get('/api/week-start-date', (req, res) => {
  const today = new Date();
  const startDate = new Date(today.setDate(today.getDate() - today.getDay()));
  res.json({ week_start_date: startDate.toISOString().split('T')[0] });
});

// Get all timesheets
app.get('/api/timesheets', (req, res) => {
  const query = 'SELECT * FROM timesheets';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching timesheets:', err);
      return res.status(500).json({ error: 'Error fetching timesheets' });
    }
    res.json(results);
  });
});

// Add a new timesheet
app.post('/api/timesheets', (req, res) => {
  const timesheet = req.body;

  if (!timesheet.project_id || !timesheet.project_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = 'INSERT INTO timesheets SET ?';
  db.query(query, timesheet, (err, results) => {
    if (err) {
      console.error('Error inserting timesheet:', err);
      return res.status(500).json({ error: 'Error adding timesheet' });
    }
    res.status(201).json({ ...timesheet, id: results.insertId });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
