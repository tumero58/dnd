import CompSpace from "@/components/CompSpace";
import MovableTab from "@/components/MovableTab";
import { GRID_POSITIONS } from "@/utils/constants";
import { gridItems } from "@/utils/gridItems";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Test = () => {
    const [items, setItems] = useState(gridItems);

    const returnItemsForPosition = (PositionName: any) => {
        return items.filter((item) => item.position === PositionName)
    };

    const { TOP_LEFT, TOP_RIGHT, BOTTOM } = GRID_POSITIONS;

    const topLeftItems = returnItemsForPosition(TOP_LEFT);
    const topRightItems = returnItemsForPosition(TOP_RIGHT);
    const bottomItems = returnItemsForPosition(BOTTOM);

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={{
                padding: "16px"
            }}>
                <div style={{
                    width: "100%",
                    height: "700px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px"
                }}>
                    <div style={{
                        display: "flex",
                        gap: "16px",
                        height: "500px",
                    }}>
                        <div style={{
                            height: "100%",
                            width: "30%",
                            border: "1px solid grey",
                            borderRadius: "4px",
                        }}>
                            <CompSpace position={TOP_LEFT} >
                                {topLeftItems?.map((item, index) => (
                                    <MovableTab
                                        key={item.id}
                                        name={item.name}
                                        currentPositionName={item.position}
                                        setItems={setItems}
                                        index={index}
                                        component={item.component}
                                    />
                                ))}
                            </CompSpace>
                        </div>
                        <div style={{
                            height: "100%",
                            width: "70%",
                            border: "1px solid grey",
                            borderRadius: "4px",
                        }}>
                            <CompSpace position={TOP_RIGHT} >
                                {topRightItems?.map((item, index) => (
                                    <MovableTab
                                        key={item.id}
                                        name={item.name}
                                        currentPositionName={item.position}
                                        setItems={setItems}
                                        index={index}
                                        component={item.component}
                                    />
                                ))}
                            </CompSpace>
                        </div>
                    </div>
                    <div style={{
                        height: "100%",
                        width: "100%",
                        border: "1px solid grey",
                        borderRadius: "4px",
                    }}>
                        <CompSpace position={BOTTOM}>
                            {bottomItems?.map((item, index) => (
                                <MovableTab
                                    key={item.id}
                                    name={item.name}
                                    currentPositionName={item.position}
                                    setItems={setItems}
                                    index={index}
                                    component={item.component}
                                />
                            ))}
                        </CompSpace>
                    </div>
                </div>
            </div>
        </DndProvider>
    )
};

export default Test;
