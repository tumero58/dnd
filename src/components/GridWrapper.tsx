import { gridItemsDefault, orderGridItems } from "@/utils/gridItems";
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

    const orderedGridItems = orderGridItems(gridItems);

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
                    {renderPanel(orderedGridItems)}
                </Box>
            </Box>
        </>
    )
};

export default GridWrapper;
