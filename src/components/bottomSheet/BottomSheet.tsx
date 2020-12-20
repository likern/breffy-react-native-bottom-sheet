import React, {
  useMemo,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  memo
} from 'react';
import { ViewStyle } from 'react-native';
import isEqual from 'lodash.isequal';
import invariant from 'invariant';
import Animated, {
  useAnimatedReaction,
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
  runOnUI
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  State,
  TapGestureHandler
} from 'react-native-gesture-handler';
import {
  useInteractivePanGestureHandler,
  useStableCallback,
  useScrollable,
  useSnapPoints
} from '../../hooks';
import {
  BottomSheetInternalProvider,
  BottomSheetProvider
} from '../../contexts';
import {
  DEFAULT_ANIMATION_EASING,
  DEFAULT_ANIMATION_DURATION,
  GESTURE,
  ANIMATION_STATE
} from '../../constants';
import ContentWrapper from '../contentWrapper';
import { BottomSheetDraggableView } from '../draggableView';
import { BottomSheetHandle } from '../handle';
import type { ScrollableRef, BottomSheetMethods } from '../../types';
import type { BottomSheetProps } from './types';
import { styles } from './styles';

Animated.addWhitelistedUIProps({
  decelerationRate: true
});

type BottomSheet = BottomSheetMethods;

const BottomSheetComponent = forwardRef<BottomSheet, BottomSheetProps>(
  (
    {
      // animations
      animationDuration = DEFAULT_ANIMATION_DURATION,
      animationEasing = DEFAULT_ANIMATION_EASING,
      // general
      initialSnapIndex = 0,
      snapPoints: _snapPoints,
      topInset = 0,
      onlyDistinctSnaps = true,
      // animated callback shared values
      animatedPosition: _animatedPosition,
      animatedPositionIndex: _animatedPositionIndex,
      // callbacks
      onChange: _onChange,
      onAnimate,
      // components
      handleComponent: HandleComponent = BottomSheetHandle,
      backgroundComponent: BackgroundComponent = null,
      children
    },
    ref
  ) => {
    //#region validate props
    // validate `snapPoints`
    invariant(
      _snapPoints,
      `'snapPoints' was not provided! please provide at least one snap point.`
    );

    invariant(
      _snapPoints.length > 0,
      `'snapPoints' was provided with no points! please provide at least one snap point.`
    );

    // validate `initialSnapIndex`
    invariant(
      typeof initialSnapIndex === 'number',
      `'initialSnapIndex' was provided but with wrong type ! expected type is a number.`
    );

    invariant(
      initialSnapIndex >= -1 && initialSnapIndex <= _snapPoints.length - 1,
      `'initialSnapIndex' was provided but out of the provided snap points range! expected value to be between -1, ${
        _snapPoints.length - 1
      }`
    );

    // topInset
    invariant(
      typeof topInset === 'number',
      `'topInset' was provided but with wrong type ! expected type is a number.`
    );

    // validate animations
    invariant(
      typeof animationDuration === 'number',
      `'animationDuration' was provided but with wrong type ! expected type is a number.`
    );

    invariant(
      animationDuration > 0,
      `'animationDuration' was provided but the value is very low! expected value to be greater than 0`
    );

    invariant(
      typeof animationEasing === 'function',
      `'animationEasing' was provided but with wrong type ! expected type is a Animated.EasingFunction.`
    );
    //#endregion

    //#region variables
    const currentPositionIndex = useSharedValue(initialSnapIndex);

    // scrollable variables
    const {
      scrollableContentOffsetY,
      scrollableDecelerationRate,
      setScrollableRef,
      removeScrollableRef,
      flashScrollableIndicators
    } = useScrollable();

    const {
      snapPoints,
      sheetHeight,
      onContentLayout,
      isWaitingLayout
    } = useSnapPoints(_snapPoints, topInset);

    const sharedSnapPoints = useDerivedValue(() => {
      return snapPoints;
    }, [snapPoints]);

    // console.log(
    //   `snapPoints: ${JSON.stringify(
    //     snapPoints
    //   )}, sheetHeight: ${sheetHeight}, isWaitingLayout: ${isWaitingLayout}`
    // );

    // console.log(
    //   `initialSnapIndex: ${initialSnapIndex}, currentPositionIndexRef: ${currentPositionIndexRef.current}`
    // );

    const initialPosition = useMemo(() => {
      return initialSnapIndex < 0 || isWaitingLayout
        ? sheetHeight
        : snapPoints[initialSnapIndex];
    }, [initialSnapIndex, sheetHeight, snapPoints, isWaitingLayout]);

    // content wrapper
    const contentWrapperGestureRef = useRef<TapGestureHandler>(null);
    const contentWrapperGestureState = useSharedValue<State>(
      State.UNDETERMINED
    );
    const contentWrapperMaxDeltaY = useMemo(
      () => snapPoints[Math.max(initialSnapIndex, 0)],
      [snapPoints, initialSnapIndex]
    );
    //#endregion

    //#region private methods
    const refreshUIElements = useCallback(() => {
      const _currentPositionIndex = Math.max(currentPositionIndex.value, 0);

      if (_currentPositionIndex === snapPoints.length - 1) {
        flashScrollableIndicators();
        // @ts-ignore
        contentWrapperGestureRef.current.setNativeProps({
          maxDeltaY: 0
        });
      } else {
        // @ts-ignore
        contentWrapperGestureRef.current.setNativeProps({
          maxDeltaY: snapPoints[_currentPositionIndex]
        });
      }
    }, [currentPositionIndex, snapPoints, flashScrollableIndicators]);
    const handleOnChange = useStableCallback((index: number) => {
      currentPositionIndex.value = index;

      if (_onChange !== undefined) {
        /**
         * to avoid having -0 🤷‍♂️
         */
        _onChange(index + 1 - 1);
      }
    });

    const handleOnAnimateToPoint = useCallback(
      (point: number) => {
        'worklet';
        if (onAnimate !== undefined) {
          const fromIndex = currentPositionIndex.value;
          const toIndex = sharedSnapPoints.value.findIndex(it => it === point)!;

          if (!onlyDistinctSnaps || fromIndex !== toIndex) {
            runOnJS(onAnimate)(fromIndex, toIndex);
          }
        }
      },
      [onlyDistinctSnaps, sharedSnapPoints, currentPositionIndex, onAnimate]
    );

    const handleSettingScrollableRef = useCallback(
      (scrollableRef: ScrollableRef) => {
        setScrollableRef(scrollableRef);
        refreshUIElements();
      },
      [setScrollableRef, refreshUIElements]
    );
    //#endregion

    //#region gesture interaction / animation
    // variables
    const animationState = useSharedValue(ANIMATION_STATE.UNDETERMINED);
    // console.log(`initialPosition: ${initialPosition}`);
    const animatedPosition = useSharedValue(initialPosition);
    const animatedPositionIndex = useDerivedValue(() => {
      const input = isWaitingLayout
        ? [sheetHeight, sheetHeight]
        : [sheetHeight].concat(snapPoints.slice());
      // console.log(`input: ${input}, typeof input: ${typeof input}`);

      const output = isWaitingLayout
        ? [-1, -1]
        : [-1].concat(snapPoints.slice().map((_, index) => index));
      // console.log(`output: ${output}, typeof output: ${typeof output}`);
      const interpolatedIndex = interpolate(
        animatedPosition.value,
        input.reverse(),
        output.reverse(),
        Extrapolate.CLAMP
      );

      // console.log(
      //   `animatedPositionIndex: animatedPosition: ${animatedPosition.value}, interpolatedIndex: ${interpolatedIndex}, input: ${input}, output: ${output}`
      // );
      return interpolatedIndex;
    }, [snapPoints, sheetHeight, isWaitingLayout]);

    // TODO: Uncomment this to watch on animatedPosition
    // useDerivedValue(() => {
    //   console.log(
    //     `animatedPosition: ${animatedPosition.value}, animatedPositionIndex: ${animatedPositionIndex.value}`
    //   );
    //   return animatedPosition.value;
    // }, []);

    // callbacks
    const animateToPointCompleted = useCallback(
      isCancelled => {
        'worklet';
        animationState.value = ANIMATION_STATE.STOPPED;

        if (!isCancelled) {
          return;
        }

        const tempCurrentPositionIndex = Math.round(
          animatedPositionIndex.value
        );

        const fromIndex = currentPositionIndex.value;
        const toIndex = tempCurrentPositionIndex;

        if (!onlyDistinctSnaps || fromIndex !== toIndex) {
          runOnJS(handleOnChange)(toIndex);
          runOnJS(refreshUIElements)();
        }
      },
      [
        onlyDistinctSnaps,
        animatedPositionIndex.value,
        animationState,
        handleOnChange,
        refreshUIElements,
        currentPositionIndex
      ]
    );

    const animateToPoint = useCallback(
      (point: number) => {
        'worklet';

        console.log(
          `animateToPoint: before animation: animatedPosition is ${animatedPosition.value}`
        );

        handleOnAnimateToPoint(point);
        animationState.value = ANIMATION_STATE.RUNNING;
        animatedPosition.value = withTiming(
          point,
          {
            duration: animationDuration,
            easing: animationEasing
          },
          animateToPointCompleted
        );
      },
      [
        animationState,
        animatedPosition,
        animationDuration,
        animationEasing,
        animateToPointCompleted,
        handleOnAnimateToPoint
      ]
    );

    // hooks
    const [handlePanGestureHandler] = useInteractivePanGestureHandler(
      GESTURE.HANDLE,
      animatedPosition,
      snapPoints,
      animateToPoint
    );

    const [contentPanGestureHandler] = useInteractivePanGestureHandler(
      GESTURE.CONTENT,
      animatedPosition,
      snapPoints,
      animateToPoint,
      scrollableContentOffsetY
    );
    //#endregion

    //#region public methods
    const handleSnapTo = useCallback(
      (index: number) => {
        invariant(
          index >= -1 && index <= snapPoints.length - 1,
          `'index' was provided but out of the provided snap points range! expected value to be between -1, ${
            snapPoints.length - 1
          }`
        );
        console.log(
          `handleSnapTo: index is ${index}, animate to snap point: ${snapPoints[index]}`
        );
        runOnUI(animateToPoint)(snapPoints[index]);
      },
      [animateToPoint, snapPoints]
    );
    const handleClose = useCallback(() => {
      runOnUI(animateToPoint)(sheetHeight);
    }, [animateToPoint, sheetHeight]);
    const handleExpand = useCallback(() => {
      runOnUI(animateToPoint)(snapPoints[snapPoints.length - 1]);
    }, [animateToPoint, snapPoints]);
    const handleCollapse = useCallback(() => {
      runOnUI(animateToPoint)(snapPoints[0]);
    }, [animateToPoint, snapPoints]);
    useImperativeHandle(ref, () => ({
      snapTo: handleSnapTo,
      expand: handleExpand,
      collapse: handleCollapse,
      close: handleClose
    }));
    //#endregion

    //#region contexts variables
    const internalContextVariables = useMemo(
      () => {
        // console.log(`internalContextVariables is updated!`);
        return {
          animatedPosition,
          animationState,
          contentWrapperGestureRef,
          contentPanGestureHandler,
          scrollableContentOffsetY,
          scrollableDecelerationRate,
          setScrollableRef: handleSettingScrollableRef,
          removeScrollableRef
        };
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [contentPanGestureHandler]
    );
    const externalContextVariables = useMemo(
      () => ({
        snapTo: handleSnapTo,
        expand: handleExpand,
        collapse: handleCollapse,
        close: handleClose
      }),
      [handleSnapTo, handleExpand, handleCollapse, handleClose]
    );
    //#endregion

    //#region styles
    const contentContainerStyle = useMemo<Animated.AnimateStyle<ViewStyle>>(
      () => ({
        ...styles.container
      }),
      []
    );
    const contentContainerAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: animatedPosition.value }]
      };
    }, []);
    //#endregion

    //#region effects
    useAnimatedReaction(
      () => animatedPosition.value,
      (value: number) => {
        if (_animatedPosition !== undefined) {
          _animatedPosition.value = value;
        }
      },
      [_animatedPosition]
    );
    useAnimatedReaction(
      () => animatedPositionIndex.value,
      (value: number) => {
        if (_animatedPositionIndex !== undefined) {
          _animatedPositionIndex.value = value;
        }
      },
      [_animatedPositionIndex]
    );
    //#endregion

    // render
    // console.log(
    //   `[ContentWrapper] maxDeltaY: ${contentWrapperMaxDeltaY}, height: ${sheetHeight}`
    // );
    return (
      <>
        <ContentWrapper
          ref={contentWrapperGestureRef}
          gestureState={contentWrapperGestureState}
          maxDeltaY={contentWrapperMaxDeltaY}
        >
          <Animated.View
            style={[contentContainerStyle, contentContainerAnimatedStyle]}
          >
            {BackgroundComponent && (
              <BackgroundComponent pointerEvents="none" />
            )}
            <BottomSheetProvider value={externalContextVariables}>
              <PanGestureHandler
                simultaneousHandlers={contentWrapperGestureRef}
                shouldCancelWhenOutside={false}
                onGestureEvent={handlePanGestureHandler}
              >
                <Animated.View>
                  <HandleComponent />
                </Animated.View>
              </PanGestureHandler>

              <BottomSheetInternalProvider value={internalContextVariables}>
                <BottomSheetDraggableView
                  style={[styles.contentContainer]}
                  onLayout={onContentLayout}
                >
                  {typeof children === 'function'
                    ? (children as Function)()
                    : children}
                </BottomSheetDraggableView>
              </BottomSheetInternalProvider>
            </BottomSheetProvider>
          </Animated.View>
        </ContentWrapper>
      </>
    );
  }
);

const BottomSheet = memo(BottomSheetComponent, isEqual);

export { BottomSheet };
