import React from "react";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminDashboard from "./components/AdminDashboard";
import ProjectAdd from "./components/ProjectAdd";
import EmployeeDetails from "./components/EmployeeDetails";
import TimesheetTable from "./components/TimesheetTable";
function App() {
  return (
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/admin-dashboard' element={<AdminDashboard/>}></Route>
        <Route path='/projectadd' element={<ProjectAdd/>}></Route>
        <Route path='/employeedetails/:user_id' element={<EmployeeDetails/>}></Route>
        <Route path='/TimesheetTable' element={<TimesheetTable/>}></Route>
      </Routes>
      </BrowserRouter>
  );
}

export default App;
