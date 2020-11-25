import React, { forwardRef, memo } from 'react';
import isEqual from 'lodash.isequal';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { useTapGestureHandler } from '../../hooks/useTapGestureHandler';
import type { BottomSheetContentWrapperProps } from './types';

const ContentWrapperComponent = forwardRef<
  TapGestureHandler,
  BottomSheetContentWrapperProps
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
