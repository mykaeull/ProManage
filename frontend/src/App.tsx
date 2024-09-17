import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeToggleButton from "./components/ThemeToggleButton";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "./components/Toaster";
import Projects from "./pages/Projects";
import UsersPerProject from "./pages/UsersPerProject";
import DashboardPage from "./pages/DashboardPage";

function App() {
    return (
        <ThemeProvider>
            <Router>
                <Toaster />
                <ThemeToggleButton />
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route path="/register" element={<Register />} />

                    <Route path="/projects" element={<Projects />} />

                    <Route
                        path="/projects/users"
                        element={<UsersPerProject />}
                    />

                    <Route path="/dashboard" element={<DashboardPage />} />

                    <Route
                        path="*"
                        element={
                            <h1 className="not-found-page-title">
                                Página não encontrada. Verifique a URL.
                            </h1>
                        }
                    />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
