import { useEffect, useState } from "react";
import DragItem from "./DragItem";
import { Box } from "@mui/material";

const ItemsWrapper = ({ currentItems, setItems }: any) => {
    const [activeItem, setActiveItem] = useState<any>(currentItems?.[0] || {});

    const handleItemClick = (item: any) => {
        setActiveItem(item);
    };

    const handleClose = (item: any) => {
        console.log(`${item.name} closed`);
    }

    useEffect(() => {
        if (currentItems.length !== 0) {
            const currentItemIds = currentItems.map((item: any) => item.id);
            if (activeItem) {
                if (!currentItemIds.includes(activeItem.id)) {
                    setActiveItem(currentItems[0])
                }
            }
        }
    }, [currentItems, activeItem])

    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            position: "relative",
            paddingTop: "26px"
        }}>
            <Box sx={{
                display: "flex",
                position: "absolute",
                top: 0,
                left: 0
            }}>
                {currentItems?.map((item: any, index: number) => (
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
                        <DragItem
                            name={item.name}
                            currentPositionName={item.position}
                            setItems={setItems}
                            index={index}
                            component={item.component}
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
            {currentItems?.find((item: any) => item.id === activeItem?.id)?.component}
        </Box>
    )
};

export default ItemsWrapper;
