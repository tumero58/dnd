import { itemTypes } from "@/itemTypes/itemTypes";
import { changeDragging } from "@/redux/features/dndSlice";
import { setGridItemsCb } from "@/redux/features/gridSlice";
import { useAppDispatch } from "@/redux/hooks";
import { deleteItem, findItem, insertItem, itemsCleanup } from "@/utils/gridItems";
import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

const DragItem = ({
  name
}: any) => {
  const dispatch = useAppDispatch();
  const changeItemPosition = (item: any, position: any) => {
    dispatch(setGridItemsCb((items: any) => {
      const positionChain = position.split("-");
      positionChain.shift();

      const itemToMove = findItem(item.name, items);
      const newItems = deleteItem(item.name, items);

      insertItem(itemToMove, positionChain, newItems);
      itemsCleanup(newItems);

      return { ...newItems };
    }));
  };

  const ref = useRef(null);

  const [ , drop ] = useDrop({
    accept: itemTypes.COMPONENT
  });

  const [ { isDragging }, drag ] = useDrag(() => ({
    type: itemTypes.COMPONENT,
    item: { name, type: itemTypes.COMPONENT },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult: any = monitor.getDropResult();
      if (dropResult) {
        const { position } = dropResult;
        if (position) {
          changeItemPosition(item, position);
        }
      }
    },
  }));

  const opacity = isDragging ? 0.4 : 1;

  drag(drop(ref));

  useEffect(() => {
    dispatch(changeDragging(isDragging));
  }, [ isDragging, dispatch ]);

  return (
    <Box ref={ref} sx={{ opacity }}>
      {name}
    </Box>
  );
};

export default DragItem;
