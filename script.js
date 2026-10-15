

// Menú 
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', () => {
  // Cerrar menú al clickear link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('navLinks').classList.remove('open');
    });
  });

  // Animaciones 
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeUp 0.5s ease both';
        entry.target.style.opacity = '1';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(
    '.producto-card, .cat-card, .vision-card, .info-card, .stat-card, .valor-card'
  ).forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  // Cargar compras guardadas si estamos en mis-compras.html
  if (document.getElementById('listaCompras')) {
    mostrarCompras();
  }
});

// Filtros
function filtrar(btn, categoria) {
  document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.producto-card[data-cat]').forEach(card => {
    card.style.display = (categoria === 'todos' || card.dataset.cat === categoria) ? 'block' : 'none';
  });

  document.querySelectorAll('.seccion-productos').forEach(sec => {
    if (categoria === 'todos') {
      sec.style.display = 'block';
    } else {
      const tiene = sec.querySelectorAll(`.producto-card[data-cat="${categoria}"]`).length > 0;
      sec.style.display = tiene ? 'block' : 'none';
    }
  });
}


// SISTEMA DE COMPRAS


let productoActual = null;

function comprar(btn) {
  // Toma los datos de la tarjeta donde se clickeó
  const card     = btn.closest('.producto-card');
  const nombre   = card.querySelector('h4').textContent;
  const precio   = card.querySelector('.precio') ? card.querySelector('.precio').textContent : 'Sin precio';
  const imgSrc   = card.querySelector('img').src;

  productoActual = { nombre, precio, imgSrc };

  // Llena el modal con los datos del producto
  document.getElementById('modalNombre').textContent = nombre;
  document.getElementById('modalPrecio').textContent = precio;
  document.getElementById('modalImg').src = imgSrc;

  // Muestra el modal
  document.getElementById('modalCompra').classList.add('show');
}

function confirmarCompra() {
  if (!productoActual) return;

  // Guarda en localStorage
  const compras = JSON.parse(localStorage.getItem('compras') || '[]');
  compras.push({
    nombre:  productoActual.nombre,
    precio:  productoActual.precio,
    fecha:   new Date().toLocaleDateString('es-MX', { day:'2-digit', month:'short', year:'numeric' }),
    hora:    new Date().toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit' })
  });
  localStorage.setItem('compras', JSON.stringify(compras));

  cerrarModal();

  // Muestra confirmación
  document.getElementById('modalExito').classList.add('show');
}

function cerrarModal() {
  document.getElementById('modalCompra').classList.remove('show');
  productoActual = null;
}

function cerrarExito() {
  document.getElementById('modalExito').classList.remove('show');
}

function verMisCompras() {
  cerrarExito();
  window.location.href = 'mis-compras.html';
}

// Mostrar compras guardadas 
function mostrarCompras() {
  const lista   = document.getElementById('listaCompras');
  const compras = JSON.parse(localStorage.getItem('compras') || '[]');

  if (compras.length === 0) {
    lista.innerHTML = '<p class="sin-compras">Aún no has realizado ninguna compra 🛒</p>';
    return;
  }

  lista.innerHTML = compras.reverse().map((c, i) => `
    <div class="compra-item">
      <div>
        <strong>${c.nombre}</strong><br/>
        <span>${c.fecha} · ${c.hora}</span>
      </div>
      <span class="precio-tag">${c.precio}</span>
    </div>
  `).join('');
}

function limpiarCompras() {
  if (confirm('¿Seguro que quieres borrar el historial?')) {
    localStorage.removeItem('compras');
    mostrarCompras();
  }
}

// Contacto
function enviarMensaje() {
  const nombre  = document.getElementById('nombre');
  const numero  = document.getElementById('numero');
  const mensaje = document.getElementById('mensaje');

  if (!nombre || !nombre.value.trim()) {
    alert('Por favor escribe tu nombre 😊');
    return;
  }

  alert(`¡Gracias ${nombre.value.trim()}! 🙌\nTe contactaremos pronto por WhatsApp.`);
  if (nombre)  nombre.value  = '';
  if (numero)  numero.value  = '';
  if (mensaje) mensaje.value = '';
}

// 
// SISTEMA DE RESEÑAS
// 

let estrellaSeleccionada = 0;

const textoEstrellas = {
  1: '😕 Malo',
  2: '😐 Regular',
  3: '🙂 Bueno',
  4: '😊 Muy bueno',
  5: '🤩 ¡Excelente!'
};

function seleccionarEstrella(valor) {
  estrellaSeleccionada = valor;
  const estrellas = document.querySelectorAll('.estrella');
  estrellas.forEach((e, i) => {
    e.classList.toggle('activa', i < valor);
  });
  const texto = document.getElementById('estrellas-texto');
  if (texto) texto.textContent = textoEstrellas[valor];
}

function enviarResena() {
  const nombre     = document.getElementById('resena-nombre');
  const comentario = document.getElementById('resena-comentario');

  if (!nombre || !nombre.value.trim()) {
    alert('Por favor escribe tu nombre 😊'); return;
  }
  if (estrellaSeleccionada === 0) {
    alert('Por favor selecciona una calificación ⭐'); return;
  }
  if (!comentario || !comentario.value.trim()) {
    alert('Por favor escribe un comentario 📝'); return;
  }

  const resenas = JSON.parse(localStorage.getItem('resenas') || '[]');
  resenas.push({
    nombre:     nombre.value.trim(),
    estrellas:  estrellaSeleccionada,
    comentario: comentario.value.trim(),
    fecha:      new Date().toLocaleDateString('es-MX', {
                  day: '2-digit', month: 'short', year: 'numeric'
                })
  });
  localStorage.setItem('resenas', JSON.stringify(resenas));

  nombre.value = '';
  comentario.value = '';
  estrellaSeleccionada = 0;
  document.querySelectorAll('.estrella').forEach(e => e.classList.remove('activa'));
  const texto = document.getElementById('estrellas-texto');
  if (texto) texto.textContent = 'Selecciona una calificación';

  mostrarResenas();
  alert('¡Gracias por tu reseña! 🌟');
}

function mostrarResenas() {
  const lista  = document.getElementById('resenas-lista');
  const stats  = document.getElementById('resenas-stats');
  if (!lista) return;

  const resenas = JSON.parse(localStorage.getItem('resenas') || '[]');

  if (resenas.length === 0) {
    lista.innerHTML = '<p class="sin-resenas">Aún no hay reseñas. ¡Sé el primero! 🌟</p>';
    if (stats) stats.innerHTML = '';
    return;
  }

  const total    = resenas.length;
  const suma     = resenas.reduce((a, r) => a + r.estrellas, 0);
  const promedio = (suma / total).toFixed(1);
  const conteo   = [5,4,3,2,1].map(n => resenas.filter(r => r.estrellas === n).length);

  if (stats) {
    stats.innerHTML = `
      <div class="stats-promedio">
        <div class="stats-numero">${promedio}</div>
        <div class="stats-estrellas">${'★'.repeat(Math.round(promedio))}${'☆'.repeat(5 - Math.round(promedio))}</div>
        <div class="stats-total">${total} reseña${total !== 1 ? 's' : ''}</div>
      </div>
      <div class="stats-barras">
        ${[5,4,3,2,1].map((n, i) => `
          <div class="barra-row">
            <span>${n}★</span>
            <div class="barra-track">
              <div class="barra-fill" style="width:${total ? (conteo[i]/total*100) : 0}%"></div>
            </div>
            <span>${conteo[i]}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  lista.innerHTML = [...resenas].reverse().map(r => `
    <div class="resena-card">
      <div class="resena-top">
        <div class="resena-autor">
          <div class="resena-avatar">${r.nombre.charAt(0).toUpperCase()}</div>
          <div>
            <div class="resena-nombre">${r.nombre}</div>
            <div class="resena-fecha">${r.fecha}</div>
          </div>
        </div>
        <div class="resena-estrellas">${'★'.repeat(r.estrellas)}${'☆'.repeat(5 - r.estrellas)}</div>
      </div>
      <p class="resena-comentario">"${r.comentario}"</p>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('resenas-lista')) {
    mostrarResenas();
  }
});