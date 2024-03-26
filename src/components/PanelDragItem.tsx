import { itemTypes } from "@/itemTypes/itemTypes";
import { IPanelItem } from "@/pages/page2";
import { changeDragging } from "@/redux/features/dndSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { deleteItemPanel, findItemPanel } from "./PanelItem";

const PanelDragItem = ({
    item,
    setItems
}: any) => {
    const changeItemPosition = (changeItem: any, position: any) => {
        setItems((parentItems: IPanelItem) => {
            const newParentItems = { ...parentItems };
            const itemFound = findItemPanel(newParentItems, changeItem);

            if (itemFound.items) {
                itemFound.items = [
                    ...itemFound.items,
                    {
                        main: [changeItem],
                        direction: "horizontal"
                    }
                ]
            } else {
                itemFound.items =
                    [
                        {
                            main: [changeItem],
                            direction: "horizontal"
                        }
                    ]
            }


            deleteItemPanel(itemFound, changeItem);


            return { ...newParentItems }
        })
    }

    const ref = useRef(null);

    const [, drop] = useDrop({
        accept: itemTypes.COMPONENT
    });

    const [{ isDragging }, drag] = useDrag(() => ({
        type: itemTypes.COMPONENT,
        item,
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
            {item.name}
        </Box>
    )
};

export default PanelDragItem;
