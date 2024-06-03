import useLayout from "@/hooks/useLayout";
import { findItem, gridItemsDefault, IGridItems, insertItem, itemsCleanup, renderPanel } from "@/utils/gridItems";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { styles } from "./GridWrapper.styles";
import DeleteIcon from "@mui/icons-material/Delete";
import Popup from "reactjs-popup";
import { PopupActions } from "reactjs-popup/dist/types";
import { useAppSelector } from "@/redux/hooks";
import { getClicked, getDuplicateItem, getDuplicateProps, getPoints, setClicked, setDuplicateItem, setDuplicateProps, setGridItems, setGridItemsCb, setPoints } from "@/redux/features/gridSlice";
import { useDispatch } from "react-redux";
import { getActiveLayout, getLayouts, getOpenNewLayout, getSizes, setActiveLayout, setLayouts, setOpenNewLayout, setSizes } from "@/redux/features/layoutSlice";
import "reactjs-popup/dist/index.css";

const GridWrapper = () => {
  const dispatch = useDispatch();

  const popupRef = useRef<PopupActions>(null);

  const {
    renderReady,
    saveLayout, loadLayout,
    orderedGridItems
  } = useLayout();

  const clicked = useAppSelector(getClicked);
  const points = useAppSelector(getPoints);
  const duplicateProps = useAppSelector(getDuplicateProps);
  const duplicateItem = useAppSelector(getDuplicateItem);

  const layouts = useAppSelector(getLayouts);
  const sizes = useAppSelector(getSizes);
  const activeLayout = useAppSelector(getActiveLayout);
  const openNewLayout = useAppSelector(getOpenNewLayout);
  const [ layoutName, setLayoutName ] = useState("");

  const [ miniMenuOpen, setMiniMenuOpen ] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if ((e.target as any)?.role === "menuitem") {
        return;
      }
      dispatch(setClicked(false));
      dispatch(setDuplicateItem(undefined));
      dispatch(setDuplicateProps({
        main: "",
        top: "",
        left: "",
        right: "",
        bottom: ""
      }));
      dispatch(setPoints({
        x: 0,
        y: 0,
      }));
      setMiniMenuOpen(false);
    };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [ dispatch ]);

  const handleCreateNewLayout = () => {
    dispatch(setGridItems({
      mainComponents: [
        ...gridItemsDefault
      ]
    }));
    dispatch(setSizes({ main: [ 100 ] }));
    dispatch(setActiveLayout(""));
    dispatch(setOpenNewLayout(true));
    setLayoutName("");
  };

  const handleCloseModule = () => {
    dispatch(setOpenNewLayout(false));
    const activeLayoutLocal = localStorage.getItem("activeLayout");
    if (activeLayoutLocal) {
      loadLayout(activeLayoutLocal);
    }
  };

  const handleDeleteLayout = (layoutName: string) => {
    const newLayouts = layouts.filter((item) => item !== layoutName);
    if (activeLayout === layoutName) {
      const lastLayout = newLayouts[newLayouts.length - 1];
      if (lastLayout) {
        loadLayout(lastLayout);
      } else {
        dispatch(setActiveLayout(""));
        localStorage.removeItem("activeLayout");
        dispatch(setGridItems({
          mainComponents: [
            ...gridItemsDefault
          ]
        }));
        dispatch(setSizes({ main: [ 100 ] }));
      }
    }
    localStorage.removeItem(layoutName);
    dispatch(setLayouts(newLayouts));
    localStorage.setItem("layoutsList", JSON.stringify(newLayouts));
  };

  const handleDuplicateItem = (position: "main" | "top" | "left" | "right" | "bottom") => {
    dispatch(setGridItemsCb((items: IGridItems) => {
      const positionChain = duplicateProps[position].split("-");
      positionChain.shift();
      const newItemProps = `${duplicateItem?.name || ""}(c)`;
      const foundItem = findItem(newItemProps, items);
      const newItem = {
        ...duplicateItem,
        name: foundItem?.name ? `${newItemProps}(c)` : newItemProps,
        id: foundItem?.name ? `${newItemProps}(c)` : newItemProps
      };
      const newItems = { ...items };
      insertItem(newItem, positionChain, newItems);
      itemsCleanup(newItems);

      return { ...newItems };
    }));
  };

  if (renderReady) {
    return (
      <>
        <Box sx={styles.wrapper}>
          <Box sx={styles.flexAlignCenter}>
            {layouts?.length > 0 ?
              layouts.map((item: string, index: number) => {
                return (
                  <Box sx={{
                    ...styles.flexAlignCenter,
                    ...styles.isActiveBorder(activeLayout, item)
                  }} key={index + 1}>
                    <Button
                      key={index + 1}
                      onClick={() => {
                        loadLayout(item);
                      }}
                      sx={styles.isActive(activeLayout, item)}
                    >{item}</Button>
                    <Popup
                      trigger={<Button><DeleteIcon /></Button>}
                      modal
                      ref={popupRef}
                    >
                      <Box sx={{
                        ...styles.flexAlignCenter,
                        flexDirection: "column"
                      }}>
                        <Typography>Delete layout: {item} ?</Typography>
                        <Button onClick={() => {
                          handleDeleteLayout(item);
                          popupRef?.current?.close();
                        }}>yes</Button>
                        <Button onClick={() => {
                          popupRef?.current?.close();
                        }}>no</Button>
                      </Box>
                    </Popup>
                  </Box>
                );
              }) : <></>}
            {openNewLayout || layouts?.length === 0 ?
              <Box sx={styles.flexAlignCenter}>
                <TextField onChange={(e) => { setLayoutName(e.target.value); }} />
                <Button onClick={() => { saveLayout(layoutName); }}>save layout</Button>
                <Button onClick={handleCloseModule}>X</Button>
              </Box> :
              <Button onClick={handleCreateNewLayout}>+</Button>}
          </Box>
          <Box sx={styles.flexJustifyCenter}>
            <Typography>{activeLayout}</Typography>
          </Box>
          <Box sx={styles.panelWrapper}>
            {renderPanel(orderedGridItems, sizes, dispatch)}
            {clicked && (
              <Box sx={{
                position: "absolute",
                top: points.y,
                left: points.x,
                display: "flex",
                background: "white",

              }}>
                <Box sx={{
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #1976d2",
                  position: "relative"
                }}>
                  <Button onClick={() => {
                    handleDuplicateItem("main");
                  }}>{"duplicate ○"}</Button>
                  <Button role={"menuitem"} onClick={() => { setMiniMenuOpen((o) => !o); }}>
                    duplicate {miniMenuOpen ? "▼" : "►"}
                  </Button>
                  {miniMenuOpen ?
                    <Box sx={{
                      display: "flex",
                      flexDirection: "column",
                      border: "1px solid #1976d2",
                      borderRadius: "16px",
                      borderTopLeftRadius: "0",
                      position: "absolute",
                      right: 0,
                      top: 37,
                      transform: "translateX(100%)",
                      width: "max-content"
                    }}>
                      <Button onClick={() => {
                        handleDuplicateItem("top");
                      }}>{"duplicate ↑"}</Button>
                      <Button onClick={() => {
                        handleDuplicateItem("left");
                      }}>{"duplicate ←"}</Button>
                      <Button onClick={() => {
                        handleDuplicateItem("bottom");
                      }}>{"duplicate ↓"}</Button>
                      <Button onClick={() => {
                        handleDuplicateItem("right");
                      }}>{"duplicate →"}</Button>
                    </Box> : <></>}
                </Box>

              </Box>
            )}
          </Box>
        </Box>
      </>
    );
  } else {
    return <></>;
  }
};

export default GridWrapper;
