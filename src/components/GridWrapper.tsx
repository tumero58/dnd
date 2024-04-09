import { gridItemsDefault } from "@/utils/gridItems";
import { Box } from "@mui/material";
import { Fragment, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import GridItem from "./GridItem";

const GridWrapper = () => {
    const [gridItems, setGridItems] = useState({
        mainComponents: [
            ...gridItemsDefault
        ]
    })

    const f1 = (gridItems: any, parentClassName: string = "", prevDirection?: string): any => {
        if (!gridItems) {
            return
        }
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


        let arr: any = [];

        const beforeItems = f1(beforeMainItems, `${parentClassName}-${beforeClassName}`, direction);
        const afterItems = f1(afterMainItems, `${parentClassName}-${afterClassName}`, direction);

        if (prevDirection === direction) {
            if (beforeItems) {
                if (beforeItems.direction) {
                    arr.push(beforeItems)
                } else {
                    arr.push(...beforeItems);
                }
            }
            arr.push({
                parentClassName,
                items: gridItems.mainComponents
            });
            if (afterItems) {
                if (afterItems.direction) {
                    arr.push(afterItems)
                } else {
                    arr.push(...afterItems);
                }
            }
            const filteredArr = arr.filter((item: any) => item.items?.length !== 0);
            return filteredArr;
        } else {
            return {
                direction,
                arr: f1(gridItems, parentClassName, direction)
            };
        }
    }

    const f1res = f1(gridItems);

    const renderPanel = (res: any) => {
        return (
            <PanelGroup direction={res.direction}>
                {res.arr.map((item: any, index: number) => {
                    return (
                        <Fragment key={index + 1}>
                            <Panel minSize={10}>
                                {item.direction ?
                                    renderPanel(item) :
                                    <GridItem className={item.parentClassName} items={item.items} setItems={setGridItems} />
                                }
                            </Panel>
                            {index + 1 !== res.arr.length ? <PanelResizeHandle /> : <></>}
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
                    {renderPanel(f1res)}
                </Box>
            </Box>
        </>
    )
};

export default GridWrapper;
