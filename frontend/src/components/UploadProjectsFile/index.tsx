import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { FaCloudUploadAlt } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-hot-toast";
import { uploadProjectFile } from "../../api/services/ProjectService";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

interface InputFileUploadProps {
    refreshList?: any;
}

export default function InputFileUpload({ refreshList }: InputFileUploadProps) {
    const [loading, setLoading] = React.useState(false);
    const userId = sessionStorage.getItem("userId");

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        if (fileExtension !== "csv") {
            toast.error("Por favor, envie um arquivo .csv.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userId as string);

        setLoading(true);

        try {
            await uploadProjectFile(formData);

            toast.success("Arquivo enviado com sucesso!");
            if (refreshList) refreshList((prev: any) => !prev);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao enviar o arquivo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            component="label"
            variant="contained"
            startIcon={
                loading ? (
                    <CircularProgress size={20} />
                ) : (
                    <FaCloudUploadAlt size={20} />
                )
            }
            disabled={loading}
            sx={{
                backgroundColor: "#49b4bb",
                "&:hover": {
                    backgroundColor: "#42c9d3",
                },
            }}
        >
            {loading ? "Uploading..." : "Upload Project File"}
            <VisuallyHiddenInput
                type="file"
                onChange={handleFileUpload}
                accept=".csv"
            />
        </Button>
    );
}
