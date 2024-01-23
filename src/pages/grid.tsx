import GridItems from "@/components/GridItems";
import { Box } from "@mui/material";
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

const Grid = () => {
    return (
        <DndProvider backend={HTML5Backend}>
            <Box sx={{
                padding: "16px",
                height: "100vh"
            }}>
                <GridItems />
            </Box>
        </DndProvider>
    )
};

export default Grid;
