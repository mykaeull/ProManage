import AuthGuard from "../../components/AuthGuard";
import ProjectsTable from "../../components/ProjectsTable";

const Projects = () => {
    return (
        <AuthGuard>
            <main style={{ marginTop: "1rem", height: "inherit" }}>
                <ProjectsTable />
            </main>
        </AuthGuard>
    );
};

export default Projects;
