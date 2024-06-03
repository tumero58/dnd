import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ISizes {
    [key: string]: number[]
};

interface ILayoutState {
    sizes: ISizes;
    layouts: string[];
    activeLayout: string;
    openNewLayout: boolean;
};

const initialState: ILayoutState = {
  sizes: {},
  layouts: [],
  activeLayout: "",
  openNewLayout: false
};

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setSizes: (state: ILayoutState, action: { payload: ISizes }) => {
      state.sizes = action.payload;
    },
    setLayouts: (state: ILayoutState, action: { payload: string[] }) => {
      state.layouts = action.payload;
    },
    setActiveLayout: (state: ILayoutState, action: { payload: string }) => {
      state.activeLayout = action.payload;
    },
    setOpenNewLayout: (state: ILayoutState, action: { payload: boolean }) => {
      state.openNewLayout = action.payload;
    },
  }
});

export const {
  setSizes,
  setLayouts,
  setActiveLayout,
  setOpenNewLayout
} = layoutSlice.actions;

export const getSizes = (state: RootState) => state.layout.sizes;
export const getLayouts = (state: RootState) => state.layout.layouts;
export const getActiveLayout = (state: RootState) => state.layout.activeLayout;
export const getOpenNewLayout = (state: RootState) => state.layout.openNewLayout;

export default layoutSlice.reducer;
