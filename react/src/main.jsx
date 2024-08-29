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

                    <Route path="/verify-email" element={<VerifyEmail />} />
                </Route>
            </Routes>
        </AuthProvider>
    </BrowserRouter>
);
