<script lang="ts">
  import { push } from 'svelte-spa-router';
  
  export let id: string;
  export let titolo: string;
  export let data: string;
  export let luogo: string;
  export let categoria: string;
  export let immagine: string;
  export let partecipanti: number;
  export let organizzatore: string = "EventHub";

  function visualizzaEvento() {
    push(`/evento/${id}`);
  }

  // Funzione per formattare la data
  function formattaData(dataString: string): string {
    const data = new Date(dataString);
    return data.toLocaleDateString('it-IT', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<div class="card-evento w-full md:max-w-sm overflow-hidden cursor-pointer" on:click={visualizzaEvento}>
  <figure class="h-48 relative overflow-hidden">
    <img src={immagine} alt={titolo} class="w-full h-full object-cover transition-transform hover:scale-105 duration-300" />
    <div class="badge badge-secondary absolute top-3 right-3">
      {categoria}
    </div>
  </figure>
  <div class="card-body">
    <h3 class="card-title text-lg font-bold">{titolo}</h3>
    <div class="flex items-center text-sm mb-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      {formattaData(data)}
    </div>
    <div class="flex items-center text-sm mb-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      {luogo}
    </div>
    <div class="flex items-center text-sm mb-3">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {partecipanti} partecipanti
    </div>
    <div class="card-actions justify-between items-center">
      <div class="text-xs text-gray-500">
        Organizzato da: {organizzatore}
      </div>
      <button class="btn btn-sm btn-primary" on:click|stopPropagation={visualizzaEvento}>
        Dettagli
      </button>
    </div>
  </div>
</div>