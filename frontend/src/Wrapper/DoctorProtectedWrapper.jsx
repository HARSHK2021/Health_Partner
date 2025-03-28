import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { UserDataContext } from '../context/UserContext';
import axios from 'axios'
const DoctorProtectedWrapper = ({children}) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const {user, setUser} = useContext(UserDataContext)
    const [isLoading, setIsLoading]= useState(true);
    useEffect(() => {
        if (!token) {
          navigate("/login");
        }
        axios.get(`${import.meta.env.VITE_BASE_URL}/doctor/get-profile`,{
          headers: { Authorization: `Bearer ${token}` }
        }).then(response =>{
          if(response.status=== 200){
            console.log("response from protected ",response)
            setUser(response.data)
            setIsLoading(false)
          }
        }).catch(err=>{
          console.error(err)
          localStorage.removeItem("token")
          navigate("/login")
    
        })
      }, [token]); 
      if(isLoading){
        return ( <div> Loading....</div>)
       
      }
      
      return <>{children}</>;
}

export default DoctorProtectedWrapper
