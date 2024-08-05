import { Dimensions } from "react-native";

export function isCloseToBottom({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: any) {
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
}

export function isCloseToTop({ contentOffset }: any) {
  return contentOffset.y === 0;
}

export function isInView(
  width: number,
  height: number,
  pageX: number,
  pageY: number,
) {
  const rectTop = pageX;
  const rectBottom = pageY + height;
  const rectWidth = pageX + width;
  const window = Dimensions.get("window");
  return (
    rectBottom !== 0 &&
    rectTop >= 0 &&
    rectBottom <= window.height &&
    rectWidth > 0 &&
    rectWidth <= window.width
  );
}
