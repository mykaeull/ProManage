import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "../Input";
import { Title } from "../Title";
import * as yup from "yup";
import "./index.scss";
import { Button } from "../Button";
import { MessageError } from "../MessageError";
import { toast } from "react-hot-toast";
import { doRegister } from "../../api/services/AuthService";
import { Dropdown } from "../Dropdown";
import { getRoles } from "../../api/services/RoleService";
import { useNavigate } from "react-router-dom";

const registerSchema = yup.object().shape({
    name: yup.string().required("campo obrigatório"),
    email: yup.string().email("email inválido").required("campo obrigatório"),
    password: yup
        .string()
        .required("campo obrigatória")
        .min(6, "senha deve ter pelo menos 6 caracteres"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), undefined], "senhas devem coincidir")
        .required("campo obrigatório"),
    role: yup.string().required("campo obrigatório"),
});

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
}

export default function RegisterForm() {
    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: yupResolver(registerSchema),
    });

    const navigate = useNavigate();

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const response = await doRegister(
                data.name,
                data.password,
                data.email,
                data.role
            );
            const token = response.data.token;
            const userId = response.data.id;
            const role = response.data.role;

            localStorage.setItem("token", token);
            sessionStorage.setItem("login", data.name);
            sessionStorage.setItem("userId", userId);
            sessionStorage.setItem("role", role);
            toast.success("Usuário registrado com sucesso!");
            reset();
            navigate("/projects");
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                toast.error(
                    "Esse nome de usuário já está em uso. Por favor, escolha outro."
                );
            } else {
                toast.error("Erro ao registrar o usuário. Tente novamente.");
            }
        }
    };

    const nameValue = watch("name", "");
    const emailValue = watch("email", "");
    const passwordValue = watch("password", "");
    const confirmPasswordValue = watch("confirmPassword", "");

    return (
        <div className="container-register">
            <div style={{ marginBottom: "1.5rem" }}>
                <Title />
            </div>

            <h3 className="subtitle">Crie sua conta</h3>

            <form
                className="register-form-content"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div>
                    <Input
                        placeholder="Nome"
                        value={nameValue}
                        {...register("name")}
                    />
                    {errors.name && (
                        <MessageError message={errors.name.message} />
                    )}
                </div>

                <div>
                    <Input
                        placeholder="Email"
                        value={emailValue}
                        {...register("email")}
                    />
                    {errors.email && (
                        <MessageError message={errors.email.message} />
                    )}
                </div>

                <div>
                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <Dropdown
                                {...field}
                                placeholder="Função"
                                fnRequest={getRoles}
                                keyy="key"
                                label="label"
                            />
                        )}
                    />
                    {errors.role && (
                        <MessageError message={errors.role.message} />
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

                <div>
                    <Input
                        placeholder="Confirmar Senha"
                        type="password"
                        value={confirmPasswordValue}
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                        <MessageError
                            message={errors.confirmPassword.message}
                        />
                    )}
                </div>

                <footer className="footer-buttons">
                    <Button
                        type="button"
                        color="secondary"
                        size="lg"
                        onClick={() => navigate("/login")}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" size="lg">
                        Confirmar
                    </Button>
                </footer>
            </form>
        </div>
    );
}
