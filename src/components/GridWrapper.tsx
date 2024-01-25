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
                gridItems2[1]
            ],
            topComponents: {

            },
            leftComponents: {
                // mainComponents: [
                //     gridItems2[2]
                // ],
                // bottomComponents: {
                //     mainComponents: [
                //         gridItems2[2]
                //     ],
                // },
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
                // gridItems2[1], gridItems2[2]
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

    const renderGridItems = (gridItems: any): any => {
        if (Object.keys(gridItems).length === 0) {
            return;
        }
        let directionColumn;
        let beforeMainItems;
        let afterMainItems;
        if (gridItems.leftComponents && Object.keys(gridItems.leftComponents).length !== 0 && gridItems.leftComponents.mainComponents.length !== 0) {
            console.log("assign left");

            beforeMainItems = gridItems.leftComponents
            directionColumn = false;
        }
        if (gridItems.topComponents && Object.keys(gridItems.topComponents).length !== 0 && gridItems.topComponents.mainComponents?.length !== 0) {
            console.log("assign top");
            beforeMainItems = gridItems.topComponents
            directionColumn = true;
        }
        if (gridItems.rightComponents && Object.keys(gridItems.rightComponents).length !== 0 && gridItems.rightComponents.mainComponents?.length !== 0) {
            console.log("assign right");
            afterMainItems = gridItems.rightComponents
            directionColumn = false;
        }
        if (gridItems.bottomComponents && Object.keys(gridItems.bottomComponents).length !== 0 && gridItems.bottomComponents.mainComponents?.length !== 0) {
            console.log("assign bottom");
            afterMainItems = gridItems.bottomComponents
            directionColumn = true;
        }

        return (
            <Box sx={{
                display: "flex",
                flexDirection: directionColumn ? "column" : "row",
                justifyContent: "space-between",
                height: "100%",
                width: "100%"
            }}>
                {beforeMainItems && beforeMainItems?.mainComponents?.length !== 0 ?
                    renderGridItems(beforeMainItems) : <></>
                }
                {gridItems.mainComponents?.length !== 0 ?
                    <GridItem items={gridItems.mainComponents} setItems={() => { }} /> : <></>}
                {afterMainItems && afterMainItems?.mainComponents?.length !== 0 ?
                    renderGridItems(afterMainItems) : <></>
                }
            </Box>
        )
    }
    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            border: "1px solid grey",
            borderRadius: "4px",
        }}>
            {renderGridItems(gridItems)}
        </Box>
    )
};

export default GridWrapper;
