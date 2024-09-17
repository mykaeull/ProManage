import api from "../api";

interface Filters {
    page: number | string;
    pageSize: number | string;
}

export async function getUsers(filters?: Filters) {
    const usersUrl = "/users";
    const response = await api.get(usersUrl, {
        params: {
            ...filters,
        },
    });
    return response.data;
}
