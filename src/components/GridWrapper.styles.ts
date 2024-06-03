export const styles = {
  wrapper: {
    padding: "16px",
    height: "800px"
  },
  flexAlignCenter: {
    display: "flex",
    alignItems: "center"
  },
  flexJustifyCenter: {
    display: "flex",
    justifyContent: "center"
  },
  panelWrapper: {
    width: "100%",
    height: "100%",
    border: "1px solid grey",
    borderRadius: "4px",
  },
  isActive: (activeLayout: string, item: string) => {
    return {
      fontWeight: activeLayout === item ? "bold" : "unset"
    };
  },
  isActiveBorder: (activeLayout: string, item: string) => {
    return {
      border: activeLayout === item ? "1px solid blue" : "unset"
    };
  },
};
