import { LayoutChangeEvent } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useCallback, useMemo, useState } from 'react';
import { SnapPoint } from 'src/types';
import { clamp } from 'remeda';

/**
 * Converts snap points with percentage to fixed numbers.
 */
export const useSnapPoints = (
  snapPoints: SnapPoint[],
  topInset: number,
  handleHeight: number = 24
) => {
  const { height: windowHeight } = useWindowDimensions();
  const [contentHeight, setContentHeight] = useState<number | undefined>(
    undefined
  );

  const onContentLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height }
      }
    }: LayoutChangeEvent) => {
      // console.log(`onContentLayout: height: ${height}`);
      setContentHeight(height);
    },
    []
  );

  const hasContentSnapPoints = useMemo(() => {
    return snapPoints.some(it => it.relativeTo === 'content');
  }, [snapPoints]);

  const maxPossibleSnapPoint = useMemo(
    () => Math.max(windowHeight - topInset, 0),
    [windowHeight, topInset]
  );

  const snapOffsets = useMemo(() => {
    if (hasContentSnapPoints && contentHeight === undefined) {
      return undefined;
    } else {
      const snapPointsOffsets = snapPoints
        .map(it => {
          let position: number;
          if (it.relativeTo === 'window') {
            position = (it.percentagesOf / 100) * (windowHeight - topInset);
          } else {
            position = (it.percentagesOf / 100) * contentHeight! + handleHeight;
          }
          return clamp(position, { min: 0, max: maxPossibleSnapPoint });
        })
        .sort((first, second) =>
          first === second ? 0 : first < second ? -1 : 1
        );
      return snapPointsOffsets;
    }
  }, [
    snapPoints,
    maxPossibleSnapPoint,
    topInset,
    windowHeight,
    contentHeight,
    handleHeight,
    hasContentSnapPoints
  ]);

  const { adjustedSnapPoints, sheetHeight, maxSnapPoint } = useMemo<{
    adjustedSnapPoints: number[];
    sheetHeight: number;
    maxSnapPoint: number;
  }>(() => {
    if (snapOffsets !== undefined) {
      const maxSnapPoint = snapOffsets[snapOffsets.length - 1];
      return {
        adjustedSnapPoints: snapOffsets.map(it => maxSnapPoint - it),
        maxSnapPoint: maxSnapPoint,
        sheetHeight: maxSnapPoint
      };
    } else {
      return {
        adjustedSnapPoints: [windowHeight],
        maxSnapPoint: windowHeight,
        sheetHeight: windowHeight
      };
    }
  }, [snapOffsets, windowHeight]);

  // console.log(
  //   `windowHeight: ${windowHeight}, contentHeight: ${contentHeight}, handleHeight: ${handleHeight}, positions: ${JSON.stringify(
  //     snapOffsets
  //   )}, snapPoints: ${JSON.stringify(snapPoints)}, topInset: ${topInset}`
  // );

  return {
    snapPoints: adjustedSnapPoints,
    maxSnapPoint: maxSnapPoint,
    sheetHeight: sheetHeight,
    onContentLayout: onContentLayout,
    isWaitingLayout: snapOffsets === undefined
  } as const;
};
