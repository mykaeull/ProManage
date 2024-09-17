import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import "./index.scss";
import { Button } from "../Button";
import { MessageError } from "../MessageError";
import { toast } from "react-hot-toast";
import { Dropdown } from "../Dropdown";
import { useModal } from "../Modal";
import { getUsers } from "../../api/services/UserService";
import { createLinkUserToProject } from "../../api/services/ProjectService";

const projectUsersScheme = yup.object().shape({
    user: yup.string().required("Campo obrigatório"),
});

type ProjectUsersFormData = yup.InferType<typeof projectUsersScheme>;

interface ProjectUsersFormProps {
    refreshList: any;
    id: number | string | null;
}

export default function ProjectUsersForm({
    refreshList,
    id,
}: ProjectUsersFormProps) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProjectUsersFormData>({
        resolver: yupResolver(projectUsersScheme),
    });

    const { handleClose } = useModal();

    const onSubmit = async (data: ProjectUsersFormData) => {
        try {
            const response = await createLinkUserToProject(
                Number(id),
                Number(data.user)
            );

            if (response.status === 208) {
                toast.error("Esse integrante já está vinculado ao projeto.");
                return;
            }

            toast.success("Integrante vinculado com sucesso!");
            reset();
            handleClose();
            if (refreshList) refreshList((prev: any) => !prev);
        } catch {
            console.log("error");
            toast.error("Erro ao alocar Usuário em Projeto.");
        }
    };

    return (
        <div className="container-project-form">
            <h3 className="subtitle-project-form">
                Adicionar integrante ao projeto selecionado
            </h3>

            <form
                className="register-form-content"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="register-form-row">
                    <Controller
                        name="user"
                        control={control}
                        render={({ field }) => (
                            <Dropdown
                                {...field}
                                placeholder="Selecione um integrante"
                                fnRequest={getUsers}
                                keyy="id"
                                label="name"
                            />
                        )}
                    />
                    {errors.user && (
                        <MessageError message={errors.user.message} />
                    )}
                </div>

                <footer className="footer-buttons-project-form">
                    <Button
                        type="button"
                        color="secondary"
                        size="lg"
                        onClick={handleClose}
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
