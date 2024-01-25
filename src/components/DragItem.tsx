import { itemTypes } from "@/itemTypes/itemTypes";
import { changeDragging } from "@/redux/features/dndSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

const DragItem = ({
    name,
    index,
    setItems
}: any) => {
    const changeItemPosition = (item: any, position: any) => {
        setItems((items: any) => {
            const itemToMove = items.mainComponents.find((newItem: any) => newItem.name === item.name);
            let newItems = { ...items };
            newItems[position].mainComponents = [itemToMove];
            newItems.mainComponents = newItems.mainComponents.filter((currentItem: any) => currentItem.name !== itemToMove.name);
            return newItems;
        })
    }

    const ref = useRef(null);

    const [, drop] = useDrop({
        accept: itemTypes.COMPONENT
    });

    const [{ isDragging }, drag] = useDrag(() => ({
        type: itemTypes.COMPONENT,
        item: { index, name, type: itemTypes.COMPONENT },
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

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(changeDragging(isDragging))
    }, [isDragging, dispatch])


    return (
        <Box ref={ref} sx={{ opacity }}>
            {name}
        </Box>
    )
};

export default DragItem;
