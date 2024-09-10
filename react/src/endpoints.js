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
    GET_MODULES: `${API_BASE_URL}/getAllModules`,
    GET_SUBMODULES: `${API_BASE_URL}/getAllSubModules`,
    GET_LESSONS: `${API_BASE_URL}/getAllLessons`,
    GET_EVALUATION_MOMENTS: `${API_BASE_URL}/getAllEvaluationMoments`,
    GET_PROFESSORS_IN_CHARGE_OF_MODULES: `${API_BASE_URL}/getAllProfessorsInChargeOfModules`,
    GET_SUBMODULES_BY_COURSE: `${API_BASE_URL}/getSubmodulesByCourse`,
    GET_LESSONS_OF_SUBMODULE: `${API_BASE_URL}/getLessonsOfSubmodule`,
    GET_STUDENTS_BY_COURSE: `${API_BASE_URL}/getStudentsByCourse`,
    // Posts
    ADD_STUDENTS: `${API_BASE_URL}/addStudents`,
    ENROLL_STUDENTS: `${API_BASE_URL}/enrollStudents`,
    ADD_COURSES: `${API_BASE_URL}/addCourses`,
    ADD_MODULES: `${API_BASE_URL}/addModules`,
    ADD_SUBMODULES: `${API_BASE_URL}/addSubmodule`,
    ADD_LESSONS: `${API_BASE_URL}/addLessons`,
    ASSOCIATE_MODULES_TO_COURSE: `${API_BASE_URL}/associateModulesToCourse`,
    ADD_EVALUATION_MOMENT: `${API_BASE_URL}/addEvaluationMoment`,
    ASSOCIATE_PROFESSOR_TO_MODULE: `${API_BASE_URL}/associateProfessorToModule`,
    // Comments
    GET_COMMENTS: `${API_BASE_URL}/comments`,
    CREATE_COMMENT: `${API_BASE_URL}/comments`,
    DELETE_COMMENT: `${API_BASE_URL}/comments/{id}`,
};

export default endpoints;
