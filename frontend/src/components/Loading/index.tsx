import "./index.scss";

export const Loading = ({ ...props }: any) => {
    return (
        <div className="container-loader" {...props}>
            <div className="custom-loader" />
        </div>
    );
};
