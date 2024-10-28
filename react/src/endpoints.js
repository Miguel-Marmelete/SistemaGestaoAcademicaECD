// src/config/apiEndpoints.js

const API_BASE_URL = "http://localhost:8000/api"; // Replace with your actual base URL

const endpoints = {
    // Authentication
    LOGIN: `${API_BASE_URL}/login`, //usado
    SIGNUP: `${API_BASE_URL}/signup`, //usado
    LOGOUT: `${API_BASE_URL}/logout`, //usado
    REQUEST_ADMIN_ACCESS: `${API_BASE_URL}/requestAdminAccess`, // usado

    // User Management
    ME: `${API_BASE_URL}/me`, //usado
    GET_PROFESSORS: `${API_BASE_URL}/getAllProfessors`, //usado
    GET_COURSES: `${API_BASE_URL}/getAllCourses`, //usado
    GET_STUDENTS: `${API_BASE_URL}/getStudents`, //usado
    GET_MODULES: `${API_BASE_URL}/getAllModules`, //usado
    GET_SUBMODULES: `${API_BASE_URL}/getSubModules`, //usado
    GET_EVALUATION_MOMENTS_OF_PROFESSOR: `${API_BASE_URL}/getProfessorEvaluationMoments`, //usado
    GET_PROFESSORS_IN_CHARGE_OF_MODULES: `${API_BASE_URL}/getAllProfessorsInChargeOfModules`, //usado
    GET_FILTERED_LESSONS: `${API_BASE_URL}/getFilteredLessons`, //usado
    GET_SUBMODULES_OF_PROFESSOR: `${API_BASE_URL}/getSubmodulesOfProfessor`, //usado
    GET_ATTENDANCE: `${API_BASE_URL}/getAttendance`, //usado
    GET_MODULES_BY_COURSE: `${API_BASE_URL}/getModulesByCourse`, //usado
    GET_PROFESSORS_IN_CHARGE_OF_MODULES_BY_COURSE: `${API_BASE_URL}/getProfessorsInChargeOfModulesByCourse`, //usado
    GET_PROFESSOR_EVALUATION_MOMENTS: `${API_BASE_URL}/getProfessorEvaluationMoments`, //usado
    GET_COURSES_AND_MODULES_OF_PROFESSOR: `${API_BASE_URL}/getCoursesAndModulesOfProfessor`, //usado
    GET_MODULES_OF_COURSE_OF_PROFESSOR: `${API_BASE_URL}/getModulesOfCourseOfProfessor`, //usado
    GET_STUDENTS_EVALUATION_MOMENT_GRADES: `${API_BASE_URL}/getStudentsEvaluationMomentGrades`, //usado
    GET_STUDENTS_WITH_GRADES: `${API_BASE_URL}/getStudentsWithGrades`, //usado
    GET_STUDENT: `${API_BASE_URL}/getStudent`, //usado
    // Posts
    ENROLL_STUDENTS: `${API_BASE_URL}/enrollStudents`, //usado
    ADD_COURSES: `${API_BASE_URL}/addCourses`, //usado
    ADD_MODULES: `${API_BASE_URL}/addModules`, //usado
    ADD_SUBMODULES: `${API_BASE_URL}/addSubmodule`, //usado
    ASSOCIATE_MODULES_TO_COURSE: `${API_BASE_URL}/associateModulesToCourse`, //usado
    ADD_EVALUATION_MOMENT: `${API_BASE_URL}/addEvaluationMoment`, //usado
    ASSOCIATE_PROFESSOR_TO_MODULE: `${API_BASE_URL}/associateProfessorToModule`, //usado
    REGIST_ATTENDANCE: `${API_BASE_URL}/createAttendance`, //usado
    ADD_LESSON_AND_ATTENDANCE: `${API_BASE_URL}/addLessonAndAttendance`, //usado
    ADD_AND_ENROLL_STUDENT: `${API_BASE_URL}/addAndEnrollStudent`, //usado
    SUBMIT_EVALUATION_MOMENT_GRADES: `${API_BASE_URL}/submitEvaluationMomentGrades`, //usado
    ADD_PROFESSOR: `${API_BASE_URL}/addProfessor`, //usado
    ADD_COURSES_CSV: `${API_BASE_URL}/addCoursesCSV`, //usado
    ADD_AND_ENROLL_STUDENTS_CSV: `${API_BASE_URL}/addAndEnrollStudentsCSV`, //usado
    SUBMIT_GRADES: `${API_BASE_URL}/submitGrades`, //usado

    //DELETE
    DELETE_COURSE: `${API_BASE_URL}/deleteCourse`, //usado
    DELETE_MODULE: `${API_BASE_URL}/deleteModule`, //usado
    DELETE_SUBMODULE: `${API_BASE_URL}/deleteSubmodule`, //usado
    DELETE_LESSON: `${API_BASE_URL}/deleteLesson`, //usado
    DELETE_PROFESSOR: `${API_BASE_URL}/deleteProfessor`, //usado
    DELETE_STUDENT: `${API_BASE_URL}/deleteStudent`, //usado
    DELETE_PROFESSOR_IN_CHARGE_OF_MODULE: `${API_BASE_URL}/deleteProfessorInChargeOfModule`, //usado
    DELETE_STUDENT_GRADE: `${API_BASE_URL}/deleteGradeEvaluationMoment`, //usado
    DELETE_MODULE_FROM_COURSE: `${API_BASE_URL}/deleteModuleFromCourse`, //usado

    //UPDATE
    UPDATE_COURSE: `${API_BASE_URL}/updateCourse`, //usado
    UPDATE_MODULE: `${API_BASE_URL}/updateModule`, //usado
    UPDATE_SUBMODULE: `${API_BASE_URL}/updateSubmodule`, //usado
    UPDATE_LESSON: `${API_BASE_URL}/updateLesson`, //usado
    UPDATE_STUDENT: `${API_BASE_URL}/updateStudent`, //usado
    UPDATE_ATTENDANCE: `${API_BASE_URL}/updateAttendance`, //usado
    UPDATE_STUDENT_GRADE: `${API_BASE_URL}/updateGradeEvaluationMoment`, //usado
};

export default endpoints;
