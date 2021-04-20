<template>
    <div class="row">
      <div class="col">
        <b-card-header header-tag="h4" class="media flex-wrap align-items-center py-4">
          <div class="media-body"><i class="ion ion-ios-list-box"></i> &nbsp; Seguimiento de tareas</div>
        </b-card-header>
        <!-- / Header -->

        <hr class="border-light m-0">
        <!-- / Controls -->

        <!-- My Assigned tasks -->
        <div>
          <b-card-body>

            <div class="row mb-3">
              <div class="col-md-2">
                Asignado a: &nbsp;
                <b-select v-model="filtros.user" class="d-inline-block form-control" >
                  <option value="">Todos</option>
                  <option v-for="option in usuarios" :value="option.usuario" :key="option.usuario"> {{ option.nombre }} </option>
                </b-select>
              </div>
              <div class="col-md-2">
                Estado tarea: &nbsp;
                <b-select v-model="filtros.estado">
                  <option value="">Todos</option>
                  <option v-for="option in estados" :value="option.id" :key="option.id"> {{ option.nombre }} </option>
                </b-select>
              </div>
              <div class="col-md-2">
                Fechas tarea: <br>
                <flat-pickr v-model="filtros.fechatarea" :config="dateConfig" :placeholder="!isIEMode ? 'Desde - Hasta' : null" />
              </div>
              <div class="col-md-2">
                Fechas vencimiento: <br>
                <flat-pickr v-model="filtros.fechavencimiento" :config="dateConfig" :placeholder="!isIEMode ? 'Desde - Hasta' : null" />
              </div>
              <div class="col-md-1">
                <b-form-group class="mt-4">
                  <Label><input type="checkbox" v-model="filtros.vencidas" /> Vencidas</Label>
                </b-form-group>
              </div>
              <div class="col-md-2">
                <button class="btn btn-md btn-primary mt-3" v-on:click="filtrar()"> <i class="ion ion-ios-search"></i> Consultar</button>
              </div>
            </div>

            <div class="row">
              <div class="col-m-3">
                Registros por página: &nbsp;
                <b-select size="sm" v-model="perPage" :options="[10, 20, 30, 40, 50]" class="d-inline-block w-auto" />
              </div>
              <div class="col">
                Total tareas: <b>{{totalItems}}</b>
                <download-excel
                  class   = "btn btn-success rounded-pill btn-xs d-inline-block ml-4"
                  :data   = "tasks"
                  :fields = "json_fields"
                  worksheet = "Tareas"
                  name    = "SeguimientoDeTareas.xls">

                  <i class="ion ion-md-download"></i> Descargar

                </download-excel>
              </div>
              <div class="col">
                <b-input size="sm" placeholder="Buscar..." class="d-inline-block w-auto float-sm-right" @input="filter($event)" />
              </div>
            </div>

          </b-card-body>
          <!-- / Table controls -->

          <div class="table-responsive">

            <b-table
              :items="tasks"
              :fields="fields"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              :striped="true"
              :bordered="true"
              :current-page="currentPage"
              :per-page="perPage"
              class="card-table">

              <template v-slot:cell(titulo)="data">
                <router-link v-bind:to="'detalle_tarea/' + data.item.id" class="message-subject flex-shrink-1 d-block text-secondary">
                  <strong>{{data.item.titulo}}</strong>
                </router-link>
              </template>

              <template v-slot:cell(nombre)="data">
                <span :title="data.item.nombre +' ' + data.item.apellido">{{data.item.nombre}}</span>
              </template>

              <template v-slot:cell(asignado)="data">
                <span :title="data.item.nombre_asig +' ' + data.item.apellido_asig">{{data.item.nombre_asig}}</span>
              </template>

              <template v-slot:cell(fecha_tarea)="data">
                <span>{{data.item.fecha_tarea|formatDate}}</span>
              </template>

              <template v-slot:cell(fecha_vencimiento)="data">
                <span :class="{'text-danger': data.item.vencida}">{{data.item.fecha_vencimiento|formatDate}}</span>
                <i class="ion ion-ios-timer text-danger" v-if="data.item.vencida" title="Tarea vencida"></i>
              </template>

              <template v-slot:cell(estado)="data">
                <b-badge variant="outline-success">{{data.item.estado}}</b-badge>
              </template>

              <template v-slot:cell(actions)>
                <b-btn variant="default btn-xs icon-btn md-btn-flat" v-b-tooltip.hover title="Edit"><i class="ion ion-md-create"></i></b-btn>
                <b-btn variant="default btn-xs icon-btn md-btn-flat" v-b-tooltip.hover title="Remove"><i class="ion ion-md-close"></i></b-btn>
              </template>
            </b-table>

            <!-- Pagination -->
              <b-card-body class="pt-0 pb-3">
                  <div class="row">
                      <div class="col-sm text-sm-left text-center pt-3">
                          <span class="text-muted" v-if="totalItems">Página {{ currentPage }} de {{ totalPages }}</span>
                      </div>
                      <div class="col-sm pt-3">
                          <b-pagination class="justify-content-center justify-content-sm-end m-0"
                              v-if="totalItems"
                              v-model="currentPage"
                              :total-rows="totalItems"
                              :per-page="perPage"
                              size="sm" />
                      </div>
                  </div>
              </b-card-body>
          </div>
        </div>
      </div>
    </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>

<script>
import flatPickr from 'vue-flatpickr-component'
import axios from 'axios'
import validaciones from '../helpers/validations'

function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

function formatDate (date) {
  var d = new Date(date)
  var month = '' + (d.getMonth() + 1)
  var day = '' + d.getDate()
  var year = d.getFullYear()

  if (month.length < 2) {
    month = '0' + month
  }
  if (day.length < 2) {
    day = '0' + day
  }
  return [day, month, year].join('/')
}

export default {
  name: 'pages-monitor',
  metaInfo: {
    title: 'Seguimiento'
  },
  components: {
    flatPickr
  },
  beforeCreate: function () {
    if (!this.$session) {
      this.$router.push('/login')
    }
  },
  created () {
    this.tokenApp = validaciones.verifyAuth(this)
    this.cargarUsuarios()
    this.cargarTareas()
    this.cargarEstados()
  },
  data: () => ({
    tokenApp: '',
    filtros: {
      user: '',
      estado: '',
      fechatarea: '',
      fechavencimiento: '',
      vencidas: false
    },
    searchKeys: ['id', 'nombre', 'asignado', 'titulo', 'estado'],
    sortBy: 'fecha_tarea',
    sortDesc: true,
    perPage: 50,
    usuarios: [],
    estados: [],
    fields: [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'nombre', label: 'Propietario', sortable: true },
      { key: 'asignado', label: 'Asignado a', sortable: true },
      { key: 'titulo', sortable: true, thStyle: 'min-width: 18rem' },
      { key: 'prioridad', sortable: true },
      { key: 'fecha_tarea', label: 'Fecha Tarea', sortable: true, thClass: 'text-nowrap, text-center', tdClass: 'text-center' },
      { key: 'fecha_vencimiento', label: 'Fecha Vencimiento', sortable: true, thClass: 'text-nowrap, text-center', tdClass: 'text-center' },
      { key: 'Estado', sortable: true, tdClass: 'text-center', thClass: 'text-nowrap, text-center' }
    ],
    dateConfig: {
      mode: 'range',
      dateFormat: 'Y-m-d',
      altFormat: 'd/m/y',
      altInput: true,
      animate: !isRTL()
    },
    currentPage: 1,

    originalTasks: [],

    tasks: [],

    json_fields: {
      'ID': 'id',
      'Propietario': 'nombre',
      'Asignado a': 'nombre_asig',
      'Titulo': 'titulo',
      'Prioridad': 'prioridad',
      'Fecha Tarea': {
        field: 'fecha_tarea',
        callback: (value) => {
          return formatDate(value)
        }
      },
      'Fecha Vencimiento': {
        field: 'fecha_vencimiento',
        callback: (value) => {
          return formatDate(value)
        }
      },
      'Estado': 'estado'
    }
  }),

  computed: {
    totalItems () {
      return this.tasks.length
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },
  methods: {

    cargarUsuarios () {
      axios.get(`${this.apiUrl}users`, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': this.tokenApp
        }
      }).then(response => {
        const d = response.data
        for (var i in d) {
          let info = { usuario: d[i].usuario, nombre: d[i].nombre + ' ' + d[i].apellido, sigla: d[i].sigla, seleccionado: false }
          this.usuarios.push(info)
        }
      }).catch(e => {
        console.log(e)
      })
    },

    cargarEstados () {
      axios.get(`${this.apiUrl}status/`, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': this.tokenApp
        },
        validateStatus: () => true
      }).then(response => {
        if (response.status === 404 || response.status === 400) {
        } else {
          this.estados = response.data
        }
      }).catch(e => {
        console.log(e)
      })
    },

    cargarTareas (queryString = '') {
      this.tasks = []
      this.originalTasks = []
      axios.get(`${this.apiUrl}tareas` + queryString, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': this.tokenApp
        }
      }).then(response => {
        const d = response.data
        for (var x in d) {
          this.tasks.push(d[x])
          this.originalTasks.push(d[x])
        }
      }).catch(e => {
        console.log(e)
      })
    },

    filtrar () {
      var queryString = []
      if (this.filtros.user !== '') queryString.push(`usuario=${this.filtros.user}`)
      if (this.filtros.fechatarea !== '') {
        const fechasTarea = this.filtros.fechatarea.split(' to ')
        queryString.push(`fechatarea_ini=${fechasTarea[0]}`)
        queryString.push(`fechatarea_fin=${fechasTarea[1]}`)
      }
      if (this.filtros.fechavencimiento !== '') {
        const fechasVencimiento = this.filtros.fechavencimiento.split(' to ')
        queryString.push(`fechavencimiento_ini=${fechasVencimiento[0]}`)
        queryString.push(`fechavencimiento_fin=${fechasVencimiento[1]}`)
      }
      if (this.filtros.vencidas) queryString.push(`vencidas=1`)
      if (this.filtros.estado) queryString.push(`estado=${this.filtros.estado}`)

      this.cargarTareas('?' + queryString.join('&'))
    },

    filter (value) {
      const val = value.toLowerCase()
      const filtered = this.originalTasks.filter(d => (
        Object.keys(d)
          .filter(k => this.searchKeys.includes(k))
          .map(k => String(d[k]))
          .join('|')
          .toLowerCase()
          .indexOf(val) !== -1 || !val
      ))
      this.tasks = filtered
    }
  },

  mounted () {
    this.layoutHelpers.setCollapsed(true, false)
  }
}
</script>
