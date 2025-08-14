import React from 'react';
import { vi } from 'vitest';

// Mock framer-motion for testing
export const motion = new Proxy(
  {},
  {
    get: (_target, prop) => {
      return (Component: any) => {
        const MotionComponent = React.forwardRef<any, any>((props, ref) => {
          const { 
            initial, 
            animate, 
            transition, 
            whileHover, 
            whileTap, 
            whileInView,
            variants,
            custom,
            ...otherProps 
          } = props;
          
          // Return the wrapped component without motion functionality for testing
          return React.createElement(Component, { ...otherProps, ref });
        });
        
        MotionComponent.displayName = `Motion(${Component.displayName || Component.name || 'Component'})`;
        return MotionComponent;
      };
    },
  }
);

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => children;

export const useAnimation = () => ({
  start: vi.fn(),
  stop: vi.fn(),
  set: vi.fn(),
});

export const useMotionValue = (initial: any) => ({ current: initial });

export const useTransform = (input: any, output: any) => ({ current: output[0] });

export const useSpring = (input: any) => ({ current: input });

export const useInView = () => true;

export const useScroll = () => ({
  scrollYProgress: { current: 0 },
  scrollY: { current: 0 },
});

export const useDragControls = () => ({
  start: vi.fn(),
});

export default {
  motion,
  AnimatePresence,
  useAnimation,
  useMotionValue,
  useTransform,
  useSpring,
  useInView,
  useScroll,
  useDragControls,
};