import { useState } from "react"
import "./userregistrationform.css"

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    role: "patient",
    phone: "",
    address: "",
    profileImage: "",
    Gender: "",
    height: "",
    weight: "",
    bodyMassIndex: "",
    doctorProfile: {
      specialization: "",
      experience: "",
      hospital: "",
    },
  })

  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith("doctorProfile.")) {
      const [parent, field] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [field]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\+?[1-9]\d{1,14}$/

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }
    if (!formData.password) newErrors.password = "Password is required"
    if (!formData.phone) {
      newErrors.phone = "Phone is required"
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Invalid phone number"
    }
    if (!formData.Gender) newErrors.Gender = "Gender is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      const userData = {
        ...formData,
        // Add conditional doctor profile
        doctorProfile: formData.role === "doctor" ? formData.doctorProfile : undefined,
      }
      console.log("Submission Data:", userData)
      // api call will bw here
    }
  }

  return (
    <form onSubmit={handleSubmit} className="registration-form">
      <h2>User Registration</h2>
      <p className="required-legend">
        <span>*</span>Required fields
      </p>

      <div className="form-group-row">
        <div className="form-group">
          <label data-required="*">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="eg: jhonny"
          />
          {errors.firstName && <span className="error">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <label>Middle Name</label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleInputChange}
            placeholder="eg. kumar"
          />
        </div>

        <div className="form-group">
          <label data-required="*">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="eg. singh"
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>
      </div>

      <div className="form-group">
        <label data-required="*">Email ID</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="junnusingh@example.com"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label data-required="*">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="choose password(suggested: 8+ characters with a mix of letters, numbers & symbols)"
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div className="form-group-row">
        <div className="form-group">
          <label data-required="*">Role</label>
          <select name="role" value={formData.role} onChange={handleInputChange}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>

        <div className="form-group">
          <label data-required="*">Gender</label>
          <select name="Gender" value={formData.Gender} onChange={handleInputChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.Gender && <span className="error">{errors.Gender}</span>}
        </div>
      </div>

      <div className="form-group">
        <label data-required="*">Phone</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 XXXXX XXXXX" />
        {errors.phone && <span className="error">{errors.phone}</span>}
      </div>

      <div className="form-group">
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="123 Road Pe, City, Country"
        />
      </div>

      <div className="form-group">
        <label>Profile Image URL</label>
        <input
          type="url"
          name="profileImage"
          value={formData.profileImage}
          onChange={handleInputChange}
          placeholder="https://example.com/profile.jpg"
        />
      </div>

      {formData.role === "patient" && (
        <div className="role-section">
          <h3>Patient Information</h3>
          <div className="form-group-row">
            <div className="form-group">
              <label>Height (cm)</label>
              <input type="text" name="height" value={formData.height} onChange={handleInputChange} placeholder="175" />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input type="text" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="70" />
            </div>
            <div className="form-group">
              <label>BMI</label>
              <input
                type="text"
                name="bodyMassIndex"
                value={formData.bodyMassIndex}
                onChange={handleInputChange}
                placeholder="22.9"
              />
            </div>
          </div>
        </div>
      )}

      {formData.role === "doctor" && (
        <div className="role-section">
          <h3>Doctor Information</h3>
          <div className="form-group">
            <label>Specialization</label>
            <input
              type="text"
              name="doctorProfile.specialization"
              value={formData.doctorProfile.specialization}
              onChange={handleInputChange}
              placeholder="Cardiology"
            />
          </div>
          <div className="form-group-row">
            <div className="form-group">
              <label>Experience (years)</label>
              <input
                type="number"
                name="doctorProfile.experience"
                value={formData.doctorProfile.experience}
                onChange={handleInputChange}
                min="0"
                placeholder="5"
              />
            </div>
            <div className="form-group">
              <label>Hospital ID</label>
              <input
                type="text"
                name="doctorProfile.hospital"
                value={formData.doctorProfile.hospital}
                onChange={handleInputChange}
                placeholder="HOSP-12345"
              />
            </div>
          </div>
        </div>
      )}

      <button type="submit" className="submit-btn">
        Register
      </button>
    </form>
  )
}

export default RegistrationForm