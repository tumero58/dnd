import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDndDragging } from "@/redux/features/dndSlice";
import DropAreaGrid from "./DropAreaGrid";
import { IPanelItem } from "../pages/page2";
import PanelDragItem from "./PanelDragItem";

export const findItemPanel = (panelItem: IPanelItem, itemToFind: any,parentItem?:any): any => {
    let isItemFound = false;
    for (let i = 0; i < panelItem.main.length; i++) {
        if (panelItem.main[i].name === itemToFind.name) {
            isItemFound = true;
            return panelItem;
        }
    }
    if (!isItemFound) {
        if (panelItem.items && panelItem.items?.length !== 0) {
            for (let j = 0; j < panelItem.items.length; j++) {
                const res = findItemPanel(panelItem.items[j], itemToFind);
                if (res) {
                    return res
                }
            }
        }
    }

}

export const deleteItemPanel = (itemFound: any, deleteItem: any) => {
    itemFound.main = itemFound.main.filter((item: any) => item.name !== deleteItem.name);
    if (itemFound.items) {
        if (itemFound.main.length === 0 && itemFound.items?.length !== 0) {
            itemFound.main = itemFound.items[0].main;
            itemFound.items = itemFound.items[0].items;
        }
    }
}

const PanelItem = ({ items, setItems, className }: { items: any, setItems: any, className: any }) => {
    const isDragging = useSelector(getDndDragging);

    const [activeItem, setActiveItem] = useState<any>(items?.[0] || {});

    const handleItemClick = (item: any) => {
        setActiveItem(item);
    };

    const handleClose = (itemClicked: any) => {
        setItems((parentItems: any) => {
            const newParentItems = { ...parentItems };
            const itemFound = findItemPanel(newParentItems, itemClicked);
            deleteItemPanel(itemFound, itemClicked);
            return { ...newParentItems };
        })
    };

    useEffect(() => {
        if (items.length !== 0) {
            const currentItemIds = items.map((item: any) => item.id);
            if (activeItem) {
                if (!currentItemIds.includes(activeItem.id)) {
                    setActiveItem(items[0])
                }
            }
        }
    }, [items, activeItem])

    const [screenWidth, setScreenWidth] = useState(0);
    const [screenHeight, setScreenHeight] = useState(0);

    useEffect(() => {
        if (isDragging) {
            const element = document.getElementById(`${className}screen`);

            if (element) {
                setScreenWidth(element.clientWidth);
                setScreenHeight(element.clientHeight)
            }
        }
    }, [isDragging, className]);

    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            position: "relative",
            paddingTop: "26px",
            border: "1px solid grey",
            borderRadius: "4px",
        }} id={`${className}screen`}>
            <Box sx={{
                display: "flex",
                position: "absolute",
                top: 0,
                left: 0
            }}>
                {items?.map((item: any, index: number) => (
                    <Box key={item.id} sx={{
                        height: "26px",
                        paddingX: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        backgroundColor: item.id === activeItem?.id ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.05)",
                        cursor: "pointer"
                    }} onClick={() => {
                        handleItemClick(item);
                    }}>
                        <PanelDragItem
                            item={item}
                            setItems={setItems}
                        />
                        <Box sx={{
                            cursor: "pointer",
                            color: "rgba(0, 0, 0, 0.2)",
                            userSelect: "none",
                            ":hover": {
                                color: "black"
                            }
                        }} onClick={(e) => {
                            e.stopPropagation();
                            handleClose(item);
                        }}>x</Box>
                    </Box>
                ))}
            </Box>
            {items?.find((item: any) => item.id === activeItem?.id)?.component}
            {isDragging ?
                <Box sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: screenWidth,
                    height: screenHeight,
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderRadius: "4px"
                }}>
                    <Box sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <Box sx={{
                            height: "26px",
                            width: "100%",
                        }}>
                            <DropAreaGrid position={`${className}-main`}></DropAreaGrid>
                        </Box>
                        <Box sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}>
                            <Box sx={{
                                width: screenWidth / 2,
                                height: (screenHeight / 4) - 26
                            }}>
                                <DropAreaGrid position={`${className}-vertical-before`}></DropAreaGrid>
                            </Box>
                            <Box sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%"
                            }}>
                                <Box sx={{
                                    height: screenHeight / 2,
                                    width: screenWidth / 4
                                }}>
                                    <DropAreaGrid position={`${className}-before`}></DropAreaGrid>
                                </Box>
                                <Box sx={{
                                    height: screenHeight / 2,
                                    width: screenWidth / 4
                                }}>
                                    <DropAreaGrid position={`${className}`}></DropAreaGrid>
                                </Box>
                            </Box>
                            <Box sx={{
                                width: screenWidth / 2,
                                height: (screenHeight / 4)
                            }}>
                                <DropAreaGrid position={`${className}-vertical`}></DropAreaGrid>
                            </Box>
                        </Box>
                    </Box>
                </Box> : <></>}
        </Box>

    )
};

export default PanelItem;
