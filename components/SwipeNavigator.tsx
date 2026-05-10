import React, { ReactNode, useRef } from 'react';
import { View, PanResponder, Dimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import * as Haptics from 'expo-haptics';

const TAB_ROUTES = ['/(tabs)', '/(tabs)/jobs', '/(tabs)/messages', '/(tabs)/profile'];

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.2; // 20% of screen width
const VELOCITY_THRESHOLD = 0.3;

interface SwipeNavigatorProps {
  children: ReactNode;
}

export default function SwipeNavigator({ children }: SwipeNavigatorProps) {
  const router = useRouter();
  const pathname = usePathname();

  const getCurrentIndex = (): number => {
    if (pathname === '/' || pathname === '/index') return 0;
    if (pathname === '/jobs') return 1;
    if (pathname === '/messages') return 2;
    if (pathname === '/profile') return 3;
    return 0;
  };

  const isNavigating = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      // Only claim the gesture if horizontal movement > vertical movement
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        const { dx, dy } = gestureState;
        // Only activate if horizontal drag is significantly more than vertical
        return Math.abs(dx) > 15 && Math.abs(dx) > Math.abs(dy) * 1.5;
      },
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderRelease: (_evt, gestureState) => {
        if (isNavigating.current) return;

        const { dx, vx } = gestureState;
        const isSwipe = Math.abs(dx) > SWIPE_THRESHOLD || Math.abs(vx) > VELOCITY_THRESHOLD;

        if (!isSwipe) return;

        const currentIndex = getCurrentIndex();

        if (dx < 0 && currentIndex < TAB_ROUTES.length - 1) {
          // Swipe LEFT → next tab
          isNavigating.current = true;
          Haptics.selectionAsync();
          router.replace(TAB_ROUTES[currentIndex + 1] as any);
          setTimeout(() => { isNavigating.current = false; }, 400);
        } else if (dx > 0 && currentIndex > 0) {
          // Swipe RIGHT → previous tab
          isNavigating.current = true;
          Haptics.selectionAsync();
          router.replace(TAB_ROUTES[currentIndex - 1] as any);
          setTimeout(() => { isNavigating.current = false; }, 400);
        }
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      {children}
    </View>
  );
}
