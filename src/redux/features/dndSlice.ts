import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type IDndState = {
    dragging: boolean;
};

const initialState: IDndState = {
  dragging: false
};

export const dndSlice = createSlice({
  name: "dnd",
  initialState,
  reducers: {
    changeDragging: (state: IDndState, action: { payload: boolean }) => {
      state.dragging = action.payload;
    }
  }
});

export const {
  changeDragging
} = dndSlice.actions;

export const getDndDragging = (state: RootState) => state.dnd.dragging;

export default dndSlice.reducer;
