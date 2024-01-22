import { useState } from "react";
import DragItem from "./DragItem";

const ItemsWrapper = ({ currentItems, setItems }: any) => {
    const [activeItem, setActiveItem] = useState<any>(currentItems?.[0] || {});
    const handleItemClick = (item: any) => {
        setActiveItem(item);
    };
    return (
        <div style={{
            width: "100%",
            height: "100%",
            position: "relative",
            paddingTop: "20px"
        }}>
            <div style={{
                display: "flex",
                gap: "16px",
                position: "absolute",
                top: 0,
                left: 0
            }}>
                {currentItems?.map((item: any, index: number) => (
                    <div key={item.id} style={{
                        background: item.id === activeItem?.id ? "yellow" : "white"
                    }} onClick={() => {
                        handleItemClick(item);
                    }}>
                        <DragItem
                            name={item.name}
                            currentPositionName={item.position}
                            setItems={setItems}
                            index={index}
                            component={item.component}
                        />
                    </div>
                ))}
            </div>
            {currentItems?.find((item: any) => item.id === activeItem?.id)?.component}
        </div>
    )
};

export default ItemsWrapper;
