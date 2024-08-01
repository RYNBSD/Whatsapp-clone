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
