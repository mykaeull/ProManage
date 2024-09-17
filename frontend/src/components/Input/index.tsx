import { InputHTMLAttributes, useState, forwardRef, useContext } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import "./index.scss";
import { ThemeContext } from "../../contexts/ThemeContext";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
    value?: string;
    type?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        { placeholder, value, type, onFocus, onBlur, onChange, ...props },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const [isPasswordOpen, setIsPasswordOpen] = useState(false);

        const { theme } = useContext(ThemeContext);

        const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            if (onFocus) onFocus(event);
        };

        const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            if (onBlur) onBlur(event);
        };

        return (
            <div className="input-container">
                {(isFocused || value) && (
                    <span
                        style={{
                            backgroundColor:
                                theme === "light" ? "#f3f4f6" : "#1f2937",
                        }}
                        className="input-label"
                    >
                        {placeholder}
                    </span>
                )}
                {type === "password" && (
                    <>
                        {isPasswordOpen ? (
                            <HiEyeOff
                                size={24}
                                className="password-eye"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsPasswordOpen(false);
                                }}
                            />
                        ) : (
                            <HiEye
                                size={24}
                                className="password-eye"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsPasswordOpen(true);
                                }}
                            />
                        )}
                    </>
                )}

                <input
                    className="input-content"
                    style={{
                        backgroundColor:
                            theme === "light" ? "#f3f4f6" : "#1f2937",
                        color: theme === "light" ? "#6b7280" : "#e5e7eb",
                    }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    type={type === "password" && isPasswordOpen ? "text" : type}
                    placeholder={isFocused ? "" : placeholder}
                    {...props}
                />
            </div>
        );
    }
);

Input.displayName = "Input";
