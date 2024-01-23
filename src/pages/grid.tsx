import GridWrapper from "@/components/GridWrapper";
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
                <GridWrapper />
            </Box>
        </DndProvider>
    )
};

export default Grid;
