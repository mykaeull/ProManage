import React from "react";
import "./index.scss";
import TablePagination from "@mui/material/TablePagination";
import Tooltip from "@mui/material/Tooltip";

interface TableColumn {
    header: string;
    accessor: string;
}

interface TableData {
    [key: string]: string | number;
}

interface TableProps {
    columns: TableColumn[];
    data: TableData[];
    page: number;
    setPage: (p: number) => void;
    pageSize: number;
    setPageSize: (p: number) => void;
    totalData: number;
    extraColumn?: (row: TableData) => React.ReactNode;
    emptyTableText: string;
}

export const Table: React.FC<TableProps> = ({
    columns,
    data,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalData,
    extraColumn,
    emptyTableText,
}) => {
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPageSize(+event.target.value);
        setPage(0);
    };

    return (
        <div className="table-container">
            {data.length === 0 ? (
                <h4 className="empty-text">{emptyTableText}</h4>
            ) : (
                <div className="table-content">
                    <table className="table">
                        <thead>
                            <tr>
                                {columns.map((column) => (
                                    <th key={column.accessor}>
                                        {column.header}
                                    </th>
                                ))}
                                {extraColumn && <th key="extra-column"></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    {columns.map((column) => (
                                        <td key={column.accessor}>
                                            <Tooltip
                                                title={
                                                    <span
                                                        style={{
                                                            fontSize:
                                                                "0.875rem",
                                                        }}
                                                    >
                                                        {String(
                                                            row[column.accessor]
                                                        )}
                                                    </span>
                                                }
                                                arrow
                                                followCursor={
                                                    column.accessor ===
                                                    "description"
                                                }
                                            >
                                                <span>
                                                    {row[column.accessor]}
                                                </span>
                                            </Tooltip>
                                        </td>
                                    ))}
                                    {extraColumn && (
                                        <td
                                            key="extra-column"
                                            style={{ width: "6.25rem" }}
                                        >
                                            {extraColumn(row)}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "1rem",
                }}
            >
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    component="div"
                    count={totalData}
                    rowsPerPage={pageSize}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Linhas por página"
                    labelDisplayedRows={(label) => {
                        return (
                            <span>{`${label.from}–${label.to} de ${label.count}`}</span>
                        );
                    }}
                />
            </div>
        </div>
    );
};
