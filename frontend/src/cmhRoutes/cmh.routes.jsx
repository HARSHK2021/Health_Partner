// const host = process.env.VITE_BASE_URL;
const host = `${import.meta.env.VITE_BASE_URL}`;

export const CMH_ROUTES = {
    GET_USER: `${host}/user/getuser/:userID`,
    GET_FACILITY: `${host}/user/getfacility/:userID`,
    SIGNUP: `${host}/auth/signup`,
    LOGIN: `${host}auth/login`,
    SIGNOUT: `${host}/auth/signout`,
    FORGOT_PASSWORD: `${host}/auth/forgot-password`,
    RESET_PASSWORD: `${host}/auth/reset-password`,
    REGISTER_MEDICAL_FACILITY: `${host}/auth/register-medical-facility`,
    LOGIN_FACILITY: `${host}/auth/login-facility`,
    REQUEST_EMAIL_OTP: `${host}/auth/request-email-otp`,
    VERIFY_EMAIL_OTP: `${host}/auth/verify-email-otp`,
    EDIT_PROFILE: `${host}/patient/update-profile`,
}
