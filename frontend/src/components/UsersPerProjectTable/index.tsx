import { useEffect, useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import { Button } from "../Button";
import { Loading } from "../Loading";
import { Table } from "../Table";
import { HiOutlinePlusSm } from "react-icons/hi";
import { toast } from "react-hot-toast";
import "./index.scss";
import { ModalBox, useModal } from "../Modal";
import {
    deleteUserFromProject,
    getProjects,
    getProjectsPerUser,
    // getProjects,
    getUsersPerProject,
} from "../../api/services/ProjectService";
import { Dropdown } from "../Dropdown";
import ProjectUsersForm from "../ProjectUsersForm";
import Tooltip from "@mui/material/Tooltip";

interface DataProps {
    name: string;
    email: string;
    role: string;
    id: string | number;
}

interface DeleteUserFromProjectModalProps {
    id: number | string;
}

export default function UsersPerProjectTable() {
    const [data, setData] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [projectId, setProjectId] = useState<number | string | null>(null);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const columns = [
        { header: "NOME", accessor: "name" },
        { header: "EMAIL", accessor: "email" },
        { header: "Função", accessor: "role" },
    ];

    useEffect(() => {
        setLoading(true);
        const fetchProjectsData = async () => {
            try {
                const response = await getUsersPerProject(Number(projectId), {
                    page: page,
                    pageSize: pageSize,
                });
                const formatedData = response.data.map((d: DataProps) => {
                    return {
                        name: d.name,
                        email: d.email,
                        role: d.role,
                        id: d.id,
                    };
                });

                setData(formatedData);
                setTotalData(response.totalData);
                if (formatedData.length === 0 && page > 0) {
                    setPage(page - 1);
                }
            } catch (error) {
                console.error("Error fetching protected data:", error);
            }
        };
        if (projectId) fetchProjectsData();
        setLoading(false);
    }, [refresh, projectId, page, pageSize]);

    async function handleDeleteUserFromProject(id: number | string) {
        try {
            await deleteUserFromProject(Number(projectId), id);
            toast.success("Integrante removido do projeto!");
            if (data.length === 1 && page > 0) {
                setPage(page - 1);
            } else {
                setRefresh((prev) => !prev);
            }
        } catch {
            console.log("error");
            toast.error("Houve um erro ao remover o integrante do projeto.");
        }
    }

    const DeleteUserFromProjectButton = (openModal: () => void) => {
        return (
            <Tooltip
                title={<span style={{ fontSize: "0.875rem" }}>Deletar</span>}
                arrow
            >
                <div>
                    <Button
                        size="icon"
                        color="secondary"
                        icon={<HiOutlineX color="#49B4BB" size={16} />}
                        onClick={openModal}
                    />
                </div>
            </Tooltip>
        );
    };

    const DeleteUserFromProjectModal = ({
        id,
    }: DeleteUserFromProjectModalProps) => {
        const { handleClose } = useModal();
        return (
            <>
                <h3 style={{ marginBottom: "1.5rem" }}>Remover integrante</h3>
                <p style={{ textAlign: "justify" }}>
                    Você está prestes a remover o integrante do projeto
                    selecionado. Essa é uma ação que não tem volta. Deseja
                    realmente removê-lo?
                </p>
                <footer className="footer-buttons-project-table">
                    <Button
                        type="button"
                        color="secondary"
                        size="lg"
                        onClick={handleClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        size="lg"
                        color="destructive"
                        onClick={() => {
                            handleDeleteUserFromProject(id);
                            handleClose();
                        }}
                    >
                        Confirmar
                    </Button>
                </footer>
            </>
        );
    };

    const ExtraColumnComponent = (row: any) => {
        return (
            <div className="table-extra-column">
                <ModalBox modalButton={DeleteUserFromProjectButton}>
                    <DeleteUserFromProjectModal id={row.id} />
                </ModalBox>
            </div>
        );
    };

    const NewProjectButton = (openModal: () => void) => {
        return (
            <Button
                disabled={projectId === null}
                onClick={openModal}
                style={{
                    width: "11.25rem",
                    padding: "0.375rem 0.75rem",
                }}
                icon={
                    <HiOutlinePlusSm
                        style={{
                            width: "1.5rem",
                            height: "1.5rem",
                        }}
                    />
                }
            >
                Novo Integrante
            </Button>
        );
    };

    const role = sessionStorage.getItem("role");
    const userId = sessionStorage.getItem("userId");

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div className="container-project-table">
                    <div className="title-user-table">
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.5rem",
                            }}
                        >
                            <h2>Lista de Integrantes no Projeto:</h2>
                            <div style={{ width: "15rem" }}>
                                <Dropdown
                                    isClearable={false}
                                    placeholder="Selecione um projeto"
                                    value={projectId}
                                    onChange={(value) => setProjectId(value)}
                                    keyy="id"
                                    label="name"
                                    fnRequest={
                                        role === "Gerente"
                                            ? getProjects
                                            : getProjectsPerUser
                                    }
                                    customFnRequestProp={
                                        role === "Gerente" ? null : userId
                                    }
                                />
                            </div>
                        </div>
                        <ModalBox modalButton={NewProjectButton}>
                            <ProjectUsersForm
                                refreshList={setRefresh}
                                id={projectId}
                            />
                        </ModalBox>
                    </div>
                    <Table
                        columns={columns}
                        data={data}
                        page={page}
                        setPage={setPage}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        totalData={totalData}
                        extraColumn={ExtraColumnComponent}
                        emptyTableText="Sem integrantes no projeto selecionado."
                    />
                </div>
            )}
        </>
    );
}
