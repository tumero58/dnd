import Comp1 from "@/components/Comp1";
import Comp2 from "@/components/Comp2";
import Comp3 from "@/components/Comp3";
import Comp4 from "@/components/Comp4";
import GridItem from "@/components/GridItem";
import { setSizes } from "@/redux/features/layoutSlice";
import { Fragment, ReactElement } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";


export interface IGridItem {
    id: number | string;
    name: string;
    component: ReactElement;
    findIndex: number | string;
}

export interface IGridItems {
    mainComponents?: IGridItem[] | IGridItems;
    leftComponents?: IGridItem[] | IGridItems;
    rightComponents?: IGridItem[] | IGridItems;
    topComponents?: IGridItem[] | IGridItems;
    bottomComponents?: IGridItem[] | IGridItems;
}

export const gridItemsDefault: IGridItem[] = [
    { id: 1, name: "Comp1", component: <Comp1 />, findIndex: 1 },
    { id: 2, name: "Comp2", component: <Comp2 />, findIndex: 2 },
    { id: 3, name: "Comp3", component: <Comp3 />, findIndex: 3 },
    { id: 4, name: "Comp4", component: <Comp4 />, findIndex: 4 },
]

export const findItem = (name: string, items: any): any => {
    const foundItem = items.mainComponents?.find((item: any) => item.name === name);
    if (foundItem) {
        return foundItem
    } else {
        const keys = Object.keys(items);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (key !== "mainComponents") {
                const foundItem = findItem(name, items[key])
                if (foundItem) {
                    return foundItem;
                }
            }
        }
    }
};

export const deleteItem = (name: string, items: any): any => {
    const foundItem = items.mainComponents?.find((item: any) => item.name === name);
    if (foundItem) {
        items.mainComponents = items.mainComponents?.filter((item: any) => item.name !== name);
    } else {
        const keys = Object.keys(items);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (key !== "mainComponents") {
                deleteItem(name, items[key])
            }
        }
    }
    return items;
};

const getOppositeKey = (key: string) => {
    switch (key) {
        case "leftComponents":
            return "rightComponents";
        case "rightComponents":
            return "leftComponents";
        case "topComponents":
            return "bottomComponents";
        default:
            return "topComponents";
    }
}

export const insertItem = (item: any, positionChain: string[], items: any) => {
    if (positionChain.length > 1) {
        const nextKey = positionChain.shift();
        if (nextKey) {
            insertItem(item, positionChain, items[nextKey])
        }
    } else {
        const key = positionChain[0];
        if (key === "mainComponents") {
            items[key] = [...items[key], item]
        } else {
            const oppositeKey = getOppositeKey(key);
            items[oppositeKey] = {
                ...items
            };
            items.mainComponents = [];
            items[key] = {
                mainComponents: []
            };
            insertItem(item, ["mainComponents"], items[key])
        }
    }
};

export const cleanEmptyPositions = (items: any, prevKey: string = "", prevItems: any = {}) => {
    const keys = Object.keys(items);
    if (keys.length === 0) {
        return;
    }
    if (keys.length === 1) {
        if (keys[0] === "mainComponents" && items.mainComponents.length === 0) {
            delete prevItems[prevKey];
        }
    } else {
        keys.forEach((key: string) => {
            cleanEmptyPositions(items[key], key, items)
        })
    }
}

export const objectDepth = (o: any): any =>
    Object(o) === o ? 1 + Math.max(-1, ...Object.values(o).map(objectDepth)) : 0

export const itemsCleanup = (items: any) => {
    const depth = objectDepth(items);
    const repeatAmount = (depth / 3).toFixed();
    for (let i = 0; i < +repeatAmount; i++) {
        cleanEmptyPositions(items);
    }
}

export const orderGridItems = (gridItems: any, parentClassName: string = "", prevDirection?: string): any => {
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

    const beforeItems = orderGridItems(beforeMainItems, `${parentClassName}-${beforeClassName}`, direction);
    const afterItems = orderGridItems(afterMainItems, `${parentClassName}-${afterClassName}`, direction);

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
            arr: orderGridItems(gridItems, parentClassName, direction),
            parentClassName
        };
    }
}

export const renderPanel = (res: any, sizes: any, dispatch: any, setGridItems: Function) => {
    return (
        <PanelGroup direction={res.direction} onLayout={(numbers) => {
            dispatch(setSizes({
                ...sizes,
                [res.parentClassName || "main"]: numbers
            }))
        }}>
            {res.arr.map((item: any, index: number) => {
                const matchingSizes = sizes?.[res.parentClassName || "main"]?.length === res.arr.length;
                return (
                    <Fragment key={index + 1}>
                        <Panel
                            minSize={10}
                            defaultSize={matchingSizes ? sizes?.[res.parentClassName || "main"]?.[index] : undefined}
                        >
                            {item.direction ?
                                renderPanel(item, sizes, dispatch, setGridItems) :
                                <GridItem
                                    className={item.parentClassName}
                                    items={item.items}
                                    setItems={setGridItems}
                                />
                            }
                        </Panel>
                        {index + 1 !== res.arr.length ? <PanelResizeHandle /> : <></>}
                    </Fragment>
                )
            })}
        </PanelGroup>
    )
}