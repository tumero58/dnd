import { gridItemsDefault } from "@/utils/gridItems";
import { createResizeHorizontal, createResizeHorizontalAll } from "@/utils/gridWrapper.utils";
import { Box } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
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
                width: "100%",
                position: "relative"
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

    const createResizeHorizontalAllCb = useCallback((gridItems: any, className: string = "resizeWrapper", callbackArray: any[] = []) => {
        return createResizeHorizontalAll(gridItems, className, callbackArray);
    }, []);

    useEffect(() => {
        const callbacks = createResizeHorizontalAllCb(gridItems, "resizeWrapper", []);
        return (() => {
            if (callbacks.length !== 0) {
                callbacks.forEach((fn: Function) => {
                    if (fn) {
                        fn()
                    }
                })
            }
        })
    }, [gridItems, createResizeHorizontalAllCb])

    useEffect(() => {
        const observer = new MutationObserver(list => {
            if (list.length > 1) {
                const resizerList = document.getElementsByClassName("resizer-horizontal");
                if (resizerList.length !== 0) {
                    for (let i = 0; i < resizerList.length; i++) {
                        (resizerList[i] as HTMLElement).style.left = "100%";
                        (resizerList[i] as HTMLElement).style.width = "0";
                    }
                }
            }
        });
        observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    }, [])


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
