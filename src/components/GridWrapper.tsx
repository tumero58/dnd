import useLayout from "@/hooks/useLayout";
import { gridItemsDefault, renderPanel } from "@/utils/gridItems";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { styles } from "./GridWrapper.styles";

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
        setLayoutName, setOpenNewLayout, setSizes, setActiveLayout,
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

    if (renderReady) {
        return (
            <>
                <Box sx={styles.wrapper}>
                    <Box sx={styles.flexAlignCenter}>
                        {layouts?.length > 0 ?
                            layouts.map((item: string, index: number) => {
                                return (
                                    <Button
                                        key={index + 1}
                                        onClick={() => {
                                            loadLayout(item)
                                        }}
                                        sx={styles.isActive(activeLayout, item)}
                                    >{item}</Button>
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
