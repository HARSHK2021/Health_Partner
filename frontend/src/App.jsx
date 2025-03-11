import { Route, BrowserRouter as Router, Routes, Link } from 'react-router-dom'; // Import Link for navigation
import './App.css';
import Login from './components/LoginPage/Login';
import UserRegistrationForm from './components/UserRegistration/UserRegistrationForm';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <>
      Hello Coming soon
      <Router>
        {/* <nav>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </nav> */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<UserRegistrationForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
