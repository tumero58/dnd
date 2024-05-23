import { gridItemsDefault, orderGridItems } from "@/utils/gridItems";
import { Box } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import GridItem from "./GridItem";

const GridWrapper = () => {
    const [gridItems, setGridItems] = useState({
        mainComponents: [
            ...gridItemsDefault
        ]
    })

    const getComponents = (parsed: any) => {
        if (parsed.mainComponents?.length > 0) {
            parsed.mainComponents = parsed.mainComponents.map((item: any) => {
                if (item.name) {
                    item.component = gridItemsDefault.find((i => i.name === item.name))?.component
                }
                return item
            })
        } else {
            const keys = Object.keys(parsed);
            keys.forEach((item: any) => {
                return getComponents(parsed[item])
            })
        }
        return parsed
    }

    useEffect(() => {
        const cachedItems = localStorage.getItem("items");
        const parsed = JSON.parse(cachedItems || "");
        setGridItems(getComponents(parsed))


    }, [])

    useEffect(() => {
        console.log(gridItems, "gridit");

        localStorage.setItem("items", JSON.stringify(gridItems))
    }, [gridItems])

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
