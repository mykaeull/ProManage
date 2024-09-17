import React, { useEffect, useRef, useState } from "react";
import { Chart, ChartConfiguration } from "chart.js/auto";
import {
    getProjects,
    getProjectsPerUser,
} from "../../api/services/ProjectService";
import { Loading } from "../Loading";

type ProjectStatus = "Concluído" | "Pendente" | "Em andamento";

function BasicPie() {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [chartData, setChartData] = useState<number[]>([0, 0, 0]);
    const [loading, setLoading] = useState(true);

    const userId = sessionStorage.getItem("userId");
    const role = sessionStorage.getItem("role");

    const fetchData = async () => {
        try {
            let response;

            if (role === "Gerente") {
                response = await getProjects();
            } else {
                response = await getProjectsPerUser(Number(userId));
            }

            const projects = response.data;

            const statusCount: Record<ProjectStatus, number> = {
                Concluído: 0,
                Pendente: 0,
                "Em andamento": 0,
            };

            projects.forEach((project: { status: ProjectStatus }) => {
                statusCount[project.status]++;
            });

            setChartData([
                statusCount["Concluído"],
                statusCount["Pendente"],
                statusCount["Em andamento"],
            ]);
        } catch (error) {
            console.error("Erro ao buscar os projetos:", error);
        }
    };

    useEffect(() => {
        if (loading) fetchData();
        setLoading(false);

        if (chartRef.current) {
            const ctx = chartRef.current.getContext("2d");

            if (ctx !== null) {
                const config: ChartConfiguration<"pie", number[], string> = {
                    type: "pie",
                    data: {
                        labels: ["Concluído", "Pendente", "Em andamento"],
                        datasets: [
                            {
                                label: "Status dos Projetos",
                                data: chartData,
                                backgroundColor: [
                                    "rgb(0,255,127)",
                                    "rgb(255, 205, 86)",
                                    "rgb(70,130,180)",
                                ],
                                hoverOffset: 4,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                    },
                };
                const myPieChart = new Chart(ctx, config);
                return () => {
                    myPieChart.destroy();
                };
            }
        }
    }, [chartData]);

    return <>{loading ? <Loading /> : <canvas ref={chartRef} />}</>;
}

export const Dashboard = () => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2rem",
            }}
        >
            <h1 style={{ color: "#4b5563" }}>ProManage Dashboard</h1>
            <BasicPie />
        </div>
    );
};
