<?php

use App\Http\Controllers\AttendanceController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseModuleController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\EvaluationMomentController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\GradeEvaluationMomentController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\ProfessorController;
use App\Http\Controllers\ProfessorInChargeOfLessonController;
use App\Http\Controllers\ProfessorInChargeOfModuleController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubmoduleController;
use App\Http\Middleware\CheckCoordinatorMiddleware;

//------------------AUTH ROUTES--------------------------------------
 Route::post('/login', [AuthController::class, 'login']);
 Route::post('/signup', [AuthController::class, 'register']);
     Route::get('/confirmAdmin/{token}', [ProfessorController::class, 'confirmAdmin']);

 // Rota para verificação de e-mail do professor
 Route::get('/verify-email/{token}', [AuthController::class, 'verifyEmail']);
 
 // Rota para aprovação do registro pelo administrador
 Route::get('/approve-professor/{token}', [AuthController::class, 'approveProfessor']);
//--------------------------------------------------------------------



 // Rotas protegidas com o middleware JWT
Route::middleware(['auth:api'])->group(function () {
  Route::middleware([CheckCoordinatorMiddleware::class, 'auth:api'])->group(function () {
  

    
  //------------------COURSE ROUTES----------------------------------------
     // Create a new course
     Route::post('/addCourses', [CourseController::class, 'store']);
     // Update an existing course by ID
     Route::put('/updateCourse/{id}', [CourseController::class, 'update']);
     // Delete a course by ID
     Route::delete('/deleteCourse/{id}', [CourseController::class, 'destroy']);  
  //----------------------------------------------------------------------

  //------------------ENROLLMENT ROUTES-------------------------------
     // Create a new Enrollment
     Route::post('/enrollStudents', [EnrollmentController::class, 'store']);
     // Update an existing course by ID
     Route::put('/updateEnrollment/{student_id}/{course_id}', [EnrollmentController::class, 'update']);
     // Delete a Enrollment by ID
     Route::delete('/deleteEnrollment/{student_id}/{course_id}', [EnrollmentController::class, 'destroy']);  
  //---------------------------------------------------------------------

    //------------------ASSOCIATE MODULES TO COURSE ROUTES-------------------------------
     // Create a new Enrollment
     Route::post('/associateModulesToCourse', [CourseModuleController::class, 'store']);
     // Update an existing course by ID
     Route::put('/updateModulesCourseAssociation/{student_id}/{course_id}', [CourseModuleController::class, 'update']);
     // Delete a Enrollment by ID
     Route::delete('/deleteModulesCourseAssociation/{student_id}/{course_id}', [CourseModuleController::class, 'destroy']);  
    //---------------------------------------------------------------------


    // Create a new module
    Route::post('/addModules', [ModuleController::class, 'store']);
    // Update an existing module by ID
    Route::put('/updateModule/{id}', [ModuleController::class, 'update']);
    // Delete a module by ID
    Route::delete('/deleteModule/{id}', [ModuleController::class, 'destroy']);
  //-----------------------------------------------------------------------

  //------------------PROFESSOR ROUTES--------------------------------------
    // Create a new Professor
    Route::post('/createProfessor', [ProfessorController::class, 'store']);
    // Update an existing Professor by ID
    Route::put('/updateProfessor/{id}', [ProfessorController::class, 'update']);
    // Delete a Professor by ID
    Route::delete('/deleteProfessor/{id}', [ProfessorController::class, 'destroy']);
  //-----------------------------------------------------------------------

  //------------------PROFESSOR IN CHARGE OF MODULE ROUTES--------------------------------------

    // Create a new ProfessorInChargeOfModule
    Route::post('/associateProfessorToModule', [ProfessorInChargeOfModuleController::class, 'store']);
    // Update an existing ProfessorInChargeOfModule by ID
    Route::put('/updateProfessorInChargeOfModule/{id}', [ProfessorInChargeOfModuleController::class, 'update']);
    // Delete a ProfessorInChargeOfModule by ID
    Route::delete('/deleteProfessorInChargeOfModule/{professor_id}/{module_id}/{course_id}', [ProfessorInChargeOfModuleController::class, 'destroy']);
  //-----------------------------------------------------------------------


  //------------------PROFESSOR IN CHARGE OF LESSON ROUTES--------------------------------------
    // Create a new ProfessorInChargeOfLesson
    Route::post('/createProfessorInChargeOfLesson', [ProfessorInChargeOfLessonController::class, 'store']);
    // Update an existing ProfessorInChargeOfLesson by ID
    Route::put('/updateProfessorInChargeOfLesson/{id}', [ProfessorInChargeOfLessonController::class, 'update']);
    // Delete a ProfessorInChargeOfLesson by ID
    Route::delete('/deleteProfessorInChargeOfLesson/{id}', [ProfessorInChargeOfLessonController::class, 'destroy']);
  //-----------------------------------------------------------------------

  //------------------STUDENT ROUTES--------------------------------------
    // Get all students
    Route::post('/createAndEnroll', [StudentController::class, 'createAndEnroll']);
    // Create a new student
    Route::post('/addStudents', [StudentController::class, 'store']);
    // Update an existing student by ID
    Route::put('/updateStudent/{id}', [StudentController::class, 'update']);
    // Delete a student by ID
    Route::delete('/deleteStudent/{id}', [StudentController::class, 'destroy']);
    // Create a new student and enroll
    Route::post('/addAndEnrollStudent', [StudentController::class, 'addAndEnrollStudent']);
  //-----------------------------------------------------------------------


  //------------------SUBMODULE ROUTES-----------------------------
     // Create a new Submodule
     Route::post('/addSubmodule', [SubmoduleController::class, 'store']);
     // Update an existing Submodule by ID
     Route::put('/updateSubmodule/{id}', [SubmoduleController::class, 'update']);
     // Delete a Submodule by ID
     Route::delete('/deleteSubmodule/{id}', [SubmoduleController::class, 'destroy']);  
  //---------------------------------------------------------------------

  });
















  //------------------COURSE ROUTES----------------------------------------
     // Get all course
     Route::get('/getAllCourses', [CourseController::class, 'index']);
     // Get a specific course by ID
     Route::get('/getCourse/{id}', [CourseController::class, 'show']);

  //----------------------------------------------------------------------


 //------------------ATTENDANCE ROUTES--------------------------------------
    // Get all attendance
    Route::get('/getAttendance', [AttendanceController::class, 'getAttendance']);
    // Get a specific lesson by ID
    Route::get('/Attendance/{lesson_id}/{student_id}', [AttendanceController::class, 'show']);
    // Create a new lesson
    Route::post('/createAttendance', [AttendanceController::class, 'store']);
    // Update an existing lesson by ID
    Route::put('/updateAttendance/{lesson_id}', [AttendanceController::class, 'update']);
    // Delete a student by ID
    Route::delete('/deleteAttendance/{lesson_id}/{student_id}', [AttendanceController::class, 'destroy']);
  //-----------------------------------------------------------------------


  //------------------ENROLLMENT ROUTES-------------------------------
     // Get all Enrollment
     Route::get('/getAllEnrollment', [EnrollmentController::class, 'index']);
     // Get a specific Enrollment by ID
     Route::get('/getEnrollment/{student_id}/{course_id}', [EnrollmentController::class, 'show']);

  //---------------------------------------------------------------------

    //------------------ASSOCIATE MODULES TO COURSE ROUTES-------------------------------
     // Get all Enrollment
     Route::get('/getAllModulesCourseAssociation', [CourseModuleController::class, 'index']);
     // Get a specific Enrollment by ID
     Route::get('/getModulesCourseAssociation/{module_id}/{course_id}', [CourseModuleController::class, 'show']);

     // Get a specific module by ID
     Route::get('/getModulesByCourse', [CourseModuleController::class, 'getModulesByCourse']);

  //---------------------------------------------------------------------

  //------------------EVALUATION MOMENT ROUTES-------------------------------
     // Get all EvaluationMoments
     Route::get('/getAllEvaluationMoments', [EvaluationMomentController::class, 'index']);
     // Get a specific EvaluationMoments by ID
     Route::get('/getEvaluationMoments/{id}', [EvaluationMomentController::class, 'show']);
     // Create a new EvaluationMoments
     Route::post('/addEvaluationMoment', [EvaluationMomentController::class, 'store']);
     // Update an existing EvaluationMoments by ID
     Route::put('/updateEvaluationMoments/{id}', [EvaluationMomentController::class, 'update']);
     // Delete a EvaluationMoments by ID
     Route::delete('/deleteEvaluationMoments/{id}', [EvaluationMomentController::class, 'destroy']);  
     Route::get('/getProfessorEvaluationMoments', [EvaluationMomentController::class, 'getProfessorEvaluationMoments']);
  //---------------------------------------------------------------------

  //------------------GRADE ROUTES---------------------------------------
     // Get all Grade
     Route::get('/getAllGrade', [GradeController::class, 'index']);
     // Get a specific Grade by ID
     Route::get('/getGrade/{id}', [GradeController::class, 'show']);
     // Create a new Grade
     Route::post('/createGrade', [GradeController::class, 'store']);
     // Update an existing Grade by ID
     Route::put('/updateGrade/{id}', [GradeController::class, 'update']);
     // Delete a Grade by ID
     Route::delete('/deleteGrade/{id}', [GradeController::class, 'destroy']);
     Route::get('/getStudentsWithGrades', [GradeController::class, 'getStudentsWithGrades']);
     Route::post('/submitGrades', [GradeController::class, 'submitGrades']);
  //---------------------------------------------------------------------

  //------------------GRADE EVALUATION MOMENT ROUTES---------------------------------------
     Route::get('/getStudentsEvaluationMomentGrades/{evaluation_moment_id}', [GradeEvaluationMomentController::class, 'getStudentsEvaluationMomentGrades']);
     // Get a specific GradeEvaluationMoment by ID
     Route::get('/getGradeEvaluationMoment/{evaluation_moment_id}/{student_id}', [GradeEvaluationMomentController::class, 'show']);
     // Create a new GradeEvaluationMoment
     Route::post('/submitEvaluationMomentGrades', [GradeEvaluationMomentController::class, 'submitEvaluationMomentGrades']);
     // Update an existing GradeEvaluationMoment by ID
     Route::put('/updateGradeEvaluationMoment/{evaluation_moment_id}/{student_id}', [GradeEvaluationMomentController::class, 'update']);
     // Delete a GradeEvaluationMoment by ID
     Route::delete('/deleteGradeEvaluationMoment/{evaluation_moment_id}/{student_id}', [GradeEvaluationMomentController::class, 'destroy']);  
  //---------------------------------------------------------------------



  //------------------LESSON ROUTES--------------------------------------
    // Get all lessons
    Route::get('/getAllLessons', [LessonController::class, 'index']);
    // Get a specific lesson by ID
    Route::get('/getLessonById/{id}', [LessonController::class, 'show']);
    Route::get('/getLessonsOfSubmodule', [LessonController::class, 'getLessonsOfSubmodule']);
    // Create a new lesson
    Route::post('/addLessons', [LessonController::class, 'store']);
    // Create a new lesson and attendance
    Route::post('/addLessonAndAttendance', [LessonController::class, 'addLessonAndAttendance']);
    // Update an existing lesson by ID
    Route::put('/updateLesson/{lessonId}', [LessonController::class, 'update']);
    // Delete a student by ID
    Route::delete('/deleteLesson/{id}', [LessonController::class, 'destroy']);
    Route::get('/getFilteredLessons', [LessonController::class, 'getFilteredLessons']);
  //-----------------------------------------------------------------------

  //------------------MODULE ROUTES--------------------------------------
    // Get all module
    Route::get('/getAllModules', [ModuleController::class, 'index']);
    // Get a specific module by ID
    Route::get('/getModule/{id}', [ModuleController::class, 'show']);
  //-----------------------------------------------------------------------

  //------------------PROFESSOR ROUTES--------------------------------------
    // Get all Professor
    Route::get('/getAllProfessors', [ProfessorController::class, 'index']);
    // Request admin access
    Route::get('/requestAdminAccess', [ProfessorController::class, 'initiateAdminSetting']);
    // Confirm admin status
    // Get a specific Professor by ID
    Route::get('/getProfessor/{id}', [ProfessorController::class, 'show']);

  //-----------------------------------------------------------------------

  //------------------PROFESSOR IN CHARGE OF MODULE ROUTES--------------------------------------
    // Get all ProfessorInChargeOfModule
    Route::get('/getAllProfessorsInChargeOfModules', [ProfessorInChargeOfModuleController::class, 'index']);
    // Get a specific ProfessorInChargeOfModule by ID
    Route::get('/getProfessorInChargeOfModule/{id}', [ProfessorInChargeOfModuleController::class, 'show']);
   // Get submodules of professor
    Route::get('/getSubmodulesOfProfessor', [ProfessorInChargeOfModuleController::class, 'getSubmodulesOfProfessor']);
    Route::get('/getProfessorsInChargeOfModulesByCourse', [ProfessorInChargeOfModuleController::class, 'getProfessorsInChargeOfModulesByCourse']);
    Route::get('/getModulesOfProfessor', [ProfessorInChargeOfModuleController::class, 'getModulesOfProfessor']);
    Route::get('/getCoursesAndModulesOfProfessor', [ProfessorInChargeOfModuleController::class, 'getCoursesAndModulesOfProfessor']);
    Route::get('/getModulesOfCourseOfProfessor', [ProfessorInChargeOfModuleController::class, 'getModulesOfCourseOfProfessor']);
    
  //-----------------------------------------------------------------------


  //------------------PROFESSOR IN CHARGE OF LESSON ROUTES--------------------------------------
    // Get all ProfessorInChargeOfLesson
    Route::get('/getAllProfessorInChargeOfLesson', [ProfessorInChargeOfLessonController::class, 'index']);
    // Get a specific ProfessorInChargeOfLesson by ID
    Route::get('/getProfessorInChargeOfLesson/{id}', [ProfessorInChargeOfLessonController::class, 'show']);
    // Create a new ProfessorInChargeOfLesson
    Route::post('/createProfessorInChargeOfLesson', [ProfessorInChargeOfLessonController::class, 'store']);

  //-----------------------------------------------------------------------

  //------------------STUDENT ROUTES--------------------------------------
    // Get all students
    Route::get('/getStudents', [StudentController::class, 'getStudents']);
    Route::post('/createAndEnroll', [StudentController::class, 'createAndEnroll']);
    // Get filtered students
    Route::get('/students/search', [StudentController::class, 'search']);
    Route::get('/getStudentsByCourse', [StudentController::class, 'getStudentsByCourse']);
    // Get a specific student by ID
    Route::get('/getStudent/{id}', [StudentController::class, 'show']);

  //-----------------------------------------------------------------------


  //------------------SUBMODULE ROUTES-----------------------------
     // Get all Submodule
     Route::get('/getSubModules', [SubmoduleController::class, 'getSubModules']);
     // Get a specific Submodule by ID
     Route::get('/getSubmodule/{id}', [SubmoduleController::class, 'show']);
     Route::get('/getSubmodulesByCourse/{course_id}', [SubmoduleController::class, 'getSubmodulesByCourse']);
  //---------------------------------------------------------------------


     Route::post('/logout', [AuthController::class, 'logout']);
     Route::post('/refresh', [AuthController::class, 'refresh']);
     Route::get('/me', [AuthController::class, 'me']);
 });


 