import { ThemeContext } from "../../contexts/ThemeContext";
import React, { useContext, useEffect } from "react";
import "./index.scss";
import { HiMoon, HiSun } from "react-icons/hi";

const ThemeToggleButton: React.FC = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    useEffect(() => {
        if (theme === "dark") {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }, [theme]);

    return (
        <div className="container-checkbox">
            <input
                type="checkbox"
                id="checkbox"
                className="checkbox"
                onChange={toggleTheme}
                checked={theme === "dark"}
            />
            <label htmlFor="checkbox" className="checkbox-label">
                <HiMoon color="#f1c40f" />
                <HiSun color="#f39c12" />
                <span className="ball"></span>
            </label>
        </div>
    );
};

export default ThemeToggleButton;
