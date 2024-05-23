import { gridItemsDefault, orderGridItems } from "@/utils/gridItems";
import { Box } from "@mui/material";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import GridItem from "./GridItem";

const GridWrapper = () => {
    const [gridItems, setGridItems] = useState({
        mainComponents: [
            ...gridItemsDefault
        ]
    })

    const syncComponents = useCallback((parsed: any) => {
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
                return syncComponents(parsed[item])
            })
        }
        return parsed
    }, [])

    const [renderReady, setRenderReady] = useState(false);

    useEffect(() => {
        const cachedItems = localStorage.getItem("items");
        if (cachedItems) {
            const parsed = JSON.parse(cachedItems || "");
            setGridItems(syncComponents(parsed));
            const sizes = localStorage.getItem("sizes");
            const sizesParsed = JSON.parse(sizes || "");
            setPrevSizes(sizesParsed);
            setSizes(sizesParsed);
        }
        setRenderReady(true)

    }, [syncComponents])

    useEffect(() => {
        localStorage.setItem("items", JSON.stringify(gridItems))
    }, [gridItems]);


    const [prevSizes, setPrevSizes] = useState<any>({});
    const [sizes, setSizes] = useState({});

    useEffect(() => {
        localStorage.setItem("sizes", JSON.stringify(sizes))
    }, [sizes]);

    const renderPanel = (res: any) => {
        return (
            <PanelGroup direction={res.direction} onLayout={(numbers) => {
                setSizes({
                    ...sizes,
                    [res.parentClassName || "main"]: numbers
                })
            }}>
                {res.arr.map((item: any, index: number) => {
                    return (
                        <Fragment key={index + 1}>
                            <Panel
                                minSize={10}
                                defaultSize={prevSizes[res.parentClassName || "main"]?.[index]}
                            >
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

    if (renderReady) {
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
    } else {
        return <></>
    }
};

export default GridWrapper;
