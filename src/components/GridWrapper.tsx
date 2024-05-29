import useLayout from "@/hooks/useLayout";
import { gridItemsDefault, renderPanel } from "@/utils/gridItems";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { styles } from "./GridWrapper.styles";
import DeleteIcon from '@mui/icons-material/Delete';

const GridWrapper = () => {
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
                                        <Button onClick={() => {
                                            handleDeleteLayout(item)
                                        }}><DeleteIcon /></Button>
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
                        {renderPanel(orderedGridItems, sizes, setSizes, setGridItems)}
                    </Box>
                </Box>
            </>
        )
    } else {
        return <></>
    }
};

export default GridWrapper;
