import { gridItemsDefault } from "@/utils/gridItems";
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
                resizer.style.left = leftElement?.clientWidth + "px";
                resizer.style.top = leftElement?.clientHeight / 2 + "px";
                resizer.style.transform = "translate(-50%, -50%)";
                resizer.style.height = "60px";
                resizer.style.width = "0";
                resizer.style.border = "4px solid black";
                resizer.style.borderRadius = "4px";
                resizer.style.cursor = "col-resize";
                resizer.className = "resizer-horizontal";
                resizer.id = `resizer${resizeClassName}`;
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
                            const movX = leftElement.clientWidth + resizerMoveX;
                            const moveXPercent = movX * 100 / parentElement.clientWidth;
                            leftElement.style.transition = "1s all ease";
                            leftElement.style.width = moveXPercent + "%";
                            if (currentParentSibling) {
                                (currentParentSibling as HTMLElement).style.transition = "1s all ease";
                                (currentParentSibling as HTMLElement).style.width = 100 - moveXPercent + "%";
                            }
                            mousedown = false;
                            resizerMoveX = 0;
                        }
                    }, true);
                    let resizerMoveX = 0;
                    parentElement.addEventListener('mousemove', function (e) {
                        if (mousedown) {
                            resizerMoveX+=e.movementX
                            resizer.style.left = `calc(100% + ${resizerMoveX}px`;
                        }
                    }, true);
                }
                const removeCb = () => {
                    if (leftElement.contains(resizer)) {
                        leftElement.removeChild(resizer);
                    }
                };
                return removeCb;
            }
        }
        if (gridItems.leftComponents && !gridItems.rightComponents) {
            const resizer = document.getElementById(`resizer${resizeClassName}`);
            if (resizer) {
                resizer.remove();
            }
            const leftElement = document.getElementById(`${resizeClassName}-leftComponents`);
            if (leftElement) {
                leftElement.style.width = "100%";
                const resizerList = leftElement.getElementsByClassName("resizer-horizontal");
                if (resizerList.length !== 0) {
                    for (let i = 0; i < resizerList.length; i++) {
                        (resizerList[i] as HTMLElement).remove()
                    }
                }
                const currentParentSibling = leftElement.nextElementSibling;
                if (currentParentSibling) {
                    (currentParentSibling as HTMLElement).style.width = "100%"
                }
            }
        }
        if (!gridItems.leftComponents && gridItems.rightComponents) {
            const rightElement = document.getElementById(`${resizeClassName}-rightComponents`);
            if (rightElement) {
                rightElement.style.width = "100%";
                const resizerList = rightElement.getElementsByClassName("resizer-horizontal");
                if (resizerList.length !== 0) {
                    for (let i = 0; i < resizerList.length; i++) {
                        (resizerList[i] as HTMLElement).remove()
                    }
                }
                const currentParentSibling = rightElement.nextElementSibling;
                if (currentParentSibling) {
                    (currentParentSibling as HTMLElement).style.width = "100%"
                }
            }
        }
    }

    const createResizeAll = useCallback((gridItems: any, className: string = "resizeWrapper", callbackArray: any[] = []) => {
        const callbackFns: any[] = [...callbackArray];
        const removeCb = createResize(gridItems, className);
        callbackFns.push(removeCb);

        const keys = Object.keys(gridItems);
        keys.forEach((key: string) => {
            if (key === "mainComponents") {
                return
            } else {
                createResizeAll((gridItems as any)[key], `${className}-${key}`, callbackFns)
                callbackFns.push(removeCb);
            }
        })
        return callbackFns;
    }, []);

    useEffect(() => {
        const callbacks = createResizeAll(gridItems, "resizeWrapper", []);
        return (() => {
            if (callbacks.length !== 0) {
                callbacks.forEach((fn: Function) => {
                    if (fn) {
                        fn()
                    }
                })
            }
        })
    }, [gridItems, createResizeAll])

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
