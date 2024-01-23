import GridItem from "@/components/GridItem";
import { GRID_POSITIONS_2 } from "@/utils/constants";
import { gridItems2 } from "@/utils/gridItems";
import { Box } from "@mui/material"
import { useState } from "react";
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

const Grid = () => {
    const [items, setItems] = useState(gridItems2);

    const returnItemsForPosition = (PositionName: any) => {
        return items.filter((item) => item.position === PositionName)
    };

    const { MAIN, TOP, LEFT, BOTTOM, RIGHT } = GRID_POSITIONS_2;

    const mainItems = returnItemsForPosition(MAIN);
    const topItems = returnItemsForPosition(TOP);
    const leftItems = returnItemsForPosition(LEFT);
    const bottomItems = returnItemsForPosition(BOTTOM);
    const rightItems = returnItemsForPosition(RIGHT);

    return (
        <DndProvider backend={HTML5Backend}>
            <Box sx={{
                padding: "16px",
                height: "100vh"
            }}>
                <GridItem currentItems={mainItems} setItems={setItems} />
            </Box>
        </DndProvider>
    )
};

export default Grid;
