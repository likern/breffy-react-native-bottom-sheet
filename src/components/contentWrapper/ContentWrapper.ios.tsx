import React, { forwardRef, memo } from 'react';
import isEqual from 'lodash.isequal';
import Animated from 'react-native-reanimated';
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import { useTapGestureHandler } from '../../hooks/useTapGestureHandler';
import { styles } from './styles';

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
      <Animated.View pointerEvents="box-none" style={styles.container}>
        {children}
      </Animated.View>
    </TapGestureHandler>
  );
});

const ContentWrapper = memo(ContentWrapperComponent, isEqual);

export default ContentWrapper;
