import { ThemeContext } from "../../contexts/ThemeContext";
import { formatDate } from "../../utils";
import React, { useEffect, useState, forwardRef, useContext } from "react";
import Select, { Props as SelectProps } from "react-select";
import AsyncSelect from "react-select/async"; // Importa o AsyncSelect

interface OptionsProps {
    value: string;
    label: string;
}

interface DropdownProps extends SelectProps<OptionsProps> {
    placeholder?: string;
    value: any;
    onChange: (value: any) => void;
    keyy: string;
    label: string;
    fnRequest: any;
    isAsync?: boolean;
    customFnRequestProp?: any;
    isClearable?: boolean;
}

export const Dropdown = forwardRef<any, DropdownProps>(
    (
        {
            placeholder = "",
            value,
            onChange,
            keyy,
            label,
            fnRequest,
            isAsync = false,
            customFnRequestProp,
            isClearable = true,
        },
        ref
    ) => {
        const [options, setOptions] = useState<OptionsProps[]>([]);
        const { theme } = useContext(ThemeContext);
        const [page, setPage] = useState(1);
        const [hasMore, setHasMore] = useState(true);
        const pageSize = 5;

        const customStyles = {
            control: (provided: any, state: any) => ({
                ...provided,
                height: "2.5rem",
                border: state.isFocused ? "1px solid #49B4BB" : provided.border,
                boxShadow: state.isFocused
                    ? "0 0 0 1px #49B4BB"
                    : provided.boxShadow,
                backgroundColor:
                    theme === "dark" ? "#1f2937" : provided.backgroundColor,
                color: theme === "dark" ? "#e5e7eb" : provided.color,
                "&:hover": {
                    border: state.isFocused
                        ? "1px solid #49B4BB"
                        : provided.border,
                },
            }),
            input: (provided: any) => ({
                ...provided,
                color: theme === "dark" ? "#e5e7eb" : provided.color,
            }),
            singleValue: (provided: any) => ({
                ...provided,
                color: theme === "dark" ? "#e5e7eb" : provided.color,
            }),
            option: (provided: any, state: any) => ({
                ...provided,
                backgroundColor: state.isFocused ? "#D9F1F3" : null,
                color: state.isSelected ? "black" : "black",
                "&:hover": {
                    backgroundColor: "#D9F1F3",
                },
            }),
            menu: (provided: any) => ({
                ...provided,
                zIndex: 9999,
                // maxHeight: "200px",
                // overflowY: "auto",
            }),
            menuPortal: (provided: any) => ({
                ...provided,
                zIndex: 9999,
            }),
        };

        const loadOptions = async (
            inputValue: string,
            callback: (options: OptionsProps[]) => void
        ) => {
            try {
                let response;
                if (customFnRequestProp) {
                    response = await fnRequest(customFnRequestProp, {
                        page,
                        pageSize,
                    });
                } else {
                    response = await fnRequest({ page, pageSize });
                }

                const formattedOptions = response.data.map((d: any) => ({
                    value: d[keyy],
                    label: label === "dia" ? formatDate(d[label]) : d[label],
                }));

                if (response.data.length < pageSize) {
                    setHasMore(false);
                }

                setOptions((prevOptions) => [
                    ...prevOptions,
                    ...formattedOptions,
                ]);

                setPage((prevPage) => prevPage + 1); // FIX

                callback(formattedOptions);

                return formattedOptions;
            } catch (error) {
                console.error("Error fetching options:", error);
                callback([]);
                return [];
            }
        };

        const handleScrollToBottom = async () => {
            if (hasMore) {
                await loadOptions("", () => {});
            }
        };

        useEffect(() => {
            const fetchData = async () => {
                try {
                    let response;
                    if (customFnRequestProp) {
                        response = await fnRequest(customFnRequestProp);
                    } else {
                        response = await fnRequest();
                    }

                    const formattedOptions = response.data.map((d: any) => ({
                        value: d[keyy],
                        label:
                            label === "dia" ? formatDate(d[label]) : d[label],
                    }));
                    setOptions(formattedOptions);
                } catch (error) {
                    console.error("Error fetching options:", error);
                }
            };
            if (!isAsync) {
                fetchData();
            }
        }, [fnRequest, isAsync, keyy, label, customFnRequestProp]);

        return isAsync ? (
            <AsyncSelect
                ref={ref}
                cacheOptions
                defaultOptions
                loadOptions={loadOptions}
                onChange={(option) => onChange(option ? option.value : "")}
                styles={customStyles}
                placeholder={placeholder}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                onMenuScrollToBottom={handleScrollToBottom}
            />
        ) : (
            <Select
                isClearable={isClearable}
                ref={ref}
                value={options.find((option) => option.value === value)}
                onChange={(option) => onChange(option ? option.value : "")}
                options={options}
                styles={customStyles}
                placeholder={placeholder}
                menuPortalTarget={document.body}
                menuPosition="fixed"
            />
        );
    }
);

Dropdown.displayName = "Dropdown";
