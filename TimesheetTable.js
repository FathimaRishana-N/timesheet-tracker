import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TimesheetTable.css';

const TimesheetTable = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [newRow, setNewRow] = useState({
    project_id: '',
    project_name: '',
    sunday: 0,
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    total_weekly_hours: 0,
  });
  const [currentDate, setCurrentDate] = useState('');
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    fetchTimesheets();
    fetchStartDate();
    setCurrentDate(new Date().toISOString().split('T')[0]);
  }, []);

  const fetchTimesheets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/timesheets');
      setTimesheets(response.data);
    } catch (error) {
      console.error('Error fetching timesheets:', error);
    }
  };

  const fetchStartDate = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/week-start-date');
      setStartDate(response.data.week_start_date);
    } catch (error) {
      console.error('Error fetching start date:', error);
    }
  };

  const calculateTotalHours = (row) => {
    return row.sunday + row.monday + row.tuesday + row.wednesday + row.thursday + row.friday + row.saturday;
  };

  const getDayDate = (offset) => {
    if (!startDate) return '';
    const baseDate = new Date(startDate);
    baseDate.setDate(baseDate.getDate() + offset);
    return baseDate.toISOString().split('T')[0];
  };

  const addRow = async () => {
    const rowWithTotal = {
      ...newRow,
      total_weekly_hours: calculateTotalHours(newRow),
    };

    try {
      const response = await axios.post('http://localhost:5000/api/timesheets', rowWithTotal);
      setTimesheets([...timesheets, response.data]);
      setNewRow({
        project_id: '',
        project_name: '',
        sunday: 0,
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        total_weekly_hours: 0,
      });
    } catch (error) {
      console.error('Error adding new row:', error);
    }
  };

  return (
    <div className="timesheet-container">
      <h2>Timesheet</h2>

      {/* Display the current date 
      <div className="current-date">
        <strong>Current Date: {currentDate}</strong>
      </div>*/}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Project ID</th>
            <th>Project Name</th>
            <th>Sunday ({getDayDate(0)})</th>
            <th>Monday ({getDayDate(1)})</th>
            <th>Tuesday ({getDayDate(2)})</th>
            <th>Wednesday ({getDayDate(3)})</th>
            <th>Thursday ({getDayDate(4)})</th>
            <th>Friday ({getDayDate(5)})</th>
            <th>Saturday ({getDayDate(6)})</th>
            <th>Total Weekly Hours</th>
          </tr>
        </thead>
        <tbody>
          {timesheets.map((timesheet, index) => (
            <tr key={index}>
              <td>{timesheet.project_id}</td>
              <td>{timesheet.project_name}</td>
              <td>{timesheet.sunday}</td>
              <td>{timesheet.monday}</td>
              <td>{timesheet.tuesday}</td>
              <td>{timesheet.wednesday}</td>
              <td>{timesheet.thursday}</td>
              <td>{timesheet.friday}</td>
              <td>{timesheet.saturday}</td>
              <td>{timesheet.total_weekly_hours}</td>
            </tr>
          ))}

          <tr>
            <td>
              <input
                value={newRow.project_id}
                onChange={(e) => setNewRow({ ...newRow, project_id: e.target.value })}
              />
            </td>
            <td>
              <input
                value={newRow.project_name}
                onChange={(e) => setNewRow({ ...newRow, project_name: e.target.value })}
              />
            </td>
            <td>
              <input
                type="number"
                min="0"
                value={newRow.sunday}
                onChange={(e) =>
                  setNewRow({ ...newRow, sunday: parseInt(e.target.value) || 0 })
                }
              />
            </td>
            <td>
              <input
                type="number"
                min="0"
                value={newRow.monday}
                onChange={(e) =>
                  setNewRow({ ...newRow, monday: parseInt(e.target.value) || 0 })
                }
              />
            </td>
            <td>
              <input
                type="number"
                min="0"
                value={newRow.tuesday}
                onChange={(e) =>
                  setNewRow({ ...newRow, tuesday: parseInt(e.target.value) || 0 })
                }
              />
            </td>
            <td>
              <input
                type="number"
                min="0"
                value={newRow.wednesday}
                onChange={(e) =>
                  setNewRow({ ...newRow, wednesday: parseInt(e.target.value) || 0 })
                }
              />
            </td>
            <td>
              <input
                type="number"
                min="0"
                value={newRow.thursday}
                onChange={(e) =>
                  setNewRow({ ...newRow, thursday: parseInt(e.target.value) || 0 })
                }
              />
            </td>
            <td>
              <input
                type="number"
                min="0"
                value={newRow.friday}
                onChange={(e) =>
                  setNewRow({ ...newRow, friday: parseInt(e.target.value) || 0 })
                }
              />
            </td>
            <td>
              <input
                type="number"
                min="0"
                value={newRow.saturday}
                onChange={(e) =>
                  setNewRow({ ...newRow, saturday: parseInt(e.target.value) || 0 })
                }
              />
            </td>
            <td>{calculateTotalHours(newRow)}</td>
          </tr>
        </tbody>
      </table>
      <button onClick={addRow} style={{ marginTop: '10px' }}>
        Add Row
      </button>
    </div>
  );
};

export default TimesheetTable;

        