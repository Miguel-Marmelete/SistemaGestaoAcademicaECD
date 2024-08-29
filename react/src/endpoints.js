// src/config/apiEndpoints.js

const API_BASE_URL = "http://localhost:8000/api"; // Replace with your actual base URL

const endpoints = {
    // Authentication
    LOGIN: `${API_BASE_URL}/login`,
    SIGNUP: `${API_BASE_URL}/signup`,
    LOGOUT: `${API_BASE_URL}/logout`,

    // User Management
    GET_PROFESSORS: `${API_BASE_URL}/getAllProfessors`,
    GET_COURSES: `${API_BASE_URL}/getAllCourses`,
    GET_STUDENTS: `${API_BASE_URL}/getAllStudents`,
    GET_FILTERED_STUDENTS: `${API_BASE_URL}/students/search`,

    // Posts
    ADD_STUDENTS: `${API_BASE_URL}/addStudents`,
    ADD_COURSES: `${API_BASE_URL}/addCourses`,
    ADD_MODULES: `${API_BASE_URL}/addModules`,
    CREATE_POST: `${API_BASE_URL}/posts`,
    UPDATE_POST: `${API_BASE_URL}/posts/{id}`,
    DELETE_POST: `${API_BASE_URL}/posts/{id}`,

    // Comments
    GET_COMMENTS: `${API_BASE_URL}/comments`,
    CREATE_COMMENT: `${API_BASE_URL}/comments`,
    DELETE_COMMENT: `${API_BASE_URL}/comments/{id}`,
};

export default endpoints;
