import GridWrapper from "@/components/GridWrapper";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Grid = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <GridWrapper />
    </DndProvider>
  );
};

export default Grid;
