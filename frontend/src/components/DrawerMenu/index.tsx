import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { GiHamburgerMenu } from "react-icons/gi";
import { ThemeContext } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

interface itemListProps {
    label: string;
    icon: React.ReactNode;
    urlNavigate: string;
}

interface DrawerMenuProps {
    itemList: itemListProps[];
}

export default function DrawerMenu({ itemList }: DrawerMenuProps) {
    const [state, setState] = React.useState(false);

    const { theme } = React.useContext(ThemeContext);

    const navigate = useNavigate();

    const toggleDrawer =
        (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === "keydown" &&
                ((event as React.KeyboardEvent).key === "Tab" ||
                    (event as React.KeyboardEvent).key === "Shift")
            ) {
                return;
            }

            setState(open);
        };

    const list = () => (
        <Box
            sx={{ width: "auto" }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {itemList.map((item, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton
                            onClick={() => navigate(item.urlNavigate)}
                        >
                            <ListItemIcon>
                                <div className="drawer-icon-content">
                                    {item.icon}
                                </div>
                                {/*index % 2 === 0 ? (
                                    <GoProjectSymlink
                                        style={{
                                            color:
                                                theme === "light"
                                                    ? "#4b5563"
                                                    : "#e5e7eb",
                                        }}
                                    />
                                ) : (
                                    <FaUsers
                                        style={{
                                            color:
                                                theme === "light"
                                                    ? "#4b5563"
                                                    : "#e5e7eb",
                                        }}
                                    />
                                )*/}
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            {/*<Divider />
            <List>
                {["All mail", "Trash", "Spam"].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? (
                                    <HiOutlinePlusSm />
                                ) : (
                                    <FaCalendarAlt />
                                )}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>*/}
        </Box>
    );

    return (
        <div>
            <React.Fragment>
                <Button
                    onClick={toggleDrawer(true)}
                    style={{
                        minWidth: 0,
                        color: theme === "light" ? "#4b5563" : "#e5e7eb",
                    }}
                >
                    <GiHamburgerMenu size={"1.75rem"} />
                </Button>
                <Drawer
                    anchor={"left"}
                    open={state}
                    onClose={toggleDrawer(false)}
                    sx={{
                        "& .MuiDrawer-paper": {
                            backgroundColor:
                                theme === "dark" ? "#1f2937" : "#f3f4f6",
                            color: theme === "light" ? "#4b5563" : "#e5e7eb",
                            minWidth: "12rem",
                        },
                    }}
                >
                    {list()}
                </Drawer>
            </React.Fragment>
        </div>
    );
}
