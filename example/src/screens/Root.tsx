import React from 'react';
import Showcase from '@gorhom/showcase-template';
import { useNavigation } from '@react-navigation/native';
import { useSafeArea } from 'react-native-safe-area-context';
import { version, description } from '../../../package.json';

const data = [
  {
    title: 'Basic',
    data: [
      {
        name: 'View',
        slug: 'ViewExample'
      },
      {
        name: 'ScrollView',
        slug: 'ScrollViewExample'
      },
      {
        name: 'FlatList',
        slug: 'FlatListExample'
      },
      {
        name: 'SectionList',
        slug: 'SectionListExample'
      }
    ]
  },
  {
    title: 'Dynamic',
    data: [
      {
        name: 'View',
        slug: 'ViewDynamicExample'
      },
      {
        name: 'ScrollView',
        slug: 'ScrollViewDynamicExample'
      },
      {
        name: 'FlatList',
        slug: 'FlatListDynamicExample'
      },
      {
        name: 'SectionList',
        slug: 'SectionListDynamicExample'
      }
    ]
  },
  {
    title: 'Advanced',
    data: [
      {
        name: 'React Navigation',
        slug: 'NavigatorExample'
      },
      {
        name: 'Custom Handle',
        slug: 'CustomHandleExample'
      },
      {
        name: 'Shadow Overlay',
        slug: 'ShadowOverlayExample'
      },
      // {
      //   name: 'Map',
      //   slug: 'MapExample'
      // },
      { name: 'Swipe to Close', slug: 'SwipeToCloseExample' }
    ]
  }
];

const RootScreen = () => {
  // hooks
  const { navigate } = useNavigation();
  const safeInsets = useSafeArea();

  // callbacks
  const handleOnPress = (slug: string) => navigate(slug);

  // renders
  return (
    <Showcase
      theme="light"
      version={version}
      name="Bottom Sheet"
      description={description}
      author={{
        username: 'Victor Malov',
        url: 'https://github.com/likern'
      }}
      data={data}
      safeInsets={safeInsets}
      handleOnPress={handleOnPress}
    />
  );
};

export { RootScreen };
