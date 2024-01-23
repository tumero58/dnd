import { gridItems2 } from "@/utils/gridItems";
import { Box } from "@mui/material";
import { useState } from "react";
import GridItem from "./GridItem";

const GridWrapper = () => {
    const [gridItems, setGridItems] = useState({
        mainComponents: [
            ...gridItems2
        ],
        topComponents: {
            mainComponents: [
                // gridItems2[1]
            ],
            topComponents: {

            },
            leftComponents: {

            },
            bottomComponents: {

            },
            rightComponents: {

            }
        },
        leftComponents: {
            mainComponents: [
                // gridItems2[1]
            ],
            topComponents: {

            },
            leftComponents: {

            },
            bottomComponents: {

            },
            rightComponents: {

            }
        },
        bottomComponents: {
            mainComponents: [
                // gridItems2[1]
            ],
            topComponents: {

            },
            leftComponents: {

            },
            bottomComponents: {

            },
            rightComponents: {

            }
        },
        rightComponents: {
            mainComponents: [
                // gridItems2[1]
            ],
            topComponents: {

            },
            leftComponents: {

            },
            bottomComponents: {

            },
            rightComponents: {

            }
        },

    })

    const directionColumn = gridItems.topComponents.mainComponents.length !== 0 ||
        gridItems.bottomComponents.mainComponents.length !== 0;

    const beforeMainItems = directionColumn ? gridItems.topComponents : gridItems.leftComponents;
    const afterMainItems = directionColumn ? gridItems.bottomComponents : gridItems.rightComponents;
    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            border: "1px solid grey",
            borderRadius: "4px",
        }}>
            <Box sx={{
                display: "flex",
                flexDirection: directionColumn ? "column" : "row",
                justifyContent: "space-between",
                height: "100%"
            }}>
                {beforeMainItems.mainComponents.length !== 0 ?
                    <GridItem items={beforeMainItems.mainComponents} setItems={() => { }} /> :
                    <></>
                }
                <GridItem items={gridItems.mainComponents} setItems={() => { }} />
                {afterMainItems.mainComponents.length !== 0 ?
                    <GridItem items={afterMainItems.mainComponents} setItems={() => { }} /> :
                    <></>
                }
            </Box>
        </Box>
    )
};

export default GridWrapper;
