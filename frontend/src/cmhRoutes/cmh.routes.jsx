// const host = process.env.VITE_BASE_URL;
const host = `${import.meta.env.VITE_BASE_URL}`;

export const CMH_ROUTES = {
    GET_USER: `${host}/user/getuser/:userID`,
    GET_FACILITY: `${host}/user/getfacility/:userID`,
    SIGNUP: `${host}/auth/signup`,
    LOGIN: `${host}auth/login`,
    FORGOT_PASSWORD: `${host}/auth/forgot-password`,
    REGISTER_MEDICAL_FACILITY: `${host}/auth/register-medical-facility`,
    LOGIN_FACILITY: `${host}/auth/login-facility`,
    REQUEST_EMAIL_OTP: `${host}/auth/request-email-otp`,
    VERIFY_EMAIL_OTP: `${host}/auth/verify-email-otp`,
    EDIT_PROFILE: `${host}/patient/update-profile`,
    ADD_MEDICAL_RECORD: `${host}/patient/upload-medical-records `,
    GET_MEDICAL_RECORD: `${host}/patient/medical-records/`,
    GET_MEDICAL_RECORD_BY_ID: `${host}/patient/medical-records/user`,
}
