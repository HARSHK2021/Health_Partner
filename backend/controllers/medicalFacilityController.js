///// All healthcare Controller will come here
import HealthcareFacility from "../models/HealthcareFacility.js";

// get facility by Id
// Get Facility by ID
export const getFacility = async (req, res) => {
  try {
   
    const { userID } = req.params;
   
    if (!userID) {
      return res.status(400).json({ message: "Facility ID is required" });
    }

    // Find the facility by ID
    const facility = await HealthcareFacility.findById(userID);

    if (!facility) {
      return res
        .status(404)
        .json({ message: "Facility not found with this Id" });
    }

    // Return the facility details
    res.status(200).json({ facility });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
