/**
 * > [!NOTE]
 * > Animations are found in /src/styles/transitions.scss
 */

export const slideAnim = {
  old: {
    name: 'slide-out',
    duration: '0.2s',
    easing: 'ease-out',
  },
  new: {
    name: 'slide-in',
    duration: '0.2s',
    easing: 'ease-out',
  },
};

export const slideTransition = {
  forwards: slideAnim,
  backwards: slideAnim,
};

export const fadeAnim = {
  old: {
    name: 'fade-out',
    duration: '200ms',
    easing: 'ease-out',
  },
  new: {
    name: 'fade-in',
    duration: '200ms',
    easing: 'ease-out',
  },
};

export const fadeTransition = {
  forwards: fadeAnim,
  backwards: fadeAnim,
};
