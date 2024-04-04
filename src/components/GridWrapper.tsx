import { gridItemsDefault } from "@/utils/gridItems";
import { Box } from "@mui/material";
import { useState } from "react";
import { Panel, PanelGroup } from "react-resizable-panels";
import GridItem from "./GridItem";

const GridWrapper = () => {
    const findMainComponents = (gridItems: any, items: any = [], direction: string = "horizontal", position: string = "", className: string = "") => {
        const keys = Object.keys(gridItems);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].includes("main") && gridItems[keys[i]].length !== 0) {
                items.push(
                    {
                        renderItem: gridItems[keys[i]],
                        direction,
                        className,
                        position
                    }
                )
            } else {
                const dir = keys[i].includes("top") || keys[i].includes("bottom") ? "vertical" : "horizontal";
                const position = keys[i].includes("top") || keys[i].includes("left") ? "before" : "";
                findMainComponents(gridItems[keys[i]], items, dir, position, `${className}-${keys[i]}`)
            }
        }
        return items;
    }


    const [gridItems, setGridItems] = useState({
        mainComponents: [
            ...gridItemsDefault
        ]
    })

    const renderGridItems = (gridItems: any, parentClassName: string = "", prevDirection?: string): any => {
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

        const direction = directionColumn ? "vertical" : "horizontal";

        return (
            <>
                {prevDirection === direction ?
                    <>
                        {beforeMainItems ?
                            renderGridItems(beforeMainItems, `${parentClassName}-${beforeClassName}`, direction) : <></>
                        }
                        {gridItems.mainComponents?.length !== 0 ?
                            <>
                                {/* <p>panel 1</p> */}
                                <Panel minSize={10}>
                                    <GridItem className={parentClassName} items={gridItems.mainComponents} setItems={setGridItems} />
                                </Panel>
                            </>

                            : <></>}
                        {afterMainItems ?
                            renderGridItems(afterMainItems, `${parentClassName}-${afterClassName}`, direction) : <></>
                        }
                    </> :
                    <>
                        {/* <p>panel 2</p> */}
                        <Panel minSize={10}>
                            <PanelGroup direction={direction}>
                                {beforeMainItems ?
                                    renderGridItems(beforeMainItems, `${parentClassName}-${beforeClassName}`, direction) : <></>
                                }
                                {gridItems.mainComponents?.length !== 0 ?
                                    renderGridItems(gridItems, parentClassName, direction)
                                    : <></>}
                                {afterMainItems ?
                                    renderGridItems(afterMainItems, `${parentClassName}-${afterClassName}`, direction) : <></>
                                }
                            </PanelGroup>
                        </Panel>
                    </>}
            </>
        )
    }

    const res = findMainComponents(gridItems);

    return (
        <>
            <Box sx={{
                padding: "16px",
                height: "800px"
            }}>
                <Box sx={{
                    width: "100%",
                    height: "100%",
                    border: "1px solid grey",
                    borderRadius: "4px",
                }}>
                    <PanelGroup direction={res[0].direction}>
                        {renderGridItems(gridItems)}
                    </PanelGroup>
                </Box>
            </Box>
        </>
    )
};

export default GridWrapper;
