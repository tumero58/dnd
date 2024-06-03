import { gridItemsDefault, IGridItem, IGridItems } from "@/utils/gridItems";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface IPoints {
    x: number;
    y: number;
};

interface IDuplicateProps {
    main: string,
    top: string,
    left: string,
    right: string,
    bottom: string
}

export type IGridState = {
    // gridItems: IGridItems;
    clicked: boolean;
    points: IPoints,
    duplicateProps: IDuplicateProps,
    duplicateItem: IGridItem | undefined,

};

const initialState: IGridState = {
    // gridItems: {
    //     mainComponents: [
    //         ...gridItemsDefault
    //     ]
    // },
    clicked: false,
    points: {
        x: 0,
        y: 0,
    },
    duplicateProps: {
        main: "",
        top: "",
        left: "",
        right: "",
        bottom: ""
    },
    duplicateItem: undefined
};

export const gridSlice = createSlice({
    name: "grid",
    initialState,
    reducers: {
        // setGridItems: (state: IGridState, action: { payload: IGridItems }) => {
        //     state.gridItems = action.payload;
        // },
        setClicked: (state: IGridState, action: { payload: boolean }) => {
            state.clicked = action.payload;
        },
        setPoints: (state: IGridState, action: { payload: IPoints }) => {
            state.points = action.payload;
        },
        setDuplicateProps: (state: IGridState, action: { payload: IDuplicateProps }) => {
            state.duplicateProps = action.payload;
        },
        setDuplicateItem: (state: IGridState, action: { payload: IGridItem | undefined }) => {
            state.duplicateItem = action.payload;
        },
    }
});

export const {
    // setGridItems,
    setClicked,
    setPoints,
    setDuplicateProps,
    setDuplicateItem
} = gridSlice.actions;

// export const getGridItems = (state: RootState) => state.grid.gridItems;
export const getClicked = (state: RootState) => state.grid.clicked;
export const getPoints = (state: RootState) => state.grid.points;
export const getDuplicateProps = (state: RootState) => state.grid.duplicateProps;
export const getDuplicateItem = (state: RootState) => state.grid.duplicateItem;

export default gridSlice.reducer;