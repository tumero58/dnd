import Comp1 from "@/components/Comp1";
import Comp2 from "@/components/Comp2";
import Comp3 from "@/components/Comp3";
import { GRID_POSITIONS, GRID_POSITIONS_2 } from "./constants";

const { TOP_LEFT, TOP_RIGHT, BOTTOM } = GRID_POSITIONS;
export const gridItems = [
    { id: 1, name: 'Comp1', component: <Comp1 />, position: TOP_LEFT },
    { id: 2, name: 'Comp2', component: <Comp2 />, position: TOP_RIGHT },
    { id: 3, name: 'Comp3', component: <Comp3 />, position: BOTTOM },
];

const { MAIN } = GRID_POSITIONS_2;
export const gridItems2 = [
    { id: 1, name: "Comp1", component: <Comp1 />, position: MAIN },
    { id: 2, name: "Comp2", component: <Comp2 />, position: MAIN },
]