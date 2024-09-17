import { parse } from "date-fns";

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function formatDateFromDb(dateString: string) {
    // Converte a string "07/02/2024" no formato "dd/MM/yyyy" para um objeto Date
    return parse(dateString, "dd/MM/yyyy", new Date());
}
