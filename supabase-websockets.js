const SUPABASE_URL = 'https://ofhwjkojawhqncuwplhe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9maHdqa29qYXdocW5jdXdwbGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNzc5OTAsImV4cCI6MjA5Nzc1Mzk5MH0.MGMM4nOzL7GumPbNmKIxbjSnHJaHtCty6GGV7z_zgWI';

const clienteSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const canalVotacion = supabase.channel('sala-presentacion');

function emitirVoto(opcionElegida) {
  canalVotacion.send({
    type: 'broadcast',
    event: 'nuevo-voto',
    payload: { accion: opcionElegida }
  }).then(() => {
    console.log(`Voto enviado: ${opcionElegida}`);
  });
}

canalVotacion.subscribe((status) => {
  if (status === 'SUBSCRIBED') {
    console.log('Celular conectado al canal listo para enviar.');
  }
});

