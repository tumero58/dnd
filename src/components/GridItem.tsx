import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import DragItem from "./DragItem";
import { useSelector } from "react-redux";
import { getDndDragging } from "@/redux/features/dndSlice";
import DropAreaGrid from "./DropAreaGrid";

const GridItem = ({ items, setItems, className }: { items: any, setItems: any, className: any }) => {
    const isDragging = useSelector(getDndDragging);

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

    const [screenWidth, setScreenWidth] = useState(0);
    const [screenHeight, setScreenHeight] = useState(0);

    useEffect(() => {
        if (screenHeight && screenWidth) {
            return
        };
        if (isDragging) {
            const element = document.getElementsByClassName(className)[0];
            if (element) {
                setScreenWidth(element.clientWidth);
                setScreenHeight(element.clientHeight)
            }
        }
    }, [isDragging, className, screenHeight, screenWidth])

    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            position: "relative",
            paddingTop: "26px",
            border: "1px solid grey",
            borderRadius: "4px",
        }} className={className}>
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
                        flexDirection: "column",
                        alignItems: "center"
                    }}>
                        <Box sx={{
                            width: screenWidth / 2,
                            height: screenHeight / 4
                        }}>
                            <DropAreaGrid position="topComponents"></DropAreaGrid>
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
                                <DropAreaGrid position="leftComponents"></DropAreaGrid>
                            </Box>
                            <Box sx={{
                                height: screenHeight / 2,
                                width: screenWidth / 4
                            }}>
                                <DropAreaGrid position="rightComponents"></DropAreaGrid>
                            </Box>
                        </Box>
                        <Box sx={{
                            width: screenWidth / 2,
                            height: screenHeight / 4
                        }}>
                            <DropAreaGrid position="bottomComponents"></DropAreaGrid>
                        </Box>
                    </Box>
                </Box> : <></>}
        </Box>

    )
};

export default GridItem;
