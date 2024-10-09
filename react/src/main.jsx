import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import VerifyEmail from "./pages/AwaitAdminApprovalPage.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import StudentsList from "./pages/studentsPages/StudentsList.jsx";
import PrivateRoute from "./auth/PrivateRoute.jsx";
import AddStudents from "./pages/studentsPages/AddStudents.jsx";
import AddCourse from "./pages/coursesPages/AddCourse.jsx";
import CoursesList from "./pages/coursesPages/CoursesList.jsx";
import AddModule from "./pages/modulesPages/AddModule.jsx";
import ModulesList from "./pages/modulesPages/ModulesList.jsx";
import AddSubModule from "./pages/modulesPages/AddSubModule.jsx";
import SubModulesList from "./pages/modulesPages/SubModulesList.jsx";
import AddLesson from "./pages/lessonPages/AddLessons.jsx";
import LessonsList from "./pages/lessonPages/LessonsList.jsx";
import EnrollStudents from "./pages/studentsPages/EnrollStudents.jsx";
import AssociateModulesToCourse from "./pages/modulesPages/AssociateModulesToCourse.jsx";
import AddEvaluationMoment from "./pages/evaluationMomentsPages/AddEvaluationMoment.jsx";
import EvaluationMomentsList from "./pages/evaluationMomentsPages/EvaluationMomentsList.jsx";
import AddAttendance from "./pages/lessonPages/AddAttendance.jsx";
import AttendanceList from "./pages/lessonPages/AttendanceList.jsx";
import EvaluateEvaluationMoments from "./pages/evaluationMomentsPages/evaluateEvaluationsMoments.jsx";
import AssociateProfessorToModule from "./pages/modulesPages/AssociateModuleToProfessor.jsx";
import ProfessorsInChargeOfModulesList from "./pages/modulesPages/ProfessorsInChargeOfModulesList.jsx";
import PrintLesson from "./pages/lessonPages/PrintLesson.jsx";
import EvaluationMomentsGradesList from "./pages/evaluationMomentsPages/EvaluationMomentsGradesList.jsx";
import GradesList from "./pages/grades/GradesList.jsx";
import AddProfessor from "./pages/professorPages/AddProfessor.jsx";
import ProfessorsList from "./pages/professorPages/ProfessorsList.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <AuthProvider>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/adminPanel" element={<AdminPanel />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route
                        path="/addStudents"
                        element={
                            <PrivateRoute>
                                <AddStudents />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/students"
                        element={
                            <PrivateRoute>
                                <StudentsList />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/addCourse"
                        element={
                            <PrivateRoute>
                                <AddCourse />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/courses"
                        element={
                            <PrivateRoute>
                                <CoursesList />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/addModule"
                        element={
                            <PrivateRoute>
                                <AddModule />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/modules"
                        element={
                            <PrivateRoute>
                                <ModulesList />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/associateModulesToCourse"
                        element={
                            <PrivateRoute>
                                <AssociateModulesToCourse />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/professorsInChargeOfModules"
                        element={
                            <PrivateRoute>
                                <ProfessorsInChargeOfModulesList />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/addSubmodule"
                        element={
                            <PrivateRoute>
                                <AddSubModule />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/subModules"
                        element={
                            <PrivateRoute>
                                <SubModulesList />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/addLesson"
                        element={
                            <PrivateRoute>
                                <AddLesson />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/lessons"
                        element={
                            <PrivateRoute>
                                <LessonsList />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/enrollStudents"
                        element={
                            <PrivateRoute>
                                <EnrollStudents />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/addEvaluationMoment"
                        element={
                            <PrivateRoute>
                                <AddEvaluationMoment />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/evaluationMoments"
                        element={
                            <PrivateRoute>
                                <EvaluationMomentsList />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/evaluateEvaluationMoments"
                        element={
                            <PrivateRoute>
                                <EvaluateEvaluationMoments />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/evaluationMomentsGradesList"
                        element={
                            <PrivateRoute>
                                <EvaluationMomentsGradesList />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/addAttendance"
                        element={
                            <PrivateRoute>
                                <AddAttendance />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/attendance"
                        element={
                            <PrivateRoute>
                                <AttendanceList />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/associateProfessorToModule"
                        element={
                            <PrivateRoute>
                                <AssociateProfessorToModule />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route
                        path="/print-lesson"
                        element={
                            <PrivateRoute>
                                <PrintLesson />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/grades"
                        element={
                            <PrivateRoute>
                                <GradesList />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/addProfessor"
                        element={
                            <PrivateRoute>
                                <AddProfessor />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/professors"
                        element={
                            <PrivateRoute>
                                <ProfessorsList />
                            </PrivateRoute>
                        }
                    />
                </Route>
            </Routes>
        </AuthProvider>
    </BrowserRouter>
);
