import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "../Input";
import { Title } from "../Title";
import * as yup from "yup";
import "./index.scss";
import { Button } from "../Button";
import { MessageError } from "../MessageError";
import { toast } from "react-hot-toast";
import { doLogin } from "../../api/services/AuthService";
import { useNavigate } from "react-router-dom";

const loginSchema = yup.object().shape({
    login: yup.string().required("Campo obrigatório"),
    password: yup
        .string()
        .required("Campo obrigatória")
        .min(6, "Senha deve ter pelo menos 6 caracteres"),
    rememberMe: yup.boolean(),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
    });

    const navigate = useNavigate();

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await doLogin(data.login, data.password);
            const token = response.data.token;
            const userId = response.data.id;
            const role = response.data.role;

            localStorage.setItem("token", token);
            sessionStorage.setItem("login", data.login);
            sessionStorage.setItem("userId", userId);
            sessionStorage.setItem("role", role);
            toast.success("Logado com sucesso!");
            reset();
            navigate("/projects");
        } catch {
            console.log("error");
            toast.error("Login ou senha inválida.");
        }
    };

    const loginValue = watch("login", "");
    const passwordValue = watch("password", "");

    return (
        <div className="container-login">
            <Title />

            <form
                className="login-form-content"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div>
                    <Input
                        placeholder="Login"
                        value={loginValue}
                        {...register("login")}
                    />
                    {errors.login && (
                        <MessageError message={errors.login.message} />
                    )}
                </div>

                <div>
                    <Input
                        placeholder="Senha"
                        type="password"
                        value={passwordValue}
                        {...register("password")}
                    />
                    {errors.password && (
                        <MessageError message={errors.password.message} />
                    )}
                </div>

                <footer className="footer-buttons">
                    <Button
                        type="button"
                        color="secondary"
                        size="lg"
                        onClick={() => navigate("/register")}
                    >
                        Criar Conta
                    </Button>
                    <Button type="submit" size="lg">
                        Acessar
                    </Button>
                </footer>
            </form>
        </div>
    );
}
