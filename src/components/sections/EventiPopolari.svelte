<script lang="ts">
  import EventoCard from '../ui/EventoCard.svelte';
  import { onMount } from 'svelte';
  
  // Dati di esempio per gli eventi
  const eventiPopolari = [
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
      id: '2',
      titolo: 'Workshop di Fotografia',
      data: '2025-05-22T10:00:00',
      luogo: 'Roma, Galleria d\'Arte Moderna',
      categoria: 'Arte',
      immagine: 'https://images.pexels.com/photos/2901628/pexels-photo-2901628.jpeg',
      partecipanti: 45,
      organizzatore: 'FotoClub Italia'
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
    },
    {
      id: '4',
      titolo: 'Conferenza sul Cambiamento Climatico',
      data: '2025-03-28T09:30:00',
      luogo: 'Bologna, Centro Congressi',
      categoria: 'Scienza',
      immagine: 'https://images.pexels.com/photos/7097/people-coffee-tea-meeting.jpg',
      partecipanti: 320,
      organizzatore: 'Università di Bologna'
    }
  ];
</script>

<section class="bg-base-100 py-16">
  <div class="container mx-auto px-4">
    <div class="text-center mb-10">
      <h2 class="text-3xl font-bold mb-2">Eventi Popolari</h2>
      <p class="text-base-content/70 max-w-2xl mx-auto">Scopri gli eventi più interessanti e partecipati della nostra community</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each eventiPopolari as evento (evento.id)}
        <div class="animate-slide-up">
          <EventoCard {...evento} />
        </div>
      {/each}
    </div>
    
    <div class="text-center mt-10">
      <a href="/eventi" class="btn btn-primary">Visualizza tutti gli eventi</a>
    </div>
  </div>
</section>