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
use App\Http\Middleware\EnsureTokenIsValid;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubmoduleController;

//------------------AUTH ROUTES--------------------------------------
 Route::post('/login', [AuthController::class, 'login']);
 Route::post('/signup', [AuthController::class, 'register']);
 
 // Rota para verificação de e-mail do professor
 Route::get('/verify-email/{token}', [AuthController::class, 'verifyEmail']);
 
 // Rota para aprovação do registro pelo administrador
 Route::get('/approve-professor/{token}', [AuthController::class, 'approveProfessor']);
//--------------------------------------------------------------------



 // Rotas protegidas com o middleware JWT
Route::middleware([EnsureTokenIsValid::class, 'auth:api'])->group(function () {

  //------------------COURSE ROUTES----------------------------------------
     // Get all course
     Route::get('/getAllCourses', [CourseController::class, 'index']);
     // Get a specific course by ID
     Route::get('/getCourse/{id}', [CourseController::class, 'show']);
     // Create a new course
     Route::post('/addCourses', [CourseController::class, 'store']);
     // Update an existing course by ID
     Route::put('/editCourse/{id}', [CourseController::class, 'update']);
     // Delete a course by ID
     Route::delete('/deleteCourse/{id}', [CourseController::class, 'destroy']);  
  //----------------------------------------------------------------------











     Route::post('/logout', [AuthController::class, 'logout']);
     Route::post('/refresh', [AuthController::class, 'refresh']);
     Route::get('/me', [AuthController::class, 'me']);
 });


  //------------------ATTENDANCE ROUTES--------------------------------------
    // Get all attendance
    Route::get('/getAllAttendances', [AttendanceController::class, 'index']);
    // Get a specific lesson by ID
    Route::get('/Attendance/{lesson_id}/{student_id}', [AttendanceController::class, 'show']);
    // Create a new lesson
    Route::post('/createAttendance', [AttendanceController::class, 'store']);
    // Update an existing lesson by ID
    Route::put('/editAttendance/{lesson_id}/{student_id}', [AttendanceController::class, 'update']);
    // Delete a student by ID
    Route::delete('/deleteAttendance/{lesson_id}/{student_id}', [AttendanceController::class, 'destroy']);
  //-----------------------------------------------------------------------


  //------------------ENROLLMENT ROUTES-------------------------------
     // Get all Enrollment
     Route::get('/getAllEnrollment', [EnrollmentController::class, 'index']);
     // Get a specific Enrollment by ID
     Route::get('/getEnrollment/{student_id}/{course_id}', [EnrollmentController::class, 'show']);
     // Create a new Enrollment
     Route::post('/createEnrollment', [EnrollmentController::class, 'store']);
     // Update an existing course by ID
     Route::put('/editEnrollment/{student_id}/{course_id}', [EnrollmentController::class, 'update']);
     // Delete a Enrollment by ID
     Route::delete('/deleteEnrollment/{student_id}/{course_id}', [EnrollmentController::class, 'destroy']);  
  //---------------------------------------------------------------------

  //------------------EVALUATION MOMENT ROUTES-------------------------------
     // Get all EvaluationMoments
     Route::get('/getAllEvaluationMoments', [EvaluationMomentController::class, 'index']);
     // Get a specific EvaluationMoments by ID
     Route::get('/getEvaluationMoments/{id}', [EvaluationMomentController::class, 'show']);
     // Create a new EvaluationMoments
     Route::post('/createEvaluationMoments', [EvaluationMomentController::class, 'store']);
     // Update an existing EvaluationMoments by ID
     Route::put('/editEvaluationMoments/{id}', [EvaluationMomentController::class, 'update']);
     // Delete a EvaluationMoments by ID
     Route::delete('/deleteEvaluationMoments/{id}', [EvaluationMomentController::class, 'destroy']);  
  //---------------------------------------------------------------------

  //------------------GRADE ROUTES---------------------------------------
     // Get all Grade
     Route::get('/getAllGrade', [GradeController::class, 'index']);
     // Get a specific Grade by ID
     Route::get('/getGrade/{id}', [GradeController::class, 'show']);
     // Create a new Grade
     Route::post('/createGrade', [GradeController::class, 'store']);
     // Update an existing Grade by ID
     Route::put('/editGrade/{id}', [GradeController::class, 'update']);
     // Delete a Grade by ID
     Route::delete('/deleteGrade/{id}', [GradeController::class, 'destroy']);  
  //---------------------------------------------------------------------

  //------------------GRADE EVALUATION MOMENT ROUTES---------------------------------------
     // Get all GradeEvaluationMoment
     Route::get('/getAllGradeEvaluationMoment', [GradeEvaluationMomentController::class, 'index']);
     // Get a specific GradeEvaluationMoment by ID
     Route::get('/getGradeEvaluationMoment/{evaluation_moment_id}/{student_id}', [GradeEvaluationMomentController::class, 'show']);
     // Create a new GradeEvaluationMoment
     Route::post('/createGradeEvaluationMoment', [GradeEvaluationMomentController::class, 'store']);
     // Update an existing GradeEvaluationMoment by ID
     Route::put('/editGradeEvaluationMoment/{evaluation_moment_id}/{student_id}', [GradeEvaluationMomentController::class, 'update']);
     // Delete a GradeEvaluationMoment by ID
     Route::delete('/deleteGradeEvaluationMoment/{evaluation_moment_id}/{student_id}', [GradeEvaluationMomentController::class, 'destroy']);  
  //---------------------------------------------------------------------








  //------------------LESSON ROUTES--------------------------------------
    // Get all lessons
    Route::get('/getAllLessons', [LessonController::class, 'index']);
    // Get a specific lesson by ID
    Route::get('/getLesson/{id}', [LessonController::class, 'show']);
    // Create a new lesson
    Route::post('/createLesson', [LessonController::class, 'store']);
    // Update an existing lesson by ID
    Route::put('/editLesson/{id}', [LessonController::class, 'update']);
    // Delete a student by ID
    Route::delete('/deleteLesson/{id}', [LessonController::class, 'destroy']);
  //-----------------------------------------------------------------------

  //------------------MODULE ROUTES--------------------------------------
    // Get all module
    Route::get('/getAllModules', [ModuleController::class, 'index']);
    // Get a specific module by ID
    Route::get('/getModule/{id}', [ModuleController::class, 'show']);
    // Create a new module
    Route::post('/addModules', [ModuleController::class, 'store']);
    // Update an existing module by ID
    Route::put('/editModule/{id}', [ModuleController::class, 'update']);
    // Delete a module by ID
    Route::delete('/deleteModule/{id}', [ModuleController::class, 'destroy']);
  //-----------------------------------------------------------------------

  //------------------PROFESSOR ROUTES--------------------------------------
    // Get all Professor
    Route::get('/getAllProfessors', [ProfessorController::class, 'index']);
    // Get a specific Professor by ID
    Route::get('/getProfessor/{id}', [ProfessorController::class, 'show']);
    // Create a new Professor
    Route::post('/createProfessor', [ProfessorController::class, 'store']);
    // Update an existing Professor by ID
    Route::put('/editProfessor/{id}', [ProfessorController::class, 'update']);
    // Delete a Professor by ID
    Route::delete('/deleteProfessor/{id}', [ProfessorController::class, 'destroy']);
  //-----------------------------------------------------------------------

  //------------------PROFESSOR IN CHARGE OF MODULE ROUTES--------------------------------------
    // Get all ProfessorInChargeOfModule
    Route::get('/getAllProfessorInChargeOfModule', [ProfessorInChargeOfModuleController::class, 'index']);
    // Get a specific ProfessorInChargeOfModule by ID
    Route::get('/getProfessorInChargeOfModule/{id}', [ProfessorInChargeOfModuleController::class, 'show']);
    // Create a new ProfessorInChargeOfModule
    Route::post('/createProfessorInChargeOfModule', [ProfessorInChargeOfModuleController::class, 'store']);
    // Update an existing ProfessorInChargeOfModule by ID
    Route::put('/editProfessorInChargeOfModule/{id}', [ProfessorInChargeOfModuleController::class, 'update']);
    // Delete a ProfessorInChargeOfModule by ID
    Route::delete('/deleteProfessorInChargeOfModule/{id}', [ProfessorInChargeOfModuleController::class, 'destroy']);
  //-----------------------------------------------------------------------


  //------------------PROFESSOR IN CHARGE OF LESSON ROUTES--------------------------------------
    // Get all ProfessorInChargeOfLesson
    Route::get('/getAllProfessorInChargeOfLesson', [ProfessorInChargeOfLessonController::class, 'index']);
    // Get a specific ProfessorInChargeOfLesson by ID
    Route::get('/getProfessorInChargeOfLesson/{id}', [ProfessorInChargeOfLessonController::class, 'show']);
    // Create a new ProfessorInChargeOfLesson
    Route::post('/createProfessorInChargeOfLesson', [ProfessorInChargeOfLessonController::class, 'store']);
    // Update an existing ProfessorInChargeOfLesson by ID
    Route::put('/editProfessorInChargeOfLesson/{id}', [ProfessorInChargeOfLessonController::class, 'update']);
    // Delete a ProfessorInChargeOfLesson by ID
    Route::delete('/deleteProfessorInChargeOfLesson/{id}', [ProfessorInChargeOfLessonController::class, 'destroy']);
  //-----------------------------------------------------------------------

  //------------------STUDENT ROUTES--------------------------------------
    // Get all students
    Route::get('/getAllStudents', [StudentController::class, 'index']);
    // Get filtered students
    Route::get('/students/search', [StudentController::class, 'search']);
    // Get a specific student by ID
    Route::get('/getStudent/{id}', [StudentController::class, 'show']);
    // Create a new student
    Route::post('/addStudents', [StudentController::class, 'store']);
    // Update an existing student by ID
    Route::put('/editStudent/{id}', [StudentController::class, 'update']);
    // Delete a student by ID
    Route::delete('/deleteStudent/{id}', [StudentController::class, 'destroy']);
  //-----------------------------------------------------------------------


  //------------------SUBMODULE ROUTES-----------------------------
     // Get all Submodule
     Route::get('/getAllSubModules', [SubmoduleController::class, 'index']);
     // Get a specific Submodule by ID
     Route::get('/getSubmodule/{id}', [SubmoduleController::class, 'show']);
     // Create a new Submodule
     Route::post('/addSubmodule', [SubmoduleController::class, 'store']);
     // Update an existing Submodule by ID
     Route::put('/editSubmodule/{id}', [SubmoduleController::class, 'update']);
     // Delete a Submodule by ID
     Route::delete('/deleteSubmodule/{id}', [SubmoduleController::class, 'destroy']);  
  //---------------------------------------------------------------------