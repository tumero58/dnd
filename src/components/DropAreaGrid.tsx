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
            background: isOver ? "rgba(0, 128, 0,0.5)" : "rgba(255,255,0,0.5)",
            border: "4px solid",
            borderColor: isOver ? "rgba(0, 128, 0,0.8)" : "rgba(255,255,0,0.8)",
            borderRadius: "16px",
            backdropFilter: "blur(3px)"
        }} className={position} ref={drop}>
            {children}
        </Box>
    )
};

export default DropAreaGrid;
