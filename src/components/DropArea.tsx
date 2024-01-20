import { itemTypes } from "@/itemTypes/itemTypes";
import { useDrop } from "react-dnd";

const DropArea = ({ position, children }: any) => {
    const [{ isOver }, drop] = useDrop({
        accept: itemTypes.COMPONENT,
        drop: () => ({ position }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    });
    return (
        <div style={{
            height: "100%",
            width: "100%",
            background: isOver ? "rgba(255,255,0,0.2)" : "transparent"
        }} className={position} ref={drop}>
            {children}
        </div>
    )
};

export default DropArea;
