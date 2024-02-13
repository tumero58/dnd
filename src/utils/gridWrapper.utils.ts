export const createResizeHorizontal = (gridItems: any, resizeClassName: string = "resizeWrapper") => {
    if (!gridItems) {
        return;
    }
    if (gridItems.leftComponents && gridItems.rightComponents) {
        const leftElement = document.getElementById(`${resizeClassName}-leftComponents`);
        if (leftElement) {
            const resizer = document.createElement("div");
            resizer.style.position = "absolute";
            resizer.style.zIndex = "1";
            resizer.style.left = leftElement?.clientWidth + "px";
            resizer.style.top = leftElement?.clientHeight / 2 + "px";
            resizer.style.transform = "translate(-50%, -50%)";
            resizer.style.height = "60px";
            resizer.style.width = "0";
            resizer.style.border = "4px solid black";
            resizer.style.borderRadius = "4px";
            resizer.style.cursor = "col-resize";
            resizer.className = "resizer-horizontal";
            resizer.id = `resizer${resizeClassName}`;
            leftElement.appendChild(resizer);

            const parentElement = document.getElementById(`${resizeClassName}`);
            const currentParentSibling = leftElement?.nextElementSibling;


            let mousedown = false;

            if (resizer && parentElement) {
                resizer.addEventListener('mousedown', function () {
                    mousedown = true;
                }, true);
                parentElement.addEventListener('mouseup', function () {
                    if (mousedown) {
                        const movX = leftElement.clientWidth + resizerMoveX;
                        const moveXPercent = movX * 100 / parentElement.clientWidth;
                        leftElement.style.transition = "1s all ease";
                        leftElement.style.width = moveXPercent + "%";
                        if (currentParentSibling) {
                            (currentParentSibling as HTMLElement).style.transition = "1s all ease";
                            (currentParentSibling as HTMLElement).style.width = 100 - moveXPercent + "%";
                        }
                        mousedown = false;
                        resizerMoveX = 0;
                    }
                }, true);
                let resizerMoveX = 0;
                parentElement.addEventListener('mousemove', function (e) {
                    if (mousedown) {
                        resizerMoveX+=e.movementX
                        resizer.style.left = `calc(100% + ${resizerMoveX}px`;
                    }
                }, true);
            }
            const removeCb = () => {
                if (leftElement.contains(resizer)) {
                    leftElement.removeChild(resizer);
                }
            };
            return removeCb;
        }
    }
    if (gridItems.leftComponents && !gridItems.rightComponents) {
        const resizer = document.getElementById(`resizer${resizeClassName}`);
        if (resizer) {
            resizer.remove();
        }
        const leftElement = document.getElementById(`${resizeClassName}-leftComponents`);
        if (leftElement) {
            leftElement.style.width = "100%";
            const resizerList = leftElement.getElementsByClassName("resizer-horizontal");
            if (resizerList.length !== 0) {
                for (let i = 0; i < resizerList.length; i++) {
                    (resizerList[i] as HTMLElement).remove()
                }
            }
            const currentParentSibling = leftElement.nextElementSibling;
            if (currentParentSibling) {
                (currentParentSibling as HTMLElement).style.width = "100%"
            }
        }
    }
    if (!gridItems.leftComponents && gridItems.rightComponents) {
        const rightElement = document.getElementById(`${resizeClassName}-rightComponents`);
        if (rightElement) {
            rightElement.style.width = "100%";
            const resizerList = rightElement.getElementsByClassName("resizer-horizontal");
            if (resizerList.length !== 0) {
                for (let i = 0; i < resizerList.length; i++) {
                    (resizerList[i] as HTMLElement).remove()
                }
            }
            const currentParentSibling = rightElement.nextElementSibling;
            if (currentParentSibling) {
                (currentParentSibling as HTMLElement).style.width = "100%"
            }
        }
    }
}

export const createResizeHorizontalAll = (gridItems: any, className: string = "resizeWrapper", callbackArray: any[] = []) => {
    const callbackFns: any[] = [...callbackArray];
    const removeCb = createResizeHorizontal(gridItems, className);
    callbackFns.push(removeCb);

    const keys = Object.keys(gridItems);
    keys.forEach((key: string) => {
        if (key === "mainComponents") {
            return
        } else {
            createResizeHorizontalAll((gridItems as any)[key], `${className}-${key}`, callbackFns)
            callbackFns.push(removeCb);
        }
    })
    return callbackFns;
}