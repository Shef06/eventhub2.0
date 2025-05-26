<script lang="ts">
  import { onMount } from 'svelte';
  import EventoCard from '../components/ui/EventoCard.svelte';
  import { getEvents, getEventCategories, getEventCities } from '../services/api';
  
  // State for events and pagination
  let eventi: any[] = [];
  let loading = true;
  let error = '';
  let pagination = {
    total: 0,
    pages: 0,
    currentPage: 1,
    hasMore: false
  };

  // Filter state
  let ricerca = '';
  let categoriaSelezionata = '';
  let luogoSelezionato = '';
  let dataSelezionata = '';
  
  // Options for filters
  let categorie: string[] = [];
  let luoghi: string[] = [];
  
  // Debounce timeout for search
  let searchTimeout: NodeJS.Timeout;
  
  async function loadEvents(page = 1) {
    loading = true;
    error = '';
    
    try {
      const filters = {
        search: ricerca,
        category: categoriaSelezionata,
        city: luogoSelezionato,
        date: dataSelezionata,
        page,
        limit: 12
      };
      
      const response = await getEvents(filters);
      eventi = response.events;
      pagination = response.pagination;
    } catch (err: any) {
      error = err.message || 'Errore nel caricamento degli eventi';
    } finally {
      loading = false;
    }
  }
  
  async function loadFilterOptions() {
    try {
      const [categoriesResponse, citiesResponse] = await Promise.all([
        getEventCategories(),
        getEventCities()
      ]);
      categorie = categoriesResponse;
      luoghi = citiesResponse;
    } catch (err: any) {
      console.error('Error loading filter options:', err);
    }
  }

  function handleSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      pagination.currentPage = 1;
      loadEvents();
    }, 300);
  }

  function resetFiltri() {
    ricerca = '';
    categoriaSelezionata = '';
    luogoSelezionato = '';
    dataSelezionata = '';
    pagination.currentPage = 1;
    loadEvents();
  }
  
  function loadMore() {
    if (pagination.hasMore) {
      loadEvents(pagination.currentPage + 1);
    }
  }

  // Watch for filter changes
  $: if (categoriaSelezionata || luogoSelezionato || dataSelezionata) {
    pagination.currentPage = 1;
    loadEvents();
  }
  
  onMount(() => {
    loadFilterOptions();
    loadEvents();
  });
</script>

<div class="page-container">
  <div class="text-center mb-10">
    <h1 class="text-3xl font-bold mb-2">Esplora gli Eventi</h1>
    <p class="text-base-content/70 max-w-2xl mx-auto">Trova i migliori eventi in base ai tuoi interessi e alla tua posizione</p>
  </div>

  <!-- Filtri e Ricerca -->
  <div class="bg-base-100 rounded-box shadow-md p-4 mb-8">
    <div class="mb-4">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg class="w-4 h-4 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          type="search" 
          class="input input-bordered pl-10 w-full" 
          placeholder="Cerca eventi, luoghi, organizzatori..." 
          bind:value={ricerca}
          on:input={handleSearch}
        />
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text">Categoria</span>
        </label>
        <select class="select select-bordered w-full" bind:value={categoriaSelezionata}>
          <option value="">Tutte le categorie</option>
          {#each categorie as categoria}
            <option value={categoria}>{categoria}</option>
          {/each}
        </select>
      </div>
      
      <div class="form-control">
        <label class="label">
          <span class="label-text">Città</span>
        </label>
        <select class="select select-bordered w-full" bind:value={luogoSelezionato}>
          <option value="">Tutte le città</option>
          {#each luoghi as luogo}
            <option value={luogo}>{luogo}</option>
          {/each}
        </select>
      </div>
      
      <div class="form-control">
        <label class="label">
          <span class="label-text">Data</span>
        </label>
        <input 
          type="date" 
          class="input input-bordered w-full" 
          bind:value={dataSelezionata}
        />
      </div>
    </div>
    
    <div class="flex justify-end mt-4">
      <button class="btn btn-outline btn-sm" on:click={resetFiltri}>
        Reset filtri
      </button>
    </div>
  </div>

  <!-- Risultati -->
  {#if error}
    <div class="alert alert-error mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{error}</span>
    </div>
  {/if}

  {#if loading && !eventi.length}
    <div class="flex justify-center items-center py-12">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:else if eventi.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each eventi as evento (evento.id)}
        <div class="animate-fade-in">
          <EventoCard {...evento} />
        </div>
      {/each}
    </div>
    
    {#if pagination.hasMore}
      <div class="text-center mt-8">
        <button 
          class="btn btn-primary" 
          on:click={loadMore}
          disabled={loading}
        >
          {#if loading}
            <span class="loading loading-spinner"></span>
          {/if}
          Carica altri eventi
        </button>
      </div>
    {/if}
  {:else}
    <div class="text-center py-16">
      <div class="mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-xl font-bold mb-2">Nessun evento trovato</h3>
      <p class="text-base-content/70 max-w-md mx-auto">Non abbiamo trovato eventi che corrispondono ai tuoi criteri di ricerca. Prova a modificare i filtri o a cercare qualcos'altro.</p>
      <button class="btn btn-primary mt-4" on:click={resetFiltri}>
        Reset filtri
      </button>
    </div>
  {/if}
</div>