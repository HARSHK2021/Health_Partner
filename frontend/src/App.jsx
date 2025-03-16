import { Route, BrowserRouter as Router, Routes, Link } from 'react-router-dom'; // Import Link for navigation
import './App.css';
import Login from './components/LoginPage/Login';
import UserRegistrationForm from './components/UserRegistration/UserRegistrationForm';
import UserDashboard from './components/Dashboards/UserDashboard';
import FacilityDashboard from './components/Dashboards/FacilityDashboard';
import FacilityRegistrationForm from './components/FacilityRegistration/FacilityRegistrationForm';
function App() {
  return (
    <>
     
      <Router>
        {/* <nav>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </nav> */}
        <Routes>
           <Route path="/register-facility" element={<FacilityRegistrationForm  />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<UserRegistrationForm />} />
          <Route path="/user-dashboard" element={<UserDashboard/>} />
          <Route path="/facility-dashboard" element={<FacilityDashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
