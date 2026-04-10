<script>
  import DrawerNavigation from '@components/drawer/DrawerNavigation.svelte';
  import LightToggle from '@components/LightToggle.svelte';
  import FeaturedLinks from '@components/FeaturedLinks.svelte';
</script>

<div class="drawer-content-container">
  <p>Hello, world</p>
  <DrawerNavigation />
  <LightToggle onMobile={true} />
  <hr />
  <FeaturedLinks style="simple" />
</div>

<style>
  p {
    margin: none;
    padding-left: 1rem;
  }

  hr {
    margin-top: 1.2rem;
    margin-bottom: 0.8rem;
  }

  .drawer-content-container {
    display: grid;
    grid-template-rows: auto 1fr auto;

    height: 100%;

    padding-bottom: 2rem;
  }
</style>
