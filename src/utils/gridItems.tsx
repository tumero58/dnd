import Comp1 from "@/components/Comp1";
import Comp2 from "@/components/Comp2";
import Comp3 from "@/components/Comp3";
import Comp4 from "@/components/Comp4";
import { Box } from "@mui/material";
import { ReactElement } from "react";

export interface IGridItem {
    id: number;
    name: string;
    component: ReactElement;
}
export const gridItemsDefault: IGridItem[] = [
    { id: 1, name: "Comp1", component: <Comp1 /> },
    { id: 2, name: "Comp2", component: <Comp2 /> },
    { id: 3, name: "Comp3", component: <Comp3 /> },
    { id: 4, name: "Comp4", component: <Comp4 /> },
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



// const [gridItems, setGridItems] = useState({
//     mainComponents: [
//         { id: 1, name: "Comp1", component: <Comp1 /> },
//         { id: 2, name: "Comp2", component: <Comp2 /> },
//         { id: 3, name: "Comp3", component: <Comp3 /> },
//         { id: 4, name: "Comp4", component: <Comp4 /> },
//     ],
//     neighbors: {
//         direction: "vertical",
//         mainComponents: [
//             { id: 1, name: "Comp1", component: <Comp1 /> },
//             { id: 2, name: "Comp2", component: <Comp2 /> },
//         ]
//     }
// })

// const direction = gridItems.neighbors.direction || "horizontal";
//         const itemsToRender = [];
//         itemsToRender.push(gridItems.mainComponents);
//         if (gridItems?.neighbors?.mainComponents?.length > 0) {
//             gridItems.neighbors.mainComponents.forEach((item: any) => {
//                 itemsToRender.push([item])
//             })
//         }

//         <PanelGroup direction={direction}>
//                 {itemsToRender?.map((item: any, index: number) => {
//                     return (
//                         <Fragment key={index + 1}>
//                             <Panel minSize={20}>
//                                 <GridItem className={""} items={item} setItems={()=>{}} />
//                             </Panel>
//                             {index + 1 !== itemsToRender.length ? <PanelResizeHandle /> : <></>}
//                         </Fragment>
//                     )
//                 })}
//             </PanelGroup>