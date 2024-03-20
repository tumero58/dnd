import GridItem from "@/components/GridItem";
import { gridItemsDefault } from "@/utils/gridItems";
import { Box } from "@mui/material";
import { Fragment, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { IGridItem } from "../utils/gridItems";

interface IPanelItem {
    main: IGridItem[];
    direction: "horizontal" | "vertical";
    items?: IPanelItem[];
}

const Page2 = () => {

    const [panelItems, setPanelItems] = useState<IPanelItem>({
        main: gridItemsDefault,
        direction: "horizontal",
        items: [
            {
                main: [gridItemsDefault[0]],
                direction: "horizontal"
            },
            {
                main: [gridItemsDefault[0], gridItemsDefault[1]],
                direction: "horizontal"
            },
            {
                main: [gridItemsDefault[2]],
                direction: "horizontal"
            },
        ]
    });

    const renderPanelItems = (panelItems: IPanelItem) => {
        if (!panelItems) {
            return
        }
        const renderItems: IPanelItem[] = [];
        renderItems.push({
            main: panelItems.main,
            direction: panelItems.direction
        });
        if (panelItems.items) {
            if (panelItems?.items?.length > 0) {
                panelItems.items?.forEach((item: IPanelItem) => {
                    renderItems.push({
                        main: item.main,
                        direction: item.direction
                    })
                })
            }
        }

        return (
            <PanelGroup direction={panelItems.direction}>
                {renderItems.map((parentItem: IPanelItem, parentIndex: number) => {
                    return (
                        <Fragment key={parentIndex + 1}>
                            <Panel minSize={20}>
                                <GridItem className={""} items={parentItem.main} setItems={() => { }} />
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
