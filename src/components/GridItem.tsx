import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import DragItem from "./DragItem";
import { useSelector } from "react-redux";
import { getDndDragging } from "@/redux/features/dndSlice";
import DropAreaGrid from "./DropAreaGrid";
import { deleteItem, itemsCleanup } from "@/utils/gridItems";

const GridItem = ({ items, setItems, className }: { items: any, setItems: any, className: any }) => {
    const isDragging = useSelector(getDndDragging);

    const [activeItem, setActiveItem] = useState<any>(items?.[0] || {});

    const handleItemClick = (item: any) => {
        setActiveItem(item);
    };

    const handleClose = (item: any) => {
        setItems((items: any) => {
            const newItems = deleteItem(item.name, items);
            itemsCleanup(newItems);
            return { ...newItems };
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

    useEffect(() => {
        const parentElement = document.getElementById(`${className}screen`)?.parentElement?.parentElement;
        const element = document.getElementById(`${className}screen`);
        const currentParent = document.getElementById(`${className}`);
        const currentParentSibling = currentParent?.nextElementSibling;
        const resizer = document.getElementById(`${className}resize-right`);

        let mousedown = false;

        if (resizer && element && parentElement && currentParent) {
            resizer.addEventListener('mousedown', function (e) {
                mousedown = true;
            }, true);
            parentElement.addEventListener('mouseup', function (e) {
                if (mousedown) {
                    currentParent.style.transition = "1s all ease";
                    currentParent.style.width = e.clientX + "px";
                    if (currentParentSibling) {
                        (currentParentSibling as HTMLElement).style.transition = "1s all ease";
                        (currentParentSibling as HTMLElement).style.width = parentElement.clientWidth - e.clientX + "px";
                    }
                    mousedown = false;
                }
            }, true);
            parentElement.addEventListener('mousemove', function (e) {
                if (mousedown) {
                    resizer.style.left = e.clientX - 4 + 'px';
                }
            }, true);
        }
    }, [className]);

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
            <Box sx={{
                position: "absolute",
                zIndex: 1,
                left: screenWidth - 4,
                top: screenHeight / 2,
                height: "60px",
                width: 0,
                border: "4px solid black",
                borderRadius: "4px",
                cursor: "col-resize",
                // opacity: 1,
                // ":hover": {
                //     opacity: 0.7
                // },
                ":active": {
                    opacity: 0.5,
                    height: screenHeight,
                    top: 0
                }
            }} id={`${className}resize-right`}></Box>
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
                            <DropAreaGrid position={`${className}-mainComponents`}></DropAreaGrid>
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
                                <DropAreaGrid position={`${className}-topComponents`}></DropAreaGrid>
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
                                    <DropAreaGrid position={`${className}-leftComponents`}></DropAreaGrid>
                                </Box>
                                <Box sx={{
                                    height: screenHeight / 2,
                                    width: screenWidth / 4
                                }}>
                                    <DropAreaGrid position={`${className}-rightComponents`}></DropAreaGrid>
                                </Box>
                            </Box>
                            <Box sx={{
                                width: screenWidth / 2,
                                height: (screenHeight / 4)
                            }}>
                                <DropAreaGrid position={`${className}-bottomComponents`}></DropAreaGrid>
                            </Box>
                        </Box>
                    </Box>
                </Box> : <></>}
        </Box>

    )
};

export default GridItem;
