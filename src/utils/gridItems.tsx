import Comp1 from "@/components/Comp1";
import Comp2 from "@/components/Comp2";
import Comp3 from "@/components/Comp3";
import { GRID_POSITIONS } from "./constants";
import { ReactElement } from "react";
import Comp4 from "@/components/Comp4";

const { TOP_LEFT, TOP_RIGHT, BOTTOM } = GRID_POSITIONS;
export const gridItems = [
    { id: 1, name: 'Comp1', component: <Comp1 />, position: TOP_LEFT },
    { id: 2, name: 'Comp2', component: <Comp2 />, position: TOP_RIGHT },
    { id: 3, name: 'Comp3', component: <Comp3 />, position: BOTTOM },
];
export interface IGridItems {
    id: number;
    name: string;
    component: ReactElement;
}
export const gridItems2: IGridItems[] = [
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
            items[key] = {
                mainComponents: []
            };
            insertItem(item, ["mainComponents"], items[key])
        }
    }

}