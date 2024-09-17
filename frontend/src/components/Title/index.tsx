import "./index.scss";
import { MdManageAccounts } from "react-icons/md";

export const Title = () => {
    return (
        <div className="title-content">
            <MdManageAccounts size={"3rem"} />
            <h1>ProManage</h1>
        </div>
    );
};
