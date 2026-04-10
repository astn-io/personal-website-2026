import { mobileMenuState } from '@components/state/mobileMenuState.svelte';

export function handleDrawerToggle() {
  mobileMenuState.isActive = !mobileMenuState.isActive;
  const enableScroll = !mobileMenuState.isActive;
  document.documentElement.dataset.activeScroll = enableScroll.toString();
}
