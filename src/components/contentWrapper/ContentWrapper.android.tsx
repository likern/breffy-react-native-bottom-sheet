import React, { forwardRef, memo } from 'react';
import isEqual from 'lodash.isequal';
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import { useTapGestureHandler } from '../../hooks/useTapGestureHandler';
import Animated from 'react-native-reanimated';

export type ContentWrapperComponentProps = {
  gestureState: Animated.SharedValue<State>;
  maxDeltaY: number;
  children: React.ReactNode;
};

const ContentWrapperComponent = forwardRef<
  TapGestureHandler,
  ContentWrapperComponentProps
>(({ gestureState, maxDeltaY, children }, ref) => {
  // callbacks
  const handleGestureEvent = useTapGestureHandler(gestureState);

  return (
    <TapGestureHandler
      ref={ref}
      maxDurationMs={1000000}
      maxDeltaY={maxDeltaY}
      shouldCancelWhenOutside={false}
      onHandlerStateChange={handleGestureEvent}
    >
      {children}
    </TapGestureHandler>
  );
});

const ContentWrapper = memo(ContentWrapperComponent, isEqual);

export default ContentWrapper;
