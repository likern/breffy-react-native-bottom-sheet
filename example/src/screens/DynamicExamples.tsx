import React, { useCallback, memo, useRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheet, SnapPoint } from '@breeffy/react-native-bottom-sheet';
import ContactList from '../components/contactList';
import Button from '../components/button';
import { useHeaderHeight } from '@react-navigation/stack';

interface ExampleScreenProps {
  title: string;
  type: 'FlatList' | 'SectionList' | 'ScrollView' | 'View';
  count?: number;
}

const createExampleScreen = ({ type, count = 50 }: ExampleScreenProps) =>
  memo(() => {
    // hooks
    const bottomSheetRef = useRef<BottomSheet>(null);
    const headerHeight = useHeaderHeight();

    // TODO: Uncomment to see infinite printing to console

    // variables
    const snapPoints = useMemo<SnapPoint[]>(
      () => [
        { relativeTo: 'content', percentagesOf: 25 },
        { relativeTo: 'content', percentagesOf: 50 },
        { relativeTo: 'content', percentagesOf: 90 },
        { relativeTo: 'content', percentagesOf: 100 }
      ],
      []
    );

    // callbacks
    const handleSheetChange = useCallback(_ => {}, []);
    const handleSnapPress = useCallback(index => {
      bottomSheetRef.current?.snapTo(index);
    }, []);
    const handleExpandPress = useCallback(() => {
      bottomSheetRef.current?.expand();
    }, []);
    const handleCollapsePress = useCallback(() => {
      bottomSheetRef.current?.collapse();
    }, []);
    const handleClosePress = useCallback(() => {
      bottomSheetRef.current?.close();
    }, []);

    return (
      <View style={styles.container}>
        <Button
          label="Snap To 100% Of Content"
          style={styles.buttonContainer}
          onPress={() => handleSnapPress(3)}
        />
        <Button
          label="Snap To 90% Of Content"
          style={styles.buttonContainer}
          onPress={() => handleSnapPress(2)}
        />
        <Button
          label="Snap To 50% Of Content"
          style={styles.buttonContainer}
          onPress={() => handleSnapPress(1)}
        />
        <Button
          label="Snap To 25% Of Content"
          style={styles.buttonContainer}
          onPress={() => handleSnapPress(0)}
        />
        <Button
          label="Expand"
          style={styles.buttonContainer}
          onPress={() => handleExpandPress()}
        />
        <Button
          label="Collapse"
          style={styles.buttonContainer}
          onPress={() => handleCollapsePress()}
        />
        <Button
          label="Close"
          style={styles.buttonContainer}
          onPress={() => handleClosePress()}
        />
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          initialSnapIndex={1}
          topInset={headerHeight}
          onChange={handleSheetChange}
        >
          <ContactList key={`${type}.list`} type={type} count={count} />
        </BottomSheet>
      </View>
    );
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24
  },
  title: {
    fontSize: 46,
    lineHeight: 46,
    fontWeight: '800'
  },
  headerContainer: {
    paddingVertical: 24,
    backgroundColor: 'white'
  },
  buttonContainer: {
    marginBottom: 6
  }
});

export const FlatListDynamicExampleScreen = createExampleScreen({
  title: 'FlatList Example',
  type: 'FlatList'
});

export const ScrollViewDynamicExampleScreen = createExampleScreen({
  title: 'Title',
  type: 'ScrollView'
});

export const SectionListDynamicExampleScreen = createExampleScreen({
  title: 'Title',
  type: 'SectionList'
});

export const ViewDynamicExampleScreen = createExampleScreen({
  title: 'Title',
  type: 'View',
  count: 8
});
