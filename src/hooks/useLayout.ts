import { getGridItems, setGridItems } from "@/redux/features/gridSlice";
import { getActiveLayout, getSizes, setActiveLayout, setLayouts, setOpenNewLayout, setSizes } from "@/redux/features/layoutSlice";
import { useAppSelector } from "@/redux/hooks";
import { orderGridItems } from "@/utils/gridItems";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useLayout = () => {
  const gridItems = useAppSelector(getGridItems);
  const [ renderReady, setRenderReady ] = useState(false);
  const dispatch = useDispatch();
  const sizes = useAppSelector(getSizes);
  const activeLayout = useAppSelector(getActiveLayout);
  const orderedGridItems = orderGridItems(gridItems);

  const saveLayout = useCallback((name: string) => {
    if (!name) {
      return;
    }
    dispatch(setActiveLayout(name));
    localStorage.setItem("activeLayout", name);
    const prevLayouts = localStorage.getItem("layoutsList");
    if (prevLayouts) {
      const prevLayoutsParsed = JSON.parse(prevLayouts);
      if (prevLayoutsParsed.includes(name)) {
        return;
      }
      const newLayoutsList = [ ...prevLayoutsParsed, name ];
      localStorage.setItem("layoutsList", JSON.stringify(newLayoutsList));
    } else {
      const layoutsList = [ name ];
      localStorage.setItem("layoutsList", JSON.stringify(layoutsList));
    }
    const layout = {
      items: gridItems,
      sizes
    };
    localStorage.setItem(name, JSON.stringify(layout));
    const layoutsLocal = localStorage.getItem("layoutsList");
    if (layoutsLocal) {
      const layoutsParsed = JSON.parse(layoutsLocal);
      dispatch(setLayouts(layoutsParsed));
    }
    dispatch(setOpenNewLayout(false));
  }, [ gridItems, sizes, dispatch ]);

  const loadLayout = useCallback((name: string) => {
    const layout = localStorage.getItem(name);
    if (layout) {
      dispatch(setActiveLayout(name));
      localStorage.setItem("activeLayout", name);
      const layoutParsed = JSON.parse(layout || "");
      const { items, sizes } = layoutParsed;
      dispatch(setGridItems(items));
      dispatch(setSizes(sizes));
    }
  }, [ dispatch ]);

  useEffect(() => {
    const activeLayoutLocal = localStorage.getItem("activeLayout");
    if (activeLayoutLocal) {
      loadLayout(activeLayoutLocal);
    }
    setRenderReady(true);
  }, [ loadLayout ]);

  useEffect(() => {
    if (activeLayout) {
      const layout = {
        items: gridItems,
        sizes
      };
      localStorage.setItem(activeLayout, JSON.stringify(layout));
    }
  }, [ gridItems, sizes, activeLayout ]);

  useEffect(() => {
    const layoutsLocal = localStorage.getItem("layoutsList");
    if (layoutsLocal) {
      const layoutsParsed = JSON.parse(layoutsLocal);
      dispatch(setLayouts(layoutsParsed));
    }
  }, [ dispatch ]);

  return {
    renderReady,
    saveLayout, loadLayout,
    orderedGridItems
  };

};

export default useLayout;
