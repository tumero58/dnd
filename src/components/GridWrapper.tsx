import { gridItemsDefault } from "@/utils/gridItems";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import GridItem from "./GridItem";

const GridWrapper = () => {
    const [gridItems, setGridItems] = useState({
        mainComponents: [
            ...gridItemsDefault
        ]
    })

    const renderGridItems = (gridItems: any, parentClassName: string = ""): any => {
        if (Object.keys(gridItems).length === 0) {
            return;
        }
        let directionColumn;

        let beforeMainItems;
        let afterMainItems;

        let beforeClassName;
        let afterClassName;

        if (gridItems.leftComponents && Object.keys(gridItems.leftComponents).length !== 0) {
            beforeMainItems = gridItems.leftComponents;
            beforeClassName = "leftComponents";
            directionColumn = false;
        }
        if (gridItems.topComponents && Object.keys(gridItems.topComponents).length !== 0) {
            beforeMainItems = gridItems.topComponents
            beforeClassName = "topComponents";
            directionColumn = true;
        }
        if (gridItems.rightComponents && Object.keys(gridItems.rightComponents).length !== 0) {
            afterMainItems = gridItems.rightComponents;
            afterClassName = "rightComponents";
            directionColumn = false;
        }
        if (gridItems.bottomComponents && Object.keys(gridItems.bottomComponents).length !== 0) {
            afterMainItems = gridItems.bottomComponents;
            afterClassName = "bottomComponents";
            directionColumn = true;
        }

        return (
            <Box sx={{
                display: "flex",
                flexDirection: directionColumn ? "column" : "row",
                height: "100%",
                width: "100%"
            }} id={`resizeWrapper${parentClassName}`}>
                {beforeMainItems ?
                    renderGridItems(beforeMainItems, `${parentClassName}-${beforeClassName}`) : <></>
                }
                {gridItems.mainComponents?.length !== 0 ?
                    <GridItem className={parentClassName} items={gridItems.mainComponents} setItems={setGridItems} /> : <></>}
                {afterMainItems ?
                    renderGridItems(afterMainItems, `${parentClassName}-${afterClassName}`) : <></>
                }
            </Box>
        )
    }

    const createResize = (gridItems: any, resizeClassName: string = "resizeWrapper") => {
        if (!gridItems) {
            return;
        }
        if (gridItems.leftComponents && gridItems.rightComponents) {
            const leftElement = document.getElementById(`${resizeClassName}-leftComponents`);
            if (leftElement) {
                const resizer = document.createElement("div");
                resizer.style.position = "absolute";
                resizer.style.zIndex = "1";
                resizer.style.left = leftElement?.clientWidth + 13 + "px";
                resizer.style.top = leftElement?.clientHeight / 2 - 15 + "px";
                resizer.style.height = "60px";
                resizer.style.width = "0";
                resizer.style.border = "4px solid black";
                resizer.style.borderRadius = "4px";
                resizer.style.cursor = "col-resize";
                leftElement.appendChild(resizer);

                const parentElement = document.getElementById(`${resizeClassName}`);
                const currentParentSibling = leftElement?.nextElementSibling;


                let mousedown = false;


                if (resizer && parentElement) {
                    resizer.addEventListener('mousedown', function (e) {
                        mousedown = true;
                    }, true);
                    parentElement.addEventListener('mouseup', function (e) {
                        if (mousedown) {
                            leftElement.style.transition = "1s all ease";
                            leftElement.style.width = e.clientX - 13 + "px";
                            if (currentParentSibling) {
                                (currentParentSibling as HTMLElement).style.transition = "1s all ease";
                                (currentParentSibling as HTMLElement).style.width = parentElement.clientWidth - e.clientX + 13 + "px";
                            }
                            mousedown = false;
                        }
                    }, true);
                    parentElement.addEventListener('mousemove', function (e) {
                        if (mousedown) {
                            resizer.style.left = e.clientX + 'px';
                        }
                    }, true);
                }

                const removeCb = () => {
                    leftElement.removeChild(resizer);
                };
                return removeCb;


            }
        }
    }

    useEffect(() => {
        const removeCb = createResize(gridItems);
        return (() => {
            if (removeCb) {
                removeCb();
            }
        })
    }, [gridItems])


    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            border: "1px solid grey",
            borderRadius: "4px",
        }}>
            {renderGridItems(gridItems)}
        </Box>
    )
};

export default GridWrapper;
