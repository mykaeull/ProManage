import { formatDate } from "../../utils";
import { useEffect, useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import { Button } from "../Button";
import { Loading } from "../Loading";
import { Table } from "../Table";
import { HiOutlinePlusSm } from "react-icons/hi";
import { toast } from "react-hot-toast";
import "./index.scss";
import { ModalBox, useModal } from "../Modal";
import { ProjectForm } from "../ProjectForm";
import { LuPencilLine } from "react-icons/lu";
import {
    deleteProject,
    getProjects,
    // getProjects,
    getProjectsPerUser,
} from "../../api/services/ProjectService";
import InputFileUpload from "../UploadProjectsFile";
import Tooltip from "@mui/material/Tooltip";

interface DataProps {
    name: string;
    description: string;
    initial_date: string;
    final_date: string;
    status: string;
    id: string | number;
}

interface DeleteProjectModalProps {
    id: number | string;
}

export default function ProjectsTable() {
    const [data, setData] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const columns = [
        { header: "NOME", accessor: "name" },
        { header: "DESCRIÇÃO", accessor: "description" },
        { header: "DATA INICIAL", accessor: "initial_date" },
        { header: "DATA FINAL", accessor: "final_date" },
        { header: "STATUS", accessor: "status" },
    ];

    useEffect(() => {
        setLoading(true);
        const fetchProjectsData = async () => {
            try {
                const role = sessionStorage.getItem("role");
                let response;

                if (role === "Gerente") {
                    response = await getProjects({
                        page: page,
                        pageSize: pageSize,
                    });
                } else {
                    const userId = sessionStorage.getItem("userId");
                    response = await getProjectsPerUser(Number(userId), {
                        page: page,
                        pageSize: pageSize,
                    });
                }

                const formatedData = response.data.map((d: DataProps) => {
                    return {
                        name: d.name,
                        description: d.description,
                        initial_date: formatDate(d.initial_date),
                        final_date: formatDate(d.final_date),
                        status: d.status,
                        id: d.id,
                    };
                });

                setData(formatedData);
                setTotalData(response.totalData);

                if (formatedData.length === 0 && page > 0) {
                    setPage(page - 1);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching protected data:", error);
                setLoading(false);
            }
        };
        fetchProjectsData();
    }, [refresh, page, pageSize]);

    async function handleDeleteProject(id: number | string) {
        try {
            await deleteProject(id);
            toast.success("Projeto deletado!");
            if (data.length === 1 && page > 0) {
                setPage(page - 1);
            } else {
                setRefresh((prev) => !prev);
            }
        } catch {
            console.log("error");
            toast.error("Houve um erro ao deletar o projeto.");
        }
    }

    const DeleteProjectButton = (openModal: () => void) => {
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

    const DeleteProjectModal = ({ id }: DeleteProjectModalProps) => {
        const { handleClose } = useModal();
        return (
            <>
                <h3 style={{ marginBottom: "1.5rem" }}>Deletar projeto</h3>
                <p style={{ textAlign: "justify" }}>
                    Você está prestes a deletar o projeto. Essa é uma ação que
                    não tem volta. Deseja realmente deletar?
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
                        onClick={() => handleDeleteProject(id)}
                    >
                        Confirmar
                    </Button>
                </footer>
            </>
        );
    };

    const EditProjectButton = (openModal: () => void) => {
        return (
            <Tooltip
                title={<span style={{ fontSize: "0.875rem" }}>Editar</span>}
                arrow
            >
                <div>
                    <Button
                        size="icon"
                        color="secondary"
                        icon={<LuPencilLine color="#49B4BB" size={16} />}
                        onClick={openModal}
                    />
                </div>
            </Tooltip>
        );
    };

    const ExtraColumnComponent = (row: any) => {
        return (
            <div className="table-extra-column">
                <ModalBox modalButton={EditProjectButton}>
                    <ProjectForm refreshList={setRefresh} data={row} />
                </ModalBox>
                <ModalBox
                    modalButton={
                        row.status === "Em andamento"
                            ? () => (
                                  <Button
                                      size="icon"
                                      color="secondary"
                                      icon={<HiOutlineX size={16} />}
                                      disabled
                                  />
                              )
                            : DeleteProjectButton
                    }
                >
                    <DeleteProjectModal id={row.id} />
                </ModalBox>
            </div>
        );
    };

    const NewProjectButton = (openModal: () => void) => {
        return (
            <Button
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
                Novo Projeto
            </Button>
        );
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2rem",
                        alignItems: "center",
                    }}
                >
                    <div style={{ width: "15.625rem" }}>
                        <InputFileUpload refreshList={setRefresh} />
                    </div>
                    <div className="container-project-table">
                        <div className="title-project-table">
                            <h2>Lista de Projetos</h2>
                            <ModalBox modalButton={NewProjectButton}>
                                <ProjectForm refreshList={setRefresh} />
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
                            emptyTableText="Sem projetos cadastrados."
                        />
                    </div>
                </div>
            )}
        </>
    );
}
