<script lang="ts">
  import { onMount } from 'svelte';
  import { getUserProfile } from '../services/api';
  import { push } from 'svelte-spa-router';
  import EventoCard from '../components/ui/EventoCard.svelte';
  
  let activeTab = 'partecipazioni';
  let utente: any = null;
  let loading = true;
  let error = '';
  
  onMount(async () => {
    try {
      utente = await getUserProfile();
    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  });
  
  // Dati di esempio per gli eventi a cui partecipa l'utente
  const eventiPartecipati = [
    {
      id: '1',
      titolo: 'Festival della Musica Italiana',
      data: '2025-06-15T18:30:00',
      luogo: 'Milano, Piazza Duomo',
      categoria: 'Musica',
      immagine: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
      partecipanti: 1250,
      organizzatore: 'Comune di Milano'
    },
    {
      id: '3',
      titolo: 'Maratona di Firenze',
      data: '2025-04-12T08:00:00',
      luogo: 'Firenze, Piazzale Michelangelo',
      categoria: 'Sport',
      immagine: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
      partecipanti: 520,
      organizzatore: 'SportItalia'
    }
  ];
  
  // Dati di esempio per gli eventi organizzati dall'utente
  const eventiOrganizzati = [
    {
      id: '5',
      titolo: 'Workshop di Programmazione',
      data: '2025-07-20T14:00:00',
      luogo: 'Milano, Centro Innovazione',
      categoria: 'Tecnologia',
      immagine: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg',
      partecipanti: 28,
      organizzatore: 'Mario Rossi'
    }
  ];
  
  function formattaData(dataString: string): string {
    const data = new Date(dataString);
    return data.toLocaleDateString('it-IT', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    });
  }
  
  function navigateTo(path: string) {
    push(path);
  }
</script>

{#if loading}
  <div class="flex justify-center items-center min-h-[calc(100vh-64px)]">
    <span class="loading loading-spinner loading-lg"></span>
  </div>
{:else if error}
  <div class="alert alert-error">
    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    <span>{error}</span>
  </div>
{:else if utente}
  <div class="page-container">
    <div class="flex flex-col lg:flex-row gap-6 mb-8">
      <!-- Colonna profilo -->
      <div class="lg:w-1/3">
        <div class="card bg-base-100 shadow-md">
          <div class="card-body">
            <div class="flex flex-col items-center text-center">
              <div class="avatar mb-4">
                <div class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={utente.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'} alt={utente.name} />
                </div>
              </div>
              <h2 class="text-2xl font-bold">{utente.name}</h2>
              <p class="text-base-content/70 mb-4">{utente.email}</p>
              <div class="stats stats-vertical shadow bg-base-200 w-full">
                <div class="stat">
                  <div class="stat-title">Registrato il</div>
                  <div class="stat-value text-lg">{new Date(utente.createdAt).toLocaleDateString()}</div>
                </div>
                <div class="stat">
                  <div class="stat-title">Eventi Partecipati</div>
                  <div class="stat-value text-lg">{utente.eventiPartecipati}</div>
                </div>
                <div class="stat">
                  <div class="stat-title">Eventi Organizzati</div>
                  <div class="stat-value text-lg">{utente.eventiOrganizzati}</div>
                </div>
              </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="flex flex-col gap-2">
              <button class="btn btn-primary w-full" on:click={() => navigateTo('/crea-evento')}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Crea nuovo evento
              </button>
              <button class="btn btn-outline w-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modifica profilo
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Colonna eventi -->
      <div class="lg:w-2/3">
        <div class="card bg-base-100 shadow-md">
          <div class="card-body">
            <div class="tabs tabs-boxed bg-base-200 mb-6">
              <a 
                class="tab tab-lg {activeTab === 'partecipazioni' ? 'tab-active' : ''}"
                on:click={() => activeTab = 'partecipazioni'}
              >
                I miei eventi
              </a>
              <a 
                class="tab tab-lg {activeTab === 'organizzati' ? 'tab-active' : ''}"
                on:click={() => activeTab = 'organizzati'}
              >
                Eventi organizzati
              </a>
            </div>
            
            {#if activeTab === 'partecipazioni'}
              <h3 class="text-xl font-bold mb-6">Eventi a cui partecipi</h3>
              {#if eventiPartecipati.length > 0}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {#each eventiPartecipati as evento (evento.id)}
                    <div class="animate-fade-in">
                      <EventoCard {...evento} />
                    </div>
                  {/each}
                </div>
              {:else}
                <div class="text-center py-8">
                  <div class="mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-bold mb-2">Nessun evento</h3>
                  <p class="text-base-content/70 mb-4">Non stai partecipando a nessun evento al momento.</p>
                  <button class="btn btn-primary" on:click={() => push('/eventi')}>Esplora eventi</button>
                </div>
              {/if}
            {:else if activeTab === 'organizzati'}
              <h3 class="text-xl font-bold mb-6">Eventi organizzati da te</h3>
              {#if eventiOrganizzati.length > 0}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {#each eventiOrganizzati as evento (evento.id)}
                    <div class="animate-fade-in">
                      <EventoCard {...evento} />
                    </div>
                  {/each}
                </div>
              {:else}
                <div class="text-center py-8">
                  <div class="mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-bold mb-2">Nessun evento organizzato</h3>
                  <p class="text-base-content/70 mb-4">Non hai ancora organizzato nessun evento.</p>
                  <button class="btn btn-primary" on:click={() => push('/crea-evento')}>Crea il tuo primo evento</button>
                </div>
              {/if}
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}