import User from "../models/User.js"

import dotenv from "dotenv";

dotenv.config();


////// controller for function common for both Patient and doctor 
import axios from "axios";
/// get user by uerID 
export const getUser= async(req,res)=>{
  try {
    const { userID } = req.params;
   console.log(userID)
   const user = await User.findById(userID) .select("-password");
   if(!user) return res.status(404).json({message:"User Not Found With This Email"})
    res.status(200).json({ user });
  } catch (error) {
    console.error(" Error feteching user by id",error)
    res.status(500).json({ message: "Server error" })
    
  }

}


// Find Nearby Hospitals
export const findNearbyHospitals = async (req, res) => {
  try {
      const { latitude, longitude, radius = 5000 } = req.body; // Radius in meters (default: 5km)

      if (!latitude || !longitude) {
          return res.status(400).json({ message: "Latitude and Longitude are required" });
      }

      // Overpass API Query (Find hospitals within the radius)
      const overpassQuery = `
          [out:json];
          (
              node["amenity"="hospital"](around:${radius}, ${latitude}, ${longitude});
              way["amenity"="hospital"](around:${radius}, ${latitude}, ${longitude});
              relation["amenity"="hospital"](around:${radius}, ${latitude}, ${longitude});
          );
          out center;
      `;

      const overpassURL = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

      // Fetch hospital data from Overpass API
      const { data } = await axios.get(overpassURL);

      if (!data.elements.length) {
          return res.status(404).json({ message: "No hospitals found nearby" });
      }

      // Format hospital data
      const hospitals = data.elements.map((hospital) => ({
          name: hospital.tags.name || "Unknown Hospital",
          latitude: hospital.lat || hospital.center?.lat,
          longitude: hospital.lon || hospital.center?.lon,
          address: hospital.tags["addr:full"] || "Address not available",
      }));

      res.status(200).json({ hospitals });
  } catch (error) {
      res.status(500).json({ message: "Error finding nearby hospitals", error: error.message });
  }
};







