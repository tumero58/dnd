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
            <Panel minSize={10}>
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
            </Panel>
        )
    }

    const renderGridItems2 = (gridItems: any) => {
        const res = findMainComponents(gridItems);
        let newres: any = []
        for (let i = 0; i < res.length; i++) {
            if (res[i].tag !== "pushed") {
                if (i === 0) {
                    if (res[i].direction === "horizontal") {
                        newres.push(res[i]);
                    } else {
                        let newitem = {
                            ...res[i]
                        }
                        let neighbors: any = [];
                        for (let j = i + 1; j < res.length; j++) {
                            if (res[j].direction === newitem.direction) {
                                neighbors.push(res[j]);
                                res[j].tag = "pushed";
                                // res[j].direction = res[j].direction === "horizontal" ? "vertical" : "horizontal";
                            } else {
                                break
                            }
                        }
                        newitem.neighbors = neighbors;
                        newitem.direction = "horizontal";
                        newres.push(newitem);
                    }
                }
                if (i >= 1) {
                    if (res[i].direction === res[i - 1].direction) {
                        newres.push(res[i]);
                    } else {
                        let newitem: any = {
                            ...res[i]
                        }
                        let neighbors: any = [];
                        for (let j = i + 1; j < res.length; j++) {
                            if (res[j].direction === newitem.direction) {
                                neighbors.push(res[j]);
                                res[j].tag = "pushed";
                                // res[j].direction = res[j].direction === "horizontal" ? "vertical" : "horizontal";
                            } else {
                                break
                            }
                        }
                        newitem.neighbors = neighbors;
                        newitem.direction = "horizontal";
                        newres.push(newitem);
                    }
                }
            }
        }
        console.log(res, "old res");
        console.log(newres, "new res");

        for (let i = 0; i < newres.length; i++) {
            if (newres[i].neighbors?.length > 0) {
                console.log("neighbor found");
                if (newres[i].neighbors[0].direction === "horizontal") {
                    if (newres[i].neighbors[0].position.includes("before")) {
                        newres.splice(i, 0, newres[i].neighbors[0])
                    } else {
                        newres.splice(i + 1, 0, newres[i].neighbors[0])
                    }
                    newres[i].neighbors = [];
                }
            }
        }


        return (
            <PanelGroup direction={newres[0].direction}>
                {newres?.map((item: any, index: any) => {
                    return (
                        <Fragment key={index + 1}>
                            <Panel minSize={10}>
                                {item.neighbors?.length > 0 ?
                                    <PanelGroup direction={item.neighbors[0].direction}>
                                        {[item, ...item.neighbors].map((childItem: any, index: number) => {
                                            return (
                                                <Fragment key={index + 1}>
                                                    <Panel minSize={10}>
                                                        <GridItem className={childItem.className} items={childItem.renderItem} setItems={setGridItems} />
                                                    </Panel>
                                                    {index + 1 !== [item, ...item.neighbors].length ? <PanelResizeHandle /> : <></>}
                                                </Fragment>
                                            )
                                        })}
                                    </PanelGroup>
                                    :
                                    <GridItem className={item.className} items={item.renderItem} setItems={setGridItems} />}
                            </Panel>
                            {index + 1 !== newres.length ? <PanelResizeHandle /> : <></>}
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
                        {renderGridItems2(gridItems)}
                    </PanelGroup>
                </Box>
            </Box>
        </>
    )
};

export default GridWrapper;
