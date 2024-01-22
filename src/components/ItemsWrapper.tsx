import { useEffect, useState } from "react";
import DragItem from "./DragItem";
import { Box } from "@mui/material";

const ItemsWrapper = ({ currentItems, setItems }: any) => {
    const [activeItem, setActiveItem] = useState<any>(currentItems?.[0] || {});
    const handleItemClick = (item: any) => {
        setActiveItem(item);
    };

    useEffect(() => {
        if (currentItems.length !== 0) {
            const currentItemNames = currentItems.map((item: any) => item.name);
            if (activeItem) {
                if (!currentItemNames.includes(activeItem.name)) {
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
            paddingTop: "20px"
        }}>
            <Box sx={{
                display: "flex",
                gap: "16px",
                position: "absolute",
                top: 0,
                left: 0
            }}>
                {currentItems?.map((item: any, index: number) => (
                    <Box key={item.id} sx={{
                        background: item.id === activeItem?.id ? "yellow" : "white"
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
                    </Box>
                ))}
            </Box>
            {currentItems?.find((item: any) => item.id === activeItem?.id)?.component}
        </Box>
    )
};

export default ItemsWrapper;
