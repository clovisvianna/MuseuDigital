// Links do menu
const links = document.querySelectorAll('.menu-link');
const secoes = document.querySelectorAll('.secao');

let calendarInitialized = false; // evita reinicialização

// Mostra a seção correta e oculta as outras
function mostrarSecao(id) {
  secoes.forEach(sec => {
    sec.style.display = (sec.id === id) ? 'block' : 'none';
  });
  if (id === 'eventos' && !calendarInitialized) {
    setTimeout(() => {
      initCalendar();
      calendarInitialized = true;
    }, 50); // pequeno delay garante que o container esteja visível
  }
}

// Eventos do menu
links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const secao = link.getAttribute('data-section');
    mostrarSecao(secao);
  });
});

// FullCalendar
function initCalendar() {
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) return;

  const savedEvents = JSON.parse(localStorage.getItem('eventosMuseu')) || [];

  const calendar = new FullCalendar.Calendar(calendarEl, {
    themeSystem: 'bootstrap5',
    initialView: 'dayGridMonth',
    locale: 'pt-br',
    height: 'auto',
    events: savedEvents,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek'
    },
    dateClick: function (info) {
      const title = prompt('Título do evento:');
      if (title) {
        const newEvent = {
          title: title,
          start: info.dateStr,
          allDay: true
        };
        calendar.addEvent(newEvent);
        savedEvents.push(newEvent);
        localStorage.setItem('eventosMuseu', JSON.stringify(savedEvents));
      }
    },
    eventClick: function (info) {
      const deleteConfirm = confirm('Deseja remover este evento?\n\n' + info.event.title);
      if (deleteConfirm) {
        info.event.remove();
        const index = savedEvents.findIndex(e => e.start === info.event.startStr && e.title === info.event.title);
        if (index > -1) {
          savedEvents.splice(index, 1);
          localStorage.setItem('eventosMuseu', JSON.stringify(savedEvents));
        }
      }
    }
  });

  calendar.render();
}

// Seção inicial
document.addEventListener('DOMContentLoaded', () => {
  mostrarSecao('inicio');
});

// Rolagem
document.querySelectorAll('.menu-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const sectionId = this.getAttribute('data-section');
    const section = document.getElementById(sectionId);
    if (section) {
      const navbarHeight = document.querySelector('.navbar').offsetHeight;
      const sectionPosition = section.offsetTop - navbarHeight;
      window.scrollTo({
        top: sectionPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Destacar o item
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.menu-link');

window.addEventListener('scroll', () => {
  let scrollPos = window.scrollY + document.querySelector('.navbar').offsetHeight + 10;
  sections.forEach(section => {
    if (
      scrollPos >= section.offsetTop &&
      scrollPos < section.offsetTop + section.offsetHeight
    ) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === section.id) {
          link.classList.add('active');
        }
      });
    }
  });
});

// Calendário
document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  // Registrar o locale manualmente
  FullCalendar.globalLocales.push({
    code: 'pt-br',
    week: {
      dow: 1, // segunda-feira é o primeiro dia da semana
      doy: 4
    },
    buttonText: {
      prev: 'Anterior',
      next: 'Próximo',
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana',
      day: 'Dia',
      list: 'Lista'
    },
    weekText: 'Sm',
    allDayText: 'Dia inteiro',
    moreLinkText: 'mais',
    noEventsText: 'Não há eventos para mostrar'
  });

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'pt-br', // usa o locale registrado
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listMonth'
    },
    events: [
      { title: 'Exposição Afro-Brasileira', start: '2025-11-05', end: '2025-11-10', color: '#6f42c1' },
      { title: 'Oficina de Capoeira', start: '2025-11-15', color: '#20c997' },
      { title: 'Sarau Cultural', start: '2025-11-22T18:00:00', color: '#fd7e14' },
      { title: 'Feira de Artesanato', start: '2025-12-03', color: '#0d6efd' }
    ]
  });

  calendar.render();
});