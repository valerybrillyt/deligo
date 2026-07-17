import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, PedidoResumen, SeguimientoPedido } from '../services/api.service';
import { AuthService } from '../services/auth.service';

/* Leaflet cargado por CDN en index.html */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const L: any;

const ETIQUETAS: Record<string, string> = {
  pendiente: 'Pedido recibido',
  preparando: 'Preparando tu comida',
  en_camino: 'Repartidor en camino',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

type FiltroPedidos = 'todos' | 'pendientes' | 'entregados';

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './seguimiento.component.html',
  styleUrl: './seguimiento.component.css',
})
export class SeguimientoComponent implements OnInit, OnDestroy {
  pedidoId = 0;
  seguimiento: SeguimientoPedido | null = null;
  misPedidos: PedidoResumen[] = [];
  filtro: FiltroPedidos = 'todos';
  error = '';
  cancelando = false;
  private intervalo?: ReturnType<typeof setInterval>;
  private ticks = 0;
  private mapa?: { remove: () => void; setView: (c: number[], z: number) => void; fitBounds: (b: unknown, o: object) => void; removeLayer: (l: unknown) => void; invalidateSize: () => void };
  private capasMapa: unknown[] = [];

  constructor(private api: ApiService, public auth: AuthService) {}

  estadoLabel(estado: string) {
    return ETIQUETAS[estado] || estado;
  }

  get pedidosFiltrados() {
    if (this.filtro === 'entregados') {
      return this.misPedidos.filter((p) => p.estado === 'entregado');
    }
    if (this.filtro === 'pendientes') {
      return this.misPedidos.filter((p) =>
        ['pendiente', 'preparando', 'en_camino'].includes(p.estado)
      );
    }
    return this.misPedidos;
  }

  contarFiltro(f: FiltroPedidos) {
    if (f === 'entregados') return this.misPedidos.filter((p) => p.estado === 'entregado').length;
    if (f === 'pendientes') {
      return this.misPedidos.filter((p) =>
        ['pendiente', 'preparando', 'en_camino'].includes(p.estado)
      ).length;
    }
    return this.misPedidos.length;
  }

  pedidoVisibleEnFiltro() {
    return this.pedidosFiltrados.some((p) => p.id === this.pedidoId);
  }

  cambiarFiltro(f: FiltroPedidos) {
    this.filtro = f;
    const lista = this.pedidosFiltrados;
    if (!lista.length) {
      this.pedidoId = 0;
      this.seguimiento = null;
      this.destruirMapa();
      return;
    }
    const sigueVisible = lista.some((p) => p.id === this.pedidoId);
    if (!sigueVisible) {
      this.seleccionarPedido(lista[0].id);
    }
  }

  ngOnInit() {
    const guardado = localStorage.getItem('ultimoPedidoId');
    if (guardado) this.pedidoId = Number(guardado);

    this.cargarLista();
    if (this.pedidoId) this.cargarSeguimiento();

    this.intervalo = setInterval(() => {
      const fin = ['entregado', 'cancelado'];
      if (!this.pedidoId || fin.includes(this.seguimiento?.estado || '')) return;
      this.ticks++;
      if (this.ticks % 2 === 0) this.avanzarEstadoAutomatico();
      else this.cargarSeguimiento(true);
    }, 8000);
  }

  ngOnDestroy() {
    if (this.intervalo) clearInterval(this.intervalo);
    this.destruirMapa();
  }

  cargarLista() {
    const uid = localStorage.getItem('usuarioId');
    if (!uid) return;
    this.api.getPedidos().subscribe({
      next: (p) => {
        this.misPedidos = p;
        const lista = this.pedidosFiltrados;
        if (lista.length && !this.pedidoId) {
          this.pedidoId = lista[0].id;
          this.cargarSeguimiento();
        } else if (this.pedidoId && !lista.some((x) => x.id === this.pedidoId)) {
          this.cambiarFiltro(this.filtro);
        }
      },
    });
  }

  cargarSeguimiento(silencioso = false) {
    if (!this.pedidoId) return;
    if (!silencioso) this.error = '';
    this.api.getSeguimiento(this.pedidoId).subscribe({
      next: (data) => {
        this.seguimiento = data;
        setTimeout(() => this.pintarMapa(), 50);
      },
      error: () => {
        if (!silencioso) this.error = 'No encontramos ese pedido';
        this.seguimiento = null;
        this.destruirMapa();
      },
    });
  }

  puedeCancelar() {
    const e = this.seguimiento?.estado;
    return e === 'pendiente' || e === 'preparando';
  }

  cancelarPedido() {
    if (!this.pedidoId || !this.puedeCancelar()) return;
    if (!confirm('¿Cancelar este pedido? No se te cobrará nada.')) return;
    this.cancelando = true;
    this.api.cancelarPedido(this.pedidoId).subscribe({
      next: (res) => {
        this.cancelando = false;
        this.cargarSeguimiento();
        this.cargarLista();
        alert(res.mensaje);
      },
      error: (err) => {
        this.cancelando = false;
        this.error = err.error?.error || 'No se pudo cancelar';
      },
    });
  }

  seleccionarPedido(id: number) {
    this.pedidoId = id;
    this.ticks = 0;
    localStorage.setItem('ultimoPedidoId', String(id));
    this.cargarSeguimiento();
  }

  private avanzarEstadoAutomatico() {
    const orden = ['pendiente', 'preparando', 'en_camino', 'entregado'];
    const actual = this.seguimiento?.estado;
    const i = orden.indexOf(actual || 'pendiente');
    if (i < 0 || i >= 3) return;
    this.api.actualizarEstado(this.pedidoId, orden[i + 1]).subscribe({
      next: () => this.cargarSeguimiento(true),
    });
  }

  private destruirMapa() {
    if (this.mapa) {
      this.mapa.remove();
      this.mapa = undefined;
    }
    this.capasMapa = [];
  }

  private iconoHtml(emoji: string, bg: string) {
    return L.divIcon({
      className: 'map-pin-custom',
      html: `<span style="background:${bg};padding:6px 10px;border-radius:12px;font-size:18px;box-shadow:0 4px 12px rgba(0,0,0,.2)">${emoji}</span>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  }

  private pintarMapa() {
    if (typeof L === 'undefined' || !this.seguimiento?.mapa) return;

    const el = document.getElementById('delivery-map');
    if (!el) return;

    const { origen, destino, mapa } = this.seguimiento;
    const coords = mapa.coordenadas || [];
    const rep = mapa.repartidor || origen;

    if (!this.mapa) {
      this.mapa = L.map(el, { scrollWheelZoom: false });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(this.mapa);
    }

    const map = this.mapa;
    if (!map) return;

    this.capasMapa.forEach((c) => map.removeLayer(c));
    this.capasMapa = [];

    if (coords.length > 1) {
      const linea = L.polyline(coords, {
        color: '#ff4d00',
        weight: 5,
        opacity: 0.85,
      });
      linea.addTo(map);
      this.capasMapa.push(linea);
      map.fitBounds(linea.getBounds(), { padding: [40, 40] });
    } else {
      map.setView([origen.lat, origen.lng], 14);
    }

    const mRest = L.marker([origen.lat, origen.lng], {
      icon: this.iconoHtml('🍽️', '#fff7ed'),
    }).bindPopup(`<b>${origen.nombre}</b><br>Restaurante`);
    mRest.addTo(map);
    this.capasMapa.push(mRest);

    const mCasa = L.marker([destino.lat, destino.lng], {
      icon: this.iconoHtml('🏠', '#ecfdf5'),
    }).bindPopup(`<b>Tu casa</b><br>${destino.direccion || 'Entrega'}`);
    mCasa.addTo(map);
    this.capasMapa.push(mCasa);

    const mRep = L.marker([rep.lat, rep.lng], {
      icon: this.iconoHtml('🛵', '#dbeafe'),
    }).bindPopup('<b>Repartidor</b><br>En ruta');
    mRep.addTo(map);
    this.capasMapa.push(mRep);

    setTimeout(() => map.invalidateSize(), 200);
  }
}
