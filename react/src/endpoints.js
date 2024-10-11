// src/config/apiEndpoints.js

const API_BASE_URL = "http://localhost:8000/api"; // Replace with your actual base URL

const endpoints = {
    // Authentication
    LOGIN: `${API_BASE_URL}/login`,
    SIGNUP: `${API_BASE_URL}/signup`,
    LOGOUT: `${API_BASE_URL}/logout`,
    REQUEST_ADMIN_ACCESS: `${API_BASE_URL}/requestAdminAccess`,

    // User Management
    ME: `${API_BASE_URL}/me`,
    GET_PROFESSORS: `${API_BASE_URL}/getAllProfessors`,
    GET_COURSES: `${API_BASE_URL}/getAllCourses`,
    GET_STUDENTS: `${API_BASE_URL}/getStudents`,
    GET_FILTERED_STUDENTS: `${API_BASE_URL}/students/search`,
    GET_MODULES: `${API_BASE_URL}/getAllModules`,
    GET_SUBMODULES: `${API_BASE_URL}/getSubModules`,
    GET_LESSONS: `${API_BASE_URL}/getAllLessons`,
    GET_LESSON_BY_ID: `${API_BASE_URL}/getLessonById`,
    GET_EVALUATION_MOMENTS_OF_PROFESSOR: `${API_BASE_URL}/getProfessorEvaluationMoments`,
    GET_PROFESSORS_IN_CHARGE_OF_MODULES: `${API_BASE_URL}/getAllProfessorsInChargeOfModules`,
    GET_SUBMODULES_BY_COURSE: `${API_BASE_URL}/getSubmodulesByCourse`,
    GET_LESSONS_OF_SUBMODULE: `${API_BASE_URL}/getLessonsOfSubmodule`,
    GET_FILTERED_LESSONS: `${API_BASE_URL}/getFilteredLessons`,
    GET_SUBMODULES_OF_PROFESSOR: `${API_BASE_URL}/getSubmodulesOfProfessor`,
    GET_ATTENDANCE: `${API_BASE_URL}/getAttendance`,
    GET_MODULES_BY_COURSE: `${API_BASE_URL}/getModulesByCourse`,
    GET_PROFESSORS_IN_CHARGE_OF_MODULES_BY_COURSE: `${API_BASE_URL}/getProfessorsInChargeOfModulesByCourse`,
    GET_MODULES_OF_PROFESSOR: `${API_BASE_URL}/getModulesOfProfessor`,
    GET_PROFESSOR_EVALUATION_MOMENTS: `${API_BASE_URL}/getProfessorEvaluationMoments`,
    GET_COURSES_AND_MODULES_OF_PROFESSOR: `${API_BASE_URL}/getCoursesAndModulesOfProfessor`,
    GET_MODULES_OF_COURSE_OF_PROFESSOR: `${API_BASE_URL}/getModulesOfCourseOfProfessor`,
    GET_STUDENTS_EVALUATION_MOMENT_GRADES: `${API_BASE_URL}/getStudentsEvaluationMomentGrades`,
    GET_STUDENTS_WITH_GRADES: `${API_BASE_URL}/getStudentsWithGrades`,
    SUBMIT_GRADES: `${API_BASE_URL}/submitGrades`,
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
    CREATE_AND_ENROLL: `${API_BASE_URL}/createAndEnroll`,
    REGIST_ATTENDANCE: `${API_BASE_URL}/createAttendance`,
    ADD_LESSON_AND_ATTENDANCE: `${API_BASE_URL}/addLessonAndAttendance`,
    ADD_AND_ENROLL_STUDENT: `${API_BASE_URL}/addAndEnrollStudent`,
    SUBMIT_EVALUATION_MOMENT_GRADES: `${API_BASE_URL}/submitEvaluationMomentGrades`,
    ADD_PROFESSOR: `${API_BASE_URL}/addProfessor`,
    ADD_COURSES_CSV: `${API_BASE_URL}/addCoursesCSV`,
    ADD_AND_ENROLL_STUDENTS_CSV: `${API_BASE_URL}/addAndEnrollStudentsCSV`,
    //DELETE
    DELETE_COURSE: `${API_BASE_URL}/deleteCourse`,
    DELETE_MODULE: `${API_BASE_URL}/deleteModule`,
    DELETE_SUBMODULE: `${API_BASE_URL}/deleteSubmodule`,
    DELETE_LESSON: `${API_BASE_URL}/deleteLesson`,
    DELETE_EVALUATION_MOMENT: `${API_BASE_URL}/deleteEvaluationMoment`,
    DELETE_PROFESSOR: `${API_BASE_URL}/deleteProfessor`,
    DELETE_STUDENT: `${API_BASE_URL}/deleteStudent`,
    DELETE_PROFESSOR_IN_CHARGE_OF_MODULE: `${API_BASE_URL}/deleteProfessorInChargeOfModule`,
    DELETE_STUDENT_GRADE: `${API_BASE_URL}/deleteGradeEvaluationMoment`,

    //UPDATE
    UPDATE_COURSE: `${API_BASE_URL}/updateCourse`,
    UPDATE_MODULE: `${API_BASE_URL}/updateModule`,
    UPDATE_SUBMODULE: `${API_BASE_URL}/updateSubmodule`,
    UPDATE_LESSON: `${API_BASE_URL}/updateLesson`,
    UPDATE_EVALUATION_MOMENT: `${API_BASE_URL}/updateEvaluationMoment`,
    UPDATE_PROFESSOR: `${API_BASE_URL}/updateProfessor`,
    UPDATE_STUDENT: `${API_BASE_URL}/updateStudent`,
    UPDATE_ATTENDANCE: `${API_BASE_URL}/updateAttendance`,
    UPDATE_STUDENT_GRADE: `${API_BASE_URL}/updateGradeEvaluationMoment`,
};

export default endpoints;
