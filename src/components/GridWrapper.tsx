import { gridItemsDefault, orderGridItems } from "@/utils/gridItems";
import { Box, Button, TextField, Typography } from "@mui/material";
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
    const [sizes, setSizes] = useState<any>({});
    const [layoutName, setLayoutName] = useState("");
    const [layouts, setLayouts] = useState([]);
    const [activeLayout, setActiveLayout] = useState("");
    const orderedGridItems = orderGridItems(gridItems);
    const [openNewLayout, setOpenNewLayout] = useState(false);

    useEffect(() => {
        if (activeLayout) {
            const layout = {
                items: gridItems,
                sizes
            }
            localStorage.setItem(activeLayout, JSON.stringify(layout))
        }
    }, [gridItems, sizes, activeLayout])


    const saveLayout = useCallback((name: string) => {
        if (!name) {
            return
        }
        setActiveLayout(name);
        localStorage.setItem("activeLayout", name);
        const prevLayouts = localStorage.getItem("layoutsList");
        if (prevLayouts) {
            const prevLayoutsParsed = JSON.parse(prevLayouts);
            if (prevLayoutsParsed.includes(name)) {
                return;
            }
            const newLayoutsList = [...prevLayoutsParsed, name];
            localStorage.setItem("layoutsList", JSON.stringify(newLayoutsList));
        } else {
            const layoutsList = [name];
            localStorage.setItem("layoutsList", JSON.stringify(layoutsList))
        }
        const layout = {
            items: gridItems,
            sizes
        }
        localStorage.setItem(name, JSON.stringify(layout))
        const layoutsLocal = localStorage.getItem("layoutsList");
        if (layoutsLocal) {
            const layoutsParsed = JSON.parse(layoutsLocal);
            setLayouts(layoutsParsed);
        }
        setOpenNewLayout(false);
    }, [gridItems, sizes])

    const loadLayout = useCallback((name: string) => {
        const layout = localStorage.getItem(name);
        if (layout) {
            setActiveLayout(name);
            localStorage.setItem("activeLayout", name);
            const layoutParsed = JSON.parse(layout || "");
            const { items, sizes } = layoutParsed;
            setGridItems(syncComponents(items));
            setSizes(sizes);
        }
    }, [syncComponents])

    useEffect(() => {
        const activeLayoutLocal = localStorage.getItem("activeLayout");
        if (activeLayoutLocal) {
            loadLayout(activeLayoutLocal);
        }
        setRenderReady(true)
    }, [loadLayout])

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
                                defaultSize={sizes[res.parentClassName || "main"]?.[index] || 100}
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



    useEffect(() => {
        const layoutsLocal = localStorage.getItem("layoutsList");
        if (layoutsLocal) {
            const layoutsParsed = JSON.parse(layoutsLocal);
            setLayouts(layoutsParsed);
        }
    }, [])

    if (renderReady) {
        return (
            <>
                <Box sx={{
                    padding: "16px",
                    height: "800px"
                }}>
                    <Box sx={{
                        display: "flex",
                        alignItems: "center"
                    }}>
                        {layouts?.length > 0 ?
                            layouts.map((item: string, index: number) => {
                                return (
                                    <Button key={index + 1} onClick={() => {
                                        loadLayout(item)
                                    }} sx={{
                                        fontWeight: activeLayout === item ? "bold" : "unset"
                                    }}>{item}</Button>
                                )
                            }) : <></>}
                        {openNewLayout || layouts?.length === 0 ?
                            <Box sx={{
                                display: "flex",
                                alignItems: "center"
                            }}>
                                <TextField onChange={(e) => { setLayoutName(e.target.value) }} />
                                <Button onClick={() => { saveLayout(layoutName) }}>save layout</Button>
                                <Button onClick={() => { setOpenNewLayout(false) }}>X</Button>
                            </Box> :
                            <Button onClick={() => {
                                setGridItems({
                                    mainComponents: [
                                        ...gridItemsDefault
                                    ]
                                });
                                setSizes([]);
                                setActiveLayout("");
                                setLayoutName("");
                                setOpenNewLayout(true)
                            }}>+</Button>}
                    </Box>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <Typography>{activeLayout}</Typography>
                    </Box>
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
