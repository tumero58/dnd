import useLayout from "@/hooks/useLayout";
import { findItem, gridItemsDefault, IGridItem, insertItem, itemsCleanup, renderPanel } from "@/utils/gridItems";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { styles } from "./GridWrapper.styles";
import DeleteIcon from '@mui/icons-material/Delete';
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import { PopupActions } from "reactjs-popup/dist/types";


const GridWrapper = () => {
    const popupRef = useRef<PopupActions>(null);
    const [gridItems, setGridItems] = useState({
        mainComponents: [
            ...gridItemsDefault
        ]
    })

    const {
        renderReady,
        saveLayout, loadLayout,
        layouts, activeLayout, openNewLayout, orderedGridItems, layoutName, sizes,
        setLayouts, setLayoutName, setOpenNewLayout, setSizes, setActiveLayout,
    } = useLayout(gridItems, setGridItems);

    const [clicked, setClicked] = useState(false);
    const [points, setPoints] = useState({
        x: 0,
        y: 0,
    });
    const [duplicateProps, setDuplicateProps] = useState({
        main: "",
        top: "",
        left: "",
        right: "",
        bottom: ""
    });
    const [duplicateItem, setDuplicateItem] = useState<any>({});

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if ((e.target as any)?.role === "menuitem") {
                return
            }
            setClicked(false);
            setDuplicateItem({});
            setDuplicateProps({
                main: "",
                top: "",
                left: "",
                right: "",
                bottom: ""
            })
            setPoints({
                x: 0,
                y: 0,
            })
            setMiniMenuOpen(false)
        };
        window.addEventListener("click", handleClick);
        return () => {
            window.removeEventListener("click", handleClick);
        };
    }, []);

    const handleCreateNewLayout = () => {
        setGridItems({
            mainComponents: [
                ...gridItemsDefault
            ]
        });
        setSizes([]);
        setActiveLayout("");
        setLayoutName("");
        setOpenNewLayout(true)
    };

    const handleCloseModule = () => {
        setOpenNewLayout(false);
        const activeLayoutLocal = localStorage.getItem("activeLayout");
        if (activeLayoutLocal) {
            loadLayout(activeLayoutLocal);
        }
    }

    const handleDeleteLayout = (layoutName: string) => {
        const newLayouts = layouts.filter((item) => item !== layoutName);
        if (activeLayout === layoutName) {
            const lastLayout = newLayouts[newLayouts.length - 1];
            if (lastLayout) {
                loadLayout(lastLayout)
            } else {
                setActiveLayout("");
                localStorage.removeItem("activeLayout");
                setGridItems({
                    mainComponents: [
                        ...gridItemsDefault
                    ]
                });
                setSizes([]);
            }
        }
        localStorage.removeItem(layoutName);
        setLayouts(newLayouts);
        localStorage.setItem("layoutsList", JSON.stringify(newLayouts));
    }

    const handleDuplicateItem = (position: "main" | "top" | "left" | "right" | "bottom") => {
        setGridItems((items: any) => {
            const positionChain = duplicateProps[position].split("-");
            positionChain.shift();
            const newItemProps = `${duplicateItem.name}(c)`;
            const foundItem = findItem(newItemProps, items);
            const newItem = {
                ...duplicateItem,
                name: foundItem?.name ? `${newItemProps}(c)` : newItemProps,
                id: foundItem?.name ? `${newItemProps}(c)` : newItemProps
            }
            const newItems = { ...items };
            insertItem(newItem, positionChain, newItems);
            itemsCleanup(newItems);

            return { ...newItems };
        })

    }

    const [miniMenuOpen, setMiniMenuOpen] = useState(false);


    if (renderReady) {
        return (
            <>
                <Box sx={styles.wrapper}>
                    <Box sx={styles.flexAlignCenter}>
                        {layouts?.length > 0 ?
                            layouts.map((item: string, index: number) => {
                                return (
                                    <Box sx={{
                                        ...styles.flexAlignCenter,
                                        ...styles.isActiveBorder(activeLayout, item)
                                    }} key={index + 1}>
                                        <Button
                                            key={index + 1}
                                            onClick={() => {
                                                loadLayout(item)
                                            }}
                                            sx={styles.isActive(activeLayout, item)}
                                        >{item}</Button>
                                        <Popup
                                            trigger={<Button><DeleteIcon /></Button>}
                                            modal
                                            ref={popupRef}
                                        >
                                            <Box sx={{
                                                ...styles.flexAlignCenter,
                                                flexDirection: "column"
                                            }}>
                                                <Typography>Delete layout: {item} ?</Typography>
                                                <Button onClick={() => {
                                                    handleDeleteLayout(item)
                                                    popupRef?.current?.close()
                                                }}>yes</Button>
                                                <Button onClick={() => {
                                                    popupRef?.current?.close()
                                                }}>no</Button>
                                            </Box>
                                        </Popup>
                                    </Box>
                                )
                            }) : <></>}
                        {openNewLayout || layouts?.length === 0 ?
                            <Box sx={styles.flexAlignCenter}>
                                <TextField onChange={(e) => { setLayoutName(e.target.value) }} />
                                <Button onClick={() => { saveLayout(layoutName) }}>save layout</Button>
                                <Button onClick={handleCloseModule}>X</Button>
                            </Box> :
                            <Button onClick={handleCreateNewLayout}>+</Button>}
                    </Box>
                    <Box sx={styles.flexJustifyCenter}>
                        <Typography>{activeLayout}</Typography>
                    </Box>
                    <Box sx={styles.panelWrapper}>
                        {renderPanel(orderedGridItems, sizes, setSizes, setGridItems, setClicked, setPoints, setDuplicateProps, setDuplicateItem)}
                        {clicked && (
                            <Box sx={{
                                position: "absolute",
                                top: points.y,
                                left: points.x,
                                border: "1px solid #1976d2",
                                borderRadius: "16px",
                                display: "flex",
                                flexDirection: "column",
                                background: "white"
                            }}>
                                <Button onClick={() => {
                                    handleDuplicateItem("main");
                                }}>{"duplicate ○"}</Button>
                                <Button role={"menuitem"} onClick={() => { setMiniMenuOpen((o) => !o) }}>
                                    duplicate {miniMenuOpen ? "▼" : "►"}
                                </Button>
                                {miniMenuOpen ?
                                    <>
                                        <Button onClick={() => {
                                            handleDuplicateItem("top");
                                        }}>{"duplicate ↑"}</Button>
                                        <Button onClick={() => {
                                            handleDuplicateItem("left");
                                        }}>{"duplicate ←"}</Button>
                                        <Button onClick={() => {
                                            handleDuplicateItem("bottom");
                                        }}>{"duplicate ↓"}</Button>
                                        <Button onClick={() => {
                                            handleDuplicateItem("right");
                                        }}>{"duplicate →"}</Button>
                                    </> : <></>}
                            </Box>
                        )}
                    </Box>
                </Box>
            </>
        )
    } else {
        return <></>
    }
};

export default GridWrapper;
