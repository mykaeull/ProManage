import AuthGuard from "../../components/AuthGuard";
import { Dashboard } from "../../components/Dashboard";

const DashboardPage = () => {
    return (
        <AuthGuard>
            <main style={{ marginTop: "1rem", height: "inherit" }}>
                <Dashboard />
            </main>
        </AuthGuard>
    );
};

export default DashboardPage;
