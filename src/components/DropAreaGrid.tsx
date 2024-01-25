import { itemTypes } from "@/itemTypes/itemTypes";
import { Box } from "@mui/material";
import { useDrop } from "react-dnd";

const DropAreaGrid = ({ position, children }: any) => {
    const [{ isOver }, drop] = useDrop({
        accept: itemTypes.COMPONENT,
        drop: () => ({ position }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    });

    return (
        <Box sx={{
            height: "100%",
            width: "100%",
            background: isOver ? "green" : "yellow"
        }} className={position} ref={drop}>
            {children}
        </Box>
    )
};

export default DropAreaGrid;
