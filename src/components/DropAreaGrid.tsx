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
            background: isOver ? "rgba(0, 128, 0,0.5)" : "transparent",
            border: "4px solid",
            borderColor: isOver ? "rgba(0, 128, 0,0.8)" : "transparent",
            borderRadius: "16px",
            transition: "all 1s ease"
        }} className={position} ref={drop}>
            {children}
        </Box>
    )
};

export default DropAreaGrid;
