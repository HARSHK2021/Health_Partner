import { Route, BrowserRouter as Router, Routes, Link } from 'react-router-dom'; // Import Link for navigation
import './App.css';
import Login from './components/LoginPage/Login';
import UserRegistrationForm from './components/UserRegistration/UserRegistrationForm';
import UserDashboard from './components/Dashboards/UserDashboard';
import FacilityDashboard from './components/Dashboards/FacilityDashboard';
import FacilityRegistrationForm from './components/FacilityRegistration/FacilityRegistrationForm';
import Home from './pages/Home';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyPage from "./pages/VerifyPage"
import Dashboard from './pages/Dashboard';
import PatientDashboard from './pages/PatientDashboard';
import PatientProtectedWrapper from './Wrapper/PatientProtectedWrapper';
function App() {
  return (
    <>
     
      <Router>
        <Routes>
          <Route path='/' element={<Home/>} />
           <Route path="/register-facility" element={<FacilityRegistrationForm  />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/:role" element={<UserRegistrationForm />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage/>} />
          <Route path="/user-dashboard" element={<UserDashboard/>} />
          <Route path="/facility-dashboard" element={<FacilityDashboard />} />
          <Route path="/verify/:userID" element={<VerifyPage/>} />
          <Route path="/dashboard/:" element={<Dashboard />} />

   
          <Route path="/patient-dashboard/" element ={<PatientProtectedWrapper>
            <PatientDashboard/>
            </PatientProtectedWrapper>
            }/>
         
         
        </Routes>
      </Router>
      
    </>
  );
}

export default App;
