<script lang="ts">
  import EventoCard from '../components/ui/EventoCard.svelte';
  
  let eventi = [
    {
      id: '1',
      titolo: 'Festival della Musica Italiana',
      data: '2024-07-15T18:00:00.000Z',
      luogo: 'Roma, Piazza del Popolo',
      categoria: 'Musica',
      immagine: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
      partecipanti: 150,
      organizzatore: 'Associazione Culturale Roma'
    },
    {
      id: '2',
      titolo: 'Food & Wine Experience',
      data: '2024-06-20T19:30:00.000Z',
      luogo: 'Milano, Fiera Milano City',
      categoria: 'Cibo e Vino',
      immagine: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
      partecipanti: 200,
      organizzatore: 'Gusto Italiano'
    },
    {
      id: '3',
      titolo: 'Tech Conference 2024',
      data: '2024-09-10T09:00:00.000Z',
      luogo: 'Torino, Centro Congressi',
      categoria: 'Tecnologia',
      immagine: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
      partecipanti: 300,
      organizzatore: 'Tech Italia'
    },
    {
      id: '5',
      titolo: 'Biennale di Venezia',
      data: '2024-05-20T10:00:00.000Z',
      luogo: 'Venezia, Giardini della Biennale',
      categoria: 'Arte',
      immagine: 'https://images.pexels.com/photos/1674049/pexels-photo-1674049.jpeg',
      partecipanti: 800,
      organizzatore: 'Fondazione Biennale'
    },
    {
      id: '6',
      titolo: 'Festival del Cinema di Roma',
      data: '2024-10-18T20:00:00.000Z',
      luogo: 'Roma, Auditorium Parco della Musica',
      categoria: 'Cinema',
      immagine: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
      partecipanti: 1200,
      organizzatore: 'Fondazione Cinema per Roma'
    },
    {
      id: '7',
      titolo: 'Taste of Italy',
      data: '2024-08-05T12:00:00.000Z',
      luogo: 'Bologna, FICO Eataly World',
      categoria: 'Cibo e Vino',
      immagine: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
      partecipanti: 450,
      organizzatore: 'Eataly'
    },
    {
      id: '8',
      titolo: 'Rock in Roma',
      data: '2024-07-01T19:00:00.000Z',
      luogo: 'Roma, Ippodromo delle Capannelle',
      categoria: 'Musica',
      immagine: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
      partecipanti: 3000,
      organizzatore: 'Rock in Roma'
    },
    {
      id: '9',
      titolo: 'Startup Weekend',
      data: '2024-09-28T09:00:00.000Z',
      luogo: 'Milano, Talent Garden',
      categoria: 'Tecnologia',
      immagine: 'https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg',
      partecipanti: 150,
      organizzatore: 'Techstars'
    },
    {
      id: '10',
      titolo: 'Giro d\'Italia',
      data: '2024-05-11T08:00:00.000Z',
      luogo: 'Torino, Piazza Castello',
      categoria: 'Sport',
      immagine: 'https://images.pexels.com/photos/2158963/pexels-photo-2158963.jpeg',
      partecipanti: 200,
      organizzatore: 'RCS Sport'
    },
    {
      id: '11',
      titolo: 'Festa del Redentore',
      data: '2024-07-20T18:00:00.000Z',
      luogo: 'Venezia, Bacino di San Marco',
      categoria: 'Arte',
      immagine: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
      partecipanti: 5000,
      organizzatore: 'Comune di Venezia'
    },
    {
      id: '12',
      titolo: 'Lucca Comics & Games',
      data: '2024-10-30T10:00:00.000Z',
      luogo: 'Lucca, Centro Storico',
      categoria: 'Cinema',
      immagine: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
      partecipanti: 2500,
      organizzatore: 'Lucca Comics & Games'
    },
    {
      id: '13',
      titolo: 'Salone del Mobile',
      data: '2024-04-16T09:00:00.000Z',
      luogo: 'Milano, Fiera Milano Rho',
      categoria: 'Arte',
      immagine: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      partecipanti: 2000,
      organizzatore: 'Fondazione Fiera Milano'
    },
    {
      id: '14',
      titolo: 'Vinitaly',
      data: '2024-04-14T10:00:00.000Z',
      luogo: 'Verona, Veronafiere',
      categoria: 'Cibo e Vino',
      immagine: 'https://images.pexels.com/photos/2912108/pexels-photo-2912108.jpeg',
      partecipanti: 4000,
      organizzatore: 'Veronafiere'
    },
    {
      id: '15',
      titolo: 'Mantova Comics & Games',
      data: '2024-09-14T09:00:00.000Z',
      luogo: 'Mantova, Centro Fiera',
      categoria: 'Cinema',
      immagine: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
      partecipanti: 1500,
      organizzatore: 'Mantova Comics'
    },
    {
      id: '16',
      titolo: 'Ferrara Buskers Festival',
      data: '2024-08-23T16:00:00.000Z',
      luogo: 'Ferrara, Centro Storico',
      categoria: 'Musica',
      immagine: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
      partecipanti: 800,
      organizzatore: 'Comune di Ferrara'
    },
    {
      id: '17',
      titolo: 'Maker Faire Rome',
      data: '2024-10-25T10:00:00.000Z',
      luogo: 'Roma, Fiera di Roma',
      categoria: 'Tecnologia',
      immagine: 'https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg',
      partecipanti: 1000,
      organizzatore: 'Maker Faire'
    },
    {
      id: '18',
      titolo: 'Coppa Italia Finale',
      data: '2024-05-15T20:45:00.000Z',
      luogo: 'Roma, Stadio Olimpico',
      categoria: 'Sport',
      immagine: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
      partecipanti: 70000,
      organizzatore: 'FIGC'
    },
    {
      id: '19',
      titolo: 'Festival della Scienza',
      data: '2024-10-25T09:00:00.000Z',
      luogo: 'Genova, Porto Antico',
      categoria: 'Tecnologia',
      immagine: 'https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg',
      partecipanti: 1200,
      organizzatore: 'Associazione Festival della Scienza'
    },
    {
      id: '20',
      titolo: 'Parma Food Valley',
      data: '2024-09-10T11:00:00.000Z',
      luogo: 'Parma, Fiere di Parma',
      categoria: 'Cibo e Vino',
      immagine: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
      partecipanti: 3000,
      organizzatore: 'Fiere di Parma'
    },
    {
      id: '21',
      titolo: 'Ravenna Festival',
      data: '2024-06-01T20:00:00.000Z',
      luogo: 'Ravenna, Teatro Alighieri',
      categoria: 'Musica',
      immagine: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
      partecipanti: 600,
      organizzatore: 'Ravenna Festival'
    }
  ];

  let categorie = ['Musica', 'Cibo e Vino', 'Tecnologia', 'Sport', 'Arte', 'Cinema'];
  let luoghi = [
    'Roma', 'Milano', 'Torino', 'Firenze', 'Napoli', 'Bologna',
    'Venezia', 'Genova', 'Palermo', 'Bari', 'Catania', 'Verona',
    'Padova', 'Trieste', 'Parma', 'Modena', 'Reggio Emilia',
    'Perugia', 'Ancona', 'Pescara', 'Cagliari', 'Brescia',
    'Bergamo', 'Vicenza', 'Ravenna', 'Ferrara', 'Rimini',
    'Salerno', 'Taranto', 'Messina', 'Prato', 'Pisa'
  ];
  let ricerca = '';
  let categoriaSelezionata = '';
  let luogoSelezionato = '';
  let dataSelezionata = '';

  function resetFiltri() {
    ricerca = '';
    categoriaSelezionata = '';
    luogoSelezionato = '';
    dataSelezionata = '';
  }
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
          <svg class="w-4 h-4 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input 
          type="search" 
          class="input input-bordered pl-10 w-full" 
          placeholder="Cerca eventi, luoghi, organizzatori..." 
          bind:value={ricerca}
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
      <button class="btn btn-outline btn-sm mr-2" on:click={resetFiltri}>
        Reset filtri
      </button>
    </div>
  </div>

  <!-- Risultati -->
  <div>
    {#if eventi.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each eventi as evento (evento.id)}
          <div class="animate-fade-in">
            <EventoCard {...evento} />
          </div>
        {/each}
      </div>
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
</div>