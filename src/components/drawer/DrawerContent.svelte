<script>
  import DrawerNavigation from '@components/drawer/DrawerNavigation.svelte';
  import LightToggle from '@components/LightToggle.svelte';
</script>

<div class="drawer-content-container">
  <p>Hello, world</p>
  <DrawerNavigation />
  <LightToggle onMobile={true} />
</div>

<style>
  p {
    margin: none;
    padding-left: 1rem;
  }

  .drawer-content-container {
    display: grid;
    grid-template-rows: auto 1fr auto;

    height: 100%;

    padding-bottom: 1rem;
  }
</style>
