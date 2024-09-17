import api from "../api";

interface ProjectProps {
    name: string;
    description: string;
    initial_date: string;
    final_date: string;
    status: string;
    userId?: number;
}

interface Filters {
    page: number | string;
    pageSize: number | string;
}

export async function getProjects(filters?: Filters) {
    const projectsUrl = "/projects";
    const response = await api.get(projectsUrl, {
        params: {
            ...filters,
        },
    });
    return response.data;
}

export async function getUsersPerProject(
    projectId: string | number,
    filters?: Filters
) {
    const projectsUrl = `/projects/${projectId}/users`;
    const response = await api.get(projectsUrl, {
        params: {
            ...filters,
        },
    });
    return response.data;
}

export async function getProjectsPerUser(
    userId: string | number,
    filters?: Filters
) {
    const projectsUrl = `/projects/user/${userId}`;
    const response = await api.get(projectsUrl, {
        params: {
            ...filters,
        },
    });
    return response.data;
}

export function createProject(data: ProjectProps) {
    const projectUrl = "/projects";
    return api.post(projectUrl, data);
}

export function uploadProjectFile(formData: any) {
    const projectUrl = "/projects/upload-project-file";
    return api.post(projectUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export function createLinkUserToProject(
    projectId: string | number,
    userId: string | number
) {
    const projectUrl = `/projects/${projectId}/users`;
    return api.post(projectUrl, { userId: userId });
}

export function deleteProject(id: string | number) {
    const projectDeleteUrl = `/projects/${id}`;
    return api.delete(projectDeleteUrl);
}

export function deleteUserFromProject(
    projectId: string | number,
    userId: string | number
) {
    const projectDeleteUrl = `/projects/${projectId}/users/${userId}`;
    return api.delete(projectDeleteUrl);
}

export function editProject(id: string | number, data: ProjectProps) {
    const projectDeleteUrl = `/projects/${id}`;
    return api.put(projectDeleteUrl, data);
}

export function getStatus() {
    return {
        data: [
            { key: "Em andamento", label: "Em andamento" },
            { key: "Concluído", label: "Concluído" },
            { key: "Pendente", label: "Pendente" },
        ],
    };
}
