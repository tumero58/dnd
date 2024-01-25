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

    const renderGridItems = (gridItems: any, parentClassName: string = ""): any => {
        if (Object.keys(gridItems).length === 0) {
            return;
        }
        let directionColumn;

        let beforeMainItems;
        let afterMainItems;

        let beforeClassName;
        let afterClassName;

        if (gridItems.leftComponents && Object.keys(gridItems.leftComponents).length !== 0 && gridItems.leftComponents.mainComponents.length !== 0) {
            beforeMainItems = gridItems.leftComponents;
            beforeClassName = "leftComponents";
            directionColumn = false;
        }
        if (gridItems.topComponents && Object.keys(gridItems.topComponents).length !== 0 && gridItems.topComponents.mainComponents?.length !== 0) {
            beforeMainItems = gridItems.topComponents
            beforeClassName = "topComponents";
            directionColumn = true;
        }
        if (gridItems.rightComponents && Object.keys(gridItems.rightComponents).length !== 0 && gridItems.rightComponents.mainComponents?.length !== 0) {
            afterMainItems = gridItems.rightComponents;
            afterClassName = "rightComponents";
            directionColumn = false;
        }
        if (gridItems.bottomComponents && Object.keys(gridItems.bottomComponents).length !== 0 && gridItems.bottomComponents.mainComponents?.length !== 0) {
            afterMainItems = gridItems.bottomComponents;
            afterClassName = "bottomComponents";
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
                    renderGridItems(beforeMainItems, `${parentClassName}-${beforeClassName}`) : <></>
                }
                {gridItems.mainComponents?.length !== 0 ?
                    <GridItem className={parentClassName} items={gridItems.mainComponents} setItems={setGridItems} /> : <></>}
                {afterMainItems && afterMainItems?.mainComponents?.length !== 0 ?
                    renderGridItems(afterMainItems, `${parentClassName}-${afterClassName}`) : <></>
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
            {renderGridItems(gridItems, "main")}
        </Box>
    )
};

export default GridWrapper;
