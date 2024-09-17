import api from "../api";

export function doLogin(username: string, password: string) {
    const loginUrl = "/auth/login";
    return api.post(loginUrl, { username, password });
}

export function doRegister(
    username: string,
    password: string,
    email: string,
    role: string
) {
    const registerUrl = "/auth/register";
    return api.post(registerUrl, { username, password, email, role });
}
