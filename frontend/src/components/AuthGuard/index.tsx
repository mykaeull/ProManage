import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Loading } from "../Loading";
import { Title } from "../Title";
import "./index.scss";
import { Button } from "../Button";
import { HiOutlineUser } from "react-icons/hi";
import { toast } from "react-hot-toast";
import { ThemeContext } from "../../contexts/ThemeContext";
import DrawerMenu from "../DrawerMenu";
import { GoProjectSymlink } from "react-icons/go";
import { FaUsers } from "react-icons/fa6";
import { FaChartBar } from "react-icons/fa";

interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("username");
    const navigate = useNavigate();

    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        const savedLogin = sessionStorage.getItem("login");
        if (savedLogin) {
            setUsername(savedLogin);
        }
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        } else {
            try {
                const decodedToken: any = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                // console.log(decodedToken.exp);
                // console.log(currentTime);
                if (decodedToken.exp < currentTime) {
                    localStorage.removeItem("token");
                    toast.error("Sessão expirada.");
                    navigate("/login");
                } else {
                    setLoading(false);
                }
            } catch (error) {
                localStorage.removeItem("token");
                toast.error("Ocorreu um erro interno.");
                navigate("/login");
            }
        }
    }, [navigate]);

    const handleDesconnect = () => {
        sessionStorage.removeItem("login");
        localStorage.removeItem("token");
        toast.success("Desconectado!");
        navigate("/login");
    };

    const menuItems = [
        {
            label: "Projetos",
            urlNavigate: "/projects",
            icon: <GoProjectSymlink />,
        },
        {
            label: "Usuários",
            urlNavigate: "/projects/users",
            icon: <FaUsers />,
        },
        {
            label: "Dashboard",
            urlNavigate: "/dashboard",
            icon: <FaChartBar />,
        },
    ];

    return (
        <>
            {loading ? (
                <Loading style={{ height: "100vh" }} />
            ) : (
                <div className="container-header">
                    <div className="header">
                        <div className="left-buttons">
                            <DrawerMenu itemList={menuItems} />
                            <Title />
                        </div>
                        <div className="right-buttons">
                            <div className="user-content">
                                <HiOutlineUser
                                    style={{
                                        fontSize: "1.25rem",
                                        color:
                                            theme === "light"
                                                ? "#9ca3af"
                                                : "#e5e7eb",
                                    }}
                                />
                                <h4 style={{ fontWeight: "400" }}>
                                    {username}
                                </h4>
                            </div>

                            <Button
                                size="sm"
                                color="secondary"
                                onClick={handleDesconnect}
                            >
                                Desconectar
                            </Button>
                        </div>
                    </div>
                    {children}
                </div>
            )}
        </>
    );
};

export default AuthGuard;
