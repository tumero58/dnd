import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import DragItem from "./DragItem";

const GridItem = ({ items, setItems }: { items: any, setItems: any }) => {
    const [activeItem, setActiveItem] = useState<any>(items?.[0] || {});

    const handleItemClick = (item: any) => {
        setActiveItem(item);
    };

    const handleClose = (item: any) => {
        console.log(`${item.name} closed`);
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

    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            position: "relative",
            paddingTop: "26px",
            border: "1px solid grey",
            borderRadius: "4px",
        }}>
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
            {items?.find((item: any) => item.id === activeItem?.id)?.component}
        </Box>

    )
};

export default GridItem;
