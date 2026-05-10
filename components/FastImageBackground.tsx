import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Image, ImageSource } from 'expo-image';

interface FastImageBackgroundProps {
  source: ImageSource;
  style?: StyleProp<ViewStyle>;
  imageStyle?: any;
  children?: ReactNode;
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  placeholderColor?: string;
}

/**
 * High-performance replacement for RN's ImageBackground.
 * Uses expo-image under the hood for instant caching, 
 * hardware-accelerated decoding, and memory-efficient rendering.
 */
export default function FastImageBackground({
  source,
  style,
  imageStyle,
  children,
  contentFit = 'cover',
  placeholderColor = '#E8E8E8',
}: FastImageBackgroundProps) {
  return (
    <View style={[styles.container, { backgroundColor: placeholderColor }, style]}>
      <Image
        source={source}
        style={[StyleSheet.absoluteFill, imageStyle]}
        contentFit={contentFit}
        cachePolicy="memory-disk"
        priority="high"
        recyclingKey={typeof source === 'number' ? String(source) : undefined}
        transition={150}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
