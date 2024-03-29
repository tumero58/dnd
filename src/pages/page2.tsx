import PanelItem from "@/components/PanelItem";
import { gridItemsDefault } from "@/utils/gridItems";
import { Box } from "@mui/material";
import { Fragment, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { IGridItem } from "../utils/gridItems";

export interface IPanelItem {
    main: IGridItem[];
    direction: "horizontal" | "vertical";
    items?: IPanelItem[];
    position?: "before",
}

const Page2 = () => {

    const [panelItems, setPanelItems] = useState<IPanelItem>({
        main: gridItemsDefault,
        direction: "horizontal",
        // items: [
        //     {
        //         main: [gridItemsDefault[0], gridItemsDefault[1]],
        //         direction: "vertical",
        //         items: [
        //             {
        //                 main: [gridItemsDefault[3]],
        //                 direction: "horizontal",
        // items: [
        //     {
        //         main: [gridItemsDefault[3]],
        //         direction: "horizontal"
        //     },
        // ]
    // },
    //             ]
    //         },
            // {
            //     main: [gridItemsDefault[2]],
            //     direction: "horizontal"
            // }
        // ]
    });

const splitPanelItems = (panelItems: IPanelItem) => {
    let beforeItems: IPanelItem[] = [];
    let afterItems: IPanelItem[] = [];
    if (panelItems.items) {
        if (panelItems?.items?.length > 0) {
            panelItems.items?.forEach((item: IPanelItem) => {
                if (item.position === "before") {
                    beforeItems.push(item);
                } else {
                    afterItems.push(item);
                }
            })
        }
    }
    return { beforeItems, afterItems }
}

const renderPanelItems = (panelItems: IPanelItem, prevIndex?: number | string) => {
    if (!panelItems.main) {
        return
    }
    const renderItems: IPanelItem[] = [];
    const { beforeItems, afterItems } = splitPanelItems(panelItems);
    if (beforeItems.length > 0) {
        beforeItems.forEach((item: IPanelItem) => {
            renderItems.push(item);
        })
    }
    renderItems.push(panelItems);
    if (afterItems.length > 0) {
        afterItems.forEach((item: IPanelItem) => {
            renderItems.push(item);
        })
    }
    return (
        <PanelGroup direction={panelItems.direction}>
            {renderItems.map((parentItem: IPanelItem, parentIndex: number) => {
                const passIndex = prevIndex ? `${prevIndex}-${parentIndex}` : parentIndex;
                if (parentItem.main.length === 0) {
                    return
                }
                return (
                    <Fragment key={parentIndex + 1}>
                        <Panel minSize={10}>
                            {parentItem.direction === panelItems.direction ?
                                <PanelItem className={prevIndex ? `${prevIndex}-${parentIndex}` : parentIndex} items={parentItem.main} setItems={setPanelItems} /> :
                                renderPanelItems(parentItem, passIndex)}
                        </Panel>
                        {parentIndex + 1 !== renderItems.length ? <PanelResizeHandle /> : <></>}
                    </Fragment>
                )
            })}
        </PanelGroup>
    )
}


return (
    <DndProvider backend={HTML5Backend}>
        <Box sx={{
            padding: "16px",
            height: "100vh"
        }}>
            <Box sx={{
                width: "100%",
                height: "100%",
                border: "1px solid grey",
                borderRadius: "4px",
            }}>
                <PanelGroup direction="horizontal">
                    {renderPanelItems(panelItems)}
                </PanelGroup>
            </Box>
        </Box>
    </DndProvider>
)
};

export default Page2;
