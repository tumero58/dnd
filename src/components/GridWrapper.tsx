import { gridItemsDefault } from "@/utils/gridItems";
import { Box } from "@mui/material";
import { useState, Fragment } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
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

    const mainItems = findMainComponents(gridItems);
    let itemsAmount = 0;
    mainItems.forEach((item: any) => {
        itemsAmount += item.renderItem.length
    });

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

        const res = findMainComponents(gridItems);
        const beforeRes: any = [];
        const afterRes: any = [];
        res.forEach((item: any) => {
            if (item.position === "before") {
                beforeRes.push(item)
            } else {
                afterRes.push(item)
            }
        })

        const renderRes = [...beforeRes, ...afterRes];
        let dirSame = true;
        const direction = renderRes?.[0]?.direction;
        if (renderRes.length > 1) {
            for (let i = 0; i < renderRes.length; i++) {
                if (renderRes[i].direction !== direction) {
                    dirSame = false
                }
            }
        }

        return (
            <Panel minSize={20}>
                {dirSame && renderRes.length > 1 && renderRes.length < itemsAmount ?
                    renderGridItems2(gridItems, direction, parentClassName) :
                    <PanelGroup direction={directionColumn ? "vertical" : "horizontal"}>
                        {beforeMainItems ?
                            renderGridItems(beforeMainItems, `${parentClassName}-${beforeClassName}`) : <></>
                        }
                        {gridItems.mainComponents?.length !== 0 ?
                            <GridItem className={parentClassName} items={gridItems.mainComponents} setItems={setGridItems} />
                            : <></>}
                        {afterMainItems ? <PanelResizeHandle /> : <></>}
                        {afterMainItems ?
                            renderGridItems(afterMainItems, `${parentClassName}-${afterClassName}`) : <></>
                        }
                    </PanelGroup>
                }
            </Panel>
        )
    }

    const renderGridItems2 = (gridItems: any, direction: string, parentClassName: string) => {
        const res = findMainComponents(gridItems, [], direction, "", parentClassName);
        const beforeRes: any = [];
        const afterRes: any = [];
        res.forEach((item: any) => {
            if (item.position === "before") {
                beforeRes.push(item)
            } else {
                afterRes.push(item)
            }
        })

        const renderRes = [...beforeRes, ...afterRes];
        return (
            <PanelGroup direction={renderRes[0].direction}>
                {renderRes?.map((item: any, index: any) => {
                    return (
                        <Fragment key={index + 1}>
                            <Panel minSize={20}>
                                <GridItem className={item.className} items={item.renderItem} setItems={setGridItems} />
                            </Panel>
                            {index + 1 !== renderRes.length ? <PanelResizeHandle /> : <></>}
                        </Fragment>
                    )
                })}
            </PanelGroup>
        )
    }


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
                    <PanelGroup direction="horizontal">
                        {renderGridItems(gridItems)}
                    </PanelGroup>
                </Box>
            </Box>
            {/* <Box sx={{
                padding: "16px",
                height: "800px"
            }}>
                <Box sx={{
                    width: "100%",
                    height: "100%",
                    border: "1px solid grey",
                    borderRadius: "4px",
                }}>
                    <PanelGroup direction="horizontal">
                        {renderGridItems2(gridItems)}
                    </PanelGroup>
                </Box>
            </Box> */}
        </>
    )
};

export default GridWrapper;
