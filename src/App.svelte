<script lang="ts">
  import Router from 'svelte-spa-router';
  import routes from './routes';
  import Navbar from './components/layout/Navbar.svelte';
  import Footer from './components/layout/Footer.svelte';
</script>

<div class="app min-h-screen flex flex-col">
  <Navbar />
  
  <main class="flex-grow">
    <Router {routes} />
  </main>
  
  <Footer />
</div>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
</style>