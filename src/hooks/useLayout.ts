import { gridItemsDefault, orderGridItems } from "@/utils/gridItems";
import { useCallback, useEffect, useState } from "react";

const useLayout = (gridItems: any, setGridItems: Function) => {
    const [renderReady, setRenderReady] = useState(false);
    const [sizes, setSizes] = useState<any>({});
    const [layoutName, setLayoutName] = useState("");
    const [layouts, setLayouts] = useState([]);
    const [activeLayout, setActiveLayout] = useState("");
    const orderedGridItems = orderGridItems(gridItems);
    const [openNewLayout, setOpenNewLayout] = useState(false);

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
    }, []);

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
    }, [syncComponents, setGridItems])

    useEffect(() => {
        const activeLayoutLocal = localStorage.getItem("activeLayout");
        if (activeLayoutLocal) {
            loadLayout(activeLayoutLocal);
        }
        setRenderReady(true)
    }, [loadLayout])


    useEffect(() => {
        if (activeLayout) {
            const layout = {
                items: gridItems,
                sizes
            }
            localStorage.setItem(activeLayout, JSON.stringify(layout))
        }
    }, [gridItems, sizes, activeLayout])


    useEffect(() => {
        const layoutsLocal = localStorage.getItem("layoutsList");
        if (layoutsLocal) {
            const layoutsParsed = JSON.parse(layoutsLocal);
            setLayouts(layoutsParsed);
        }
    }, []);

    return {
        renderReady,
        saveLayout, loadLayout,
        layouts, activeLayout, openNewLayout, orderedGridItems, layoutName, sizes,
        setLayouts, setLayoutName, setOpenNewLayout, setSizes, setActiveLayout,
    }

};

export default useLayout;