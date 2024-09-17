import AuthGuard from "../../components/AuthGuard";
import UsersPerProjectTable from "../../components/UsersPerProjectTable";

const UsersPerProject = () => {
    return (
        <AuthGuard>
            <main style={{ marginTop: "1rem", height: "inherit" }}>
                <UsersPerProjectTable />
            </main>
        </AuthGuard>
    );
};

export default UsersPerProject;
