import DropArea from "@/components/DropArea";
import ItemsWrapper from "@/components/ItemsWrapper";
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
                            <DropArea position={TOP_LEFT} >
                                <ItemsWrapper currentItems={topLeftItems} setItems={setItems} />
                            </DropArea>
                        </div>
                        <div style={{
                            height: "100%",
                            width: "70%",
                            border: "1px solid grey",
                            borderRadius: "4px",
                        }}>
                            <DropArea position={TOP_RIGHT} >
                                <ItemsWrapper currentItems={topRightItems} setItems={setItems} />
                            </DropArea>
                        </div>
                    </div>
                    <div style={{
                        height: "100%",
                        width: "100%",
                        border: "1px solid grey",
                        borderRadius: "4px",
                    }}>
                        <DropArea position={BOTTOM}>
                            <ItemsWrapper currentItems={bottomItems} setItems={setItems} />
                        </DropArea>
                    </div>
                </div>
            </div>
        </DndProvider>
    )
};

export default Test;
