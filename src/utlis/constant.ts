export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth";
export const SIGNUP_ROUTES = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTES = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-profile-image`;
export const LOGOUT = `${AUTH_ROUTES}/logout`;

export const CONTACT_ROUTES = "api/contacts";
export const SEARCH_CONTACT = `${CONTACT_ROUTES}/search`;
export const GET_DM_CONTACT_ROUTES = `${CONTACT_ROUTES}/get-contact-for-dm`;
export const GET_ALL_CONTACTS_ROUTES = `${CONTACT_ROUTES}/get-all-contacts`;

export const MESSAGES_ROUTES = "api/messages";
export const GET_ALL_MESSAGES_ROUTES = `${MESSAGES_ROUTES}/get-messages`;
export const UPLOAD_FILE_ROUTE = `${MESSAGES_ROUTES}/upload-files`;

export const CHANNEL_ROUTES = "api/channels";
export const CREATE_CHANNEL_ROUTES = `${CHANNEL_ROUTES}/create-channel`;
export const GET_ALL_CHANNELS_ROUTES = `${CHANNEL_ROUTES}/get-all-channels`;
export const GET_ALL_CHANNELS_MESSAGES_ROUTES = `${CHANNEL_ROUTES}/get-all-channel-messages`;
