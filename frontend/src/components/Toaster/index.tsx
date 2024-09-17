import { Toaster as ToasterProvider, ToastOptions } from "react-hot-toast";

const toastOptions: ToastOptions = {
    style: {
        backgroundColor: "#49B4BB",
        color: "#fff",
    },
    position: "top-center",
};

export const Toaster = () => {
    return <ToasterProvider toastOptions={toastOptions} />;
};
