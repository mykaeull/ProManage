import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./index.scss";
import { Button } from "../Button";
import { Dropdown } from "../Dropdown";
import {
    createProject,
    editProject,
    getStatus,
} from "../../api/services/ProjectService";
import { useModal } from "../Modal";
import { toast } from "react-hot-toast";
import { MessageError } from "../MessageError";
import { Input } from "../Input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
import { formatDateFromDb } from "../../utils";

const projectSchema = yup.object().shape({
    name: yup.string().required("Campo obrigatório"),
    description: yup.string().required("Campo obrigatório"),
    initial_date: yup.date().required("Campo obrigatório"),
    final_date: yup
        .date()
        .required("Campo obrigatório")
        .min(
            yup.ref("initial_date"),
            "A data final deve ser maior ou igual à data inicial"
        ),
    status: yup.string().required("Campo obrigatório"),
});

interface ProjectFormData {
    name: string;
    description: string;
    initial_date: Date;
    final_date: Date;
    status: string;
    id?: string | number;
}

interface ProjectFormProps {
    refreshList?: any;
    data?: ProjectFormData;
}

export const ProjectForm = ({ refreshList, data }: ProjectFormProps) => {
    const { handleClose } = useModal();

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<ProjectFormData>({
        resolver: yupResolver(projectSchema),
        defaultValues: {
            name: data?.name || "",
            description: data?.description || "",
            initial_date: data?.initial_date
                ? formatDateFromDb(data.initial_date.toString())
                : undefined,
            final_date: data?.final_date
                ? formatDateFromDb(data.final_date.toString())
                : undefined,
            status: data?.status || "",
        },
    });

    useEffect(() => {
        if (data) {
            setValue("name", data.name);
            setValue("description", data.description);
            setValue(
                "initial_date",
                formatDateFromDb(data.initial_date.toString())
            );
            setValue(
                "final_date",
                formatDateFromDb(data.final_date.toString())
            );
            setValue("status", data.status);
            setValue("id", data.id);
        }
    }, [data, setValue]);

    const onSubmit = async (formData: ProjectFormData) => {
        try {
            const formattedInitialDate = format(
                formData.initial_date,
                "yyyy-MM-dd"
            );
            const formattedFinalDate = format(
                formData.final_date,
                "yyyy-MM-dd"
            );

            const userId = sessionStorage.getItem("userId");

            if (data) {
                await editProject(Number(formData.id), {
                    ...formData,
                    initial_date: formattedInitialDate,
                    final_date: formattedFinalDate,
                });
                toast.success("Projeto editado com sucesso!");
            } else {
                await createProject({
                    ...formData,
                    initial_date: formattedInitialDate,
                    final_date: formattedFinalDate,
                    userId: Number(userId),
                });
                toast.success("Projeto criado com sucesso!");
            }

            reset();
            handleClose();
            if (refreshList) refreshList((prev: any) => !prev);
        } catch {
            toast.error("Houve um erro ao salvar o projeto.");
        }
    };

    return (
        <div className="container-project-form">
            <h3 className="subtitle-project-form">
                {data ? "Editar Projeto" : "Novo Projeto"}
            </h3>

            <form
                className="register-form-content"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="register-form-row">
                    <Input placeholder="Nome" {...register("name")} />
                    {errors.name && (
                        <MessageError message={errors.name.message} />
                    )}
                </div>

                <div className="register-form-row">
                    <Input
                        placeholder="Descrição"
                        {...register("description")}
                    />
                    {errors.description && (
                        <MessageError message={errors.description.message} />
                    )}
                </div>

                <div className="register-form-row">
                    <Controller
                        name="initial_date"
                        control={control}
                        render={({ field }) => (
                            <div className="date-picker-wrapper">
                                <DatePicker
                                    placeholderText="Data inicial"
                                    selected={field.value}
                                    onChange={(date) => field.onChange(date)}
                                    dateFormat="dd/MM/yyyy"
                                    className="date-picker"
                                />
                                <FaCalendarAlt
                                    size={16}
                                    className="calendar-icon"
                                />
                            </div>
                        )}
                    />
                    {errors.initial_date && (
                        <MessageError message={errors.initial_date.message} />
                    )}
                </div>

                <div className="register-form-row">
                    <Controller
                        name="final_date"
                        control={control}
                        render={({ field }) => (
                            <div className="date-picker-wrapper">
                                <DatePicker
                                    placeholderText="Data final"
                                    selected={field.value}
                                    onChange={(date) => field.onChange(date)}
                                    dateFormat="dd/MM/yyyy"
                                    className="date-picker"
                                />
                                <FaCalendarAlt
                                    size={16}
                                    className="calendar-icon"
                                />
                            </div>
                        )}
                    />
                    {errors.final_date && (
                        <MessageError message={errors.final_date.message} />
                    )}
                </div>

                <div className="register-form-row">
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Dropdown
                                {...field}
                                placeholder="Status"
                                fnRequest={getStatus}
                                keyy="key"
                                label="label"
                            />
                        )}
                    />
                    {errors.status && (
                        <MessageError message={errors.status.message} />
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
                        {data ? "Salvar" : "Confirmar"}
                    </Button>
                </footer>
            </form>
        </div>
    );
};
