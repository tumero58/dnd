import { itemTypes } from "@/itemTypes/itemTypes";
import { GRID_POSITIONS } from "@/utils/constants";
import { Box } from "@mui/material";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

const DragItem = ({
    name,
    index,
    currentPositionName,
    setItems
}: any) => {
    const changeItemPosition = (currentItem: any, positionName: any) => {
        setItems((prevState: any) => {
            return prevState.map((e: any) => {
                return {
                    ...e,
                    position: e.name === currentItem.name ? positionName : e.position
                };
            });
        });
    };

    const ref = useRef(null);

    const [, drop] = useDrop({
        accept: itemTypes.COMPONENT
    });

    const [{ isDragging }, drag] = useDrag(() => ({
        type: itemTypes.COMPONENT,
        item: { index, name, currentPositionName, type: itemTypes.COMPONENT },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
        end: (item, monitor) => {
            const dropResult: any = monitor.getDropResult();
            if (dropResult) {
                const { position } = dropResult;
                const { TOP_LEFT, TOP_RIGHT, BOTTOM } = GRID_POSITIONS;
                switch (position) {
                    case TOP_LEFT:
                        changeItemPosition(item, TOP_LEFT);
                        break;
                    case TOP_RIGHT:
                        changeItemPosition(item, TOP_RIGHT);
                        break;
                    case BOTTOM:
                        changeItemPosition(item, BOTTOM);
                        break;
                    default:
                        break;
                }
            }
        },
    }));

    const opacity = isDragging ? 0.4 : 1;

    drag(drop(ref));


    return (
        <Box ref={ref} sx={{ opacity }}>
            {name}
        </Box>
    )
};

export default DragItem;
