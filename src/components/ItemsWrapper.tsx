import DragItem from "./DragItem";

const ItemsWrapper = ({ currentItems, setItems }: any) => {
    return (
        <div style={{
            width: "100%",
            height: "100%"
        }}>
            <div style={{
                display: "flex",
                gap: "16px"
            }}>
                {currentItems?.map((item: any, index: number) => (
                    <DragItem
                        key={item.id}
                        name={item.name}
                        currentPositionName={item.position}
                        setItems={setItems}
                        index={index}
                        component={item.component}
                    />
                ))}
            </div>
        </div>
    )
};

export default ItemsWrapper;
