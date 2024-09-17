import { ButtonHTMLAttributes } from "react";
import "./index.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    color?: "primary" | "secondary" | "destructive";
    size?: "sm" | "md" | "lg" | "icon";
    icon?: React.ReactNode;
}

export const Button = ({
    children,
    color = "primary",
    size = "md",
    icon,
    ...props
}: ButtonProps) => {
    return (
        <button className={`button-content ${color} ${size}`} {...props}>
            {icon && icon}
            {children}
        </button>
    );
};
