// const host = process.env.VITE_BASE_URL;
const host = `${import.meta.env.VITE_BASE_URL}`;

export const CMH_ROUTES = {
    GET_USER: `${host}/user/getuser/:userID`,
    GET_FACILITY: `${host}/user/getfacility/:userID`,
    SIGNUP: `${host}/auth/signup`,
    LOGIN: `${host}/auth/login`,
    FORGOT_PASSWORD: `${host}/auth/forgot-password`,
    REGISTER_MEDICAL_FACILITY: `${host}/auth/register-medical-facility`,
    LOGIN_FACILITY: `${host}/auth/login-facility`,
    REQUEST_EMAIL_OTP: `${host}/auth/request-email-otp`,
    VERIFY_EMAIL_OTP: `${host}/auth/verify-email-otp`,
    EDIT_PROFILE: `${host}/patient/update-profile`,
    ADD_MEDICAL_RECORD: `${host}/patient/upload-medical-records `,
    GET_MEDICAL_RECORD: `${host}/patient/medical-records/`,
    GET_MEDICAL_RECORD_BY_ID: `${host}/patient/medical-records/user`,
    
    // Doctor-patient data sharing routes
    // Doctor routes
    SEARCH_PATIENT_BY_EMAIL: `${host}/access/search`,
    REQUEST_ACCESS: `${host}/access/request`,
    CHECK_ACCESS: `${host}/access/check`,
    GET_PATIENT_DATA: `${host}/access/patient`,
    GET_MY_PATIENTS: `${host}/access/mypatients`,
    
    // Patient routes
    GET_ACCESS_REQUESTS: `${host}/access/requests`,
    GET_DOCTORS_WITH_ACCESS: `${host}/access/doctors`,
    RESPOND_TO_ACCESS_REQUEST: `${host}/access/respond`,
    REVOKE_ACCESS: `${host}/access/revoke`,
    GET_ACTIVE_MEDICINE_BY_ID: `${host}/activeMedicine/:userId`,
}
