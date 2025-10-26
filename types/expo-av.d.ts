// Type declaration for expo-av module
declare module 'expo-av' {
  import { Component } from 'react';
  import { ViewStyle } from 'react-native';

  export enum ResizeMode {
    CONTAIN = 'contain',
    COVER = 'cover',
    STRETCH = 'stretch',
  }

  export interface VideoProps {
    source: { uri: string } | number;
    style?: ViewStyle;
    resizeMode?: ResizeMode | keyof typeof ResizeMode;
    shouldPlay?: boolean;
    useNativeControls?: boolean;
    [key: string]: any;
  }

  export class Video extends Component<VideoProps> {}

  export * from 'expo-av/build/index';
}
