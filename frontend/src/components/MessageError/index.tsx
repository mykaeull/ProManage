import { FiAlertTriangle } from "react-icons/fi";
import "./index.scss";

interface MessageErrorProps {
    message: string | undefined;
}

export const MessageError = ({ message }: MessageErrorProps) => {
    return (
        <div className="error-content">
            <FiAlertTriangle color="#d2122e" />
            <span className="error-text">{message}</span>
        </div>
    );
};
