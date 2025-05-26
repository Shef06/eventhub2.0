import Home from './pages/Home.svelte';
import Eventi from './pages/Eventi.svelte';
import Profilo from './pages/Profilo.svelte';
import Login from './pages/Login.svelte';
import Registrazione from './pages/Registrazione.svelte';
import Contatti from './pages/Contatti.svelte';
import EventoDettaglio from './pages/EventoDettaglio.svelte';
import CreazioneEvento from './pages/CreazioneEvento.svelte';
import NotFound from './pages/NotFound.svelte';

export default {
  '/': Home,
  '/eventi': Eventi,
  '/profilo': Profilo,
  '/login': Login,
  '/registrazione': Registrazione,
  '/contatti': Contatti,
  '/evento/:id': EventoDettaglio,
  '/crea-evento': CreazioneEvento,
  '*': NotFound,
};