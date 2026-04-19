<script>
  import DrawerNavigation from '@/components/drawer-mobile-nav/DrawerMobileNav.svelte';
  import LightToggle from '@components/LightToggle.svelte';
  import FeaturedLinks from '@components/FeaturedLinks.svelte';
  import ContactButton from '@components/ContactButton.svelte';
</script>

<div class="drawer-content-container">
  <div class="nav-container">
    <DrawerNavigation />
  </div>
  <div class="misc-info-container">
    <ContactButton icon="ri-chat-1-line" size="small" />
    <LightToggle onMobile={true} />
  </div>
  <hr />
  <div class="featured-links-container">
    <FeaturedLinks style="simple" />
  </div>
</div>

<style>
  hr {
    margin-top: 1.2rem;
    margin-bottom: 0.8rem;
  }

  .drawer-content-container {
    display: grid;
    grid-template-rows: 1fr auto auto auto auto;

    height: 100%;

    padding-bottom: 2rem;
  }

  .nav-container {
    display: flex;
    align-items: center;
  }

  .misc-info-container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding-inline: 1rem;

    height: fit-content;
  }

  .featured-links-container {
    padding-inline: 1rem;
  }
</style>
