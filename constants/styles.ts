import SIZES from "@/constants/size";
import { StyleProp, TextStyle, ViewProps, ViewStyle } from "react-native";
import { Theme } from "./theme";

const headerContainer: StyleProp<ViewProps> = {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.bodyPaddingHorizontal,
    paddingVertical: 10,
    height: SIZES.headerHeight,
} as ViewProps;

const boxShadow: StyleProp<ViewProps> = {
    elevation: 5,
    shadowColor: "#55565626",
    shadowOffset: {
        width: 0,
        height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 5
} as ViewProps;

const textShadow: StyleProp<ViewProps> = {
    textShadowColor: "#444",
    textShadowOffset:{
      width:2,
      height:2
    },
    textShadowRadius: 2
} as ViewProps;

const container: StyleProp<ViewStyle> = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: SIZES.screenWidth - (SIZES.bodyPaddingHorizontal*2)
} as ViewStyle;

const contentCentered: StyleProp<ViewStyle> = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
} as ViewStyle;

const childContentCentered: StyleProp<ViewStyle> = {
    justifyContent: "center",
    alignItems: "center"
} as ViewStyle;

const defaultContainer: StyleProp<ViewProps> = {
    flex: 1,
    paddingHorizontal: SIZES.bodyPaddingHorizontal,
    paddingVertical: SIZES.bodyPaddingVertical,
} as ViewProps;


const actionButtonTextStyle: StyleProp<TextStyle> = {
    fontSize: SIZES.title,
    color: "#FFFFFF",
    fontWeight: "500"
} as ViewProps;

const formGroup: StyleProp<ViewStyle> = {
    gap: 20,
    width: SIZES.screenBodyWidth,
    // alignItems:"center"
};

const formLabel: StyleProp<TextStyle> = {
    fontSize: SIZES.title,
    color: Theme.primary
};

const errorMessage: StyleProp<TextStyle> = {
    color: Theme.accent,
    fontSize: SIZES.contentText,
};

const STYLES = {
    container,
    headerContainer,
    defaultContainer,
    boxShadow,
    textShadow,
    contentCentered,
    childContentCentered,
    actionButtonTextStyle,
    errorMessage,
    formGroup,
    formLabel
};

export default STYLES;