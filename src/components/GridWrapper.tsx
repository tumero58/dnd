import { gridItemsDefault } from "@/utils/gridItems";
import { Box } from "@mui/material";
import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
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
            <Panel minSize={25}>
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

    return (
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
    )
};

export default GridWrapper;
