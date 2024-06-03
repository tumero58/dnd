import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import dndReducer from "./features/dndSlice";
import gridReducer from "./features/gridSlice";
import layoutReducer from "./features/layoutSlice";

export const store = configureStore({
  reducer: {
    dnd: dndReducer,
    grid: gridReducer,
    layout: layoutReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
