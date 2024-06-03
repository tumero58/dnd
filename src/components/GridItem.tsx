import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import DragItem from "./DragItem";
import { useDispatch, useSelector } from "react-redux";
import { getDndDragging } from "@/redux/features/dndSlice";
import DropAreaGrid from "./DropAreaGrid";
import { components, deleteItem, IGridItem, itemsCleanup } from "@/utils/gridItems";
import { setClicked, setDuplicateItem, setDuplicateProps, setGridItemsCb, setPoints } from "@/redux/features/gridSlice";

const GridItem = ({ items, className, }: { items: IGridItem[], className: any }) => {
  const dispatch = useDispatch();
  const isDragging = useSelector(getDndDragging);

  const [ activeItem, setActiveItem ] = useState<any>(items?.[0] || {});

  const handleItemClick = (item: any) => {
    setActiveItem(item);
  };

  const handleClose = (item: any) => {
    dispatch(setGridItemsCb((items: any) => {
      const newItems = deleteItem(item.name, items);
      itemsCleanup(newItems);
      return { ...newItems };
    }));
  };

  useEffect(() => {
    if (items.length !== 0) {
      const currentItemIds = items.map((item: any) => item.id);
      if (activeItem) {
        if (!currentItemIds.includes(activeItem.id)) {
          setActiveItem(items[0]);
        }
      }
    }
  }, [ items, activeItem ]);

  const [ screenWidth, setScreenWidth ] = useState(0);
  const [ screenHeight, setScreenHeight ] = useState(0);

  useEffect(() => {
    if (isDragging) {
      const element = document.getElementById(`${className}screen`);

      if (element) {
        setScreenWidth(element.clientWidth);
        setScreenHeight(element.clientHeight);
      }
    }
  }, [ isDragging, className ]);

  const activeComponent = components.find(item =>
    item.id === items?.find((item: IGridItem) =>
      item.id === activeItem?.id)?.findIndex)?.component;

  return (
    <Box sx={{
      width: "100%",
      height: "100%",
      position: "relative",
      paddingTop: "26px",
      border: "1px solid grey",
      borderRadius: "4px",
    }} id={`${className}screen`}>
      <Box sx={{
        display: "flex",
        position: "absolute",
        top: 0,
        left: 0
      }}>
        {items?.map((item: any, index: number) => (
          <Box key={item.id} sx={{
            height: "26px",
            paddingX: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            backgroundColor: item.id === activeItem?.id ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.05)",
            cursor: "pointer"
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            dispatch(setClicked(true));
            dispatch(setPoints({
              x: e.pageX,
              y: e.pageY,
            }));
            dispatch(setDuplicateProps({
              main: `${className}-mainComponents`,
              top: `${className}-topComponents`,
              left: `${className}-leftComponents`,
              right: `${className}-rightComponents`,
              bottom: `${className}-bottomComponents`
            }));
            dispatch(setDuplicateItem(item));
          }} onClick={() => {
            handleItemClick(item);
          }}>
            <DragItem
              name={item.name}
              currentPositionName={item.position}
              index={index}
              component={item.component}
            />
            <Box sx={{
              cursor: "pointer",
              color: "rgba(0, 0, 0, 0.2)",
              userSelect: "none",
              ":hover": {
                color: "black"
              }
            }} onClick={(e) => {
              e.stopPropagation();
              handleClose(item);
            }}>x</Box>
          </Box>
        ))}
      </Box>
      {activeComponent}
      {isDragging ?
        <Box sx={{
          position: "absolute",
          left: 0,
          top: 0,
          width: screenWidth,
          height: screenHeight,
          backgroundColor: "rgba(0,0,0,0.2)",
          borderRadius: "4px"
        }}>
          <Box sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column"
          }}>
            <Box sx={{
              height: "26px",
              width: "100%",
            }}>
              <DropAreaGrid position={`${className}-mainComponents`}></DropAreaGrid>
            </Box>
            <Box sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
              <Box sx={{
                width: screenWidth / 2,
                height: (screenHeight / 4) - 26
              }}>
                <DropAreaGrid position={`${className}-topComponents`}></DropAreaGrid>
              </Box>
              <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%"
              }}>
                <Box sx={{
                  height: screenHeight / 2,
                  width: screenWidth / 4
                }}>
                  <DropAreaGrid position={`${className}-leftComponents`}></DropAreaGrid>
                </Box>
                <Box sx={{
                  height: screenHeight / 2,
                  width: screenWidth / 4
                }}>
                  <DropAreaGrid position={`${className}-rightComponents`}></DropAreaGrid>
                </Box>
              </Box>
              <Box sx={{
                width: screenWidth / 2,
                height: (screenHeight / 4)
              }}>
                <DropAreaGrid position={`${className}-bottomComponents`}></DropAreaGrid>
              </Box>
            </Box>
          </Box>
        </Box> : <></>}
    </Box>

  );
};

export default GridItem;
