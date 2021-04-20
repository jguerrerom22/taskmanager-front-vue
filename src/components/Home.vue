<template>
  <div>

    <div class="row">

      <!-- Messages sidebox -->
      <div class="messages-sidebox col mb-4">

        <router-link to="/tarea" class="btn btn-primary mt-md-4 btn-block" tag="button" variant="primary mt-md-4" :block="true">Crear Tarea</router-link>
        <hr class="border-light my-4">

        <a v-for="(box, boxId) in tasksBoxes" :key="box.title" v-on:click="changePage(boxId)" href="javascript:void(0)" class="d-flex justify-content-between align-items-center py-2" :class="{'font-weight-bold text-body': currentTaskBox === boxId, 'text-muted': currentTaskBox !== boxId}">
          <div><i :class="box.icon"></i> &nbsp; {{box.title}}</div>
          <div class="badge badge-primary" v-if="box.count">{{box.count}}</div>
        </a>

      </div>
      <!-- / Messages sidebox -->

      <div class="col">

        <!-- Messages list -->
        <b-card no-body>

          <!-- Header -->
          <b-card-header header-tag="h4" class="media flex-wrap align-items-center py-4">
            <div class="media-body"><i class="ion ion-ios-filing"></i> &nbsp; Mis Tareas</div>
          </b-card-header>
          <!-- / Header -->

          <hr class="border-light m-0">
          <!-- / Controls -->

          <!-- My Assigned tasks -->
          <div v-if="tasksBoxes.myAssigned.isActive === true">
            <b-card-body>

              <div class="row">
                <div class="col">
                  Registros por página: &nbsp;
                  <b-select size="sm" v-model="perPage" :options="[10, 20, 30, 40, 50]" class="d-inline-block w-auto" />
                </div>
                <div class="col">
                  <b-input size="sm" placeholder="Buscar..." class="d-inline-block w-auto float-sm-right" @input="filterMyAssigned($event)" />
                </div>
              </div>

            </b-card-body>
            <!-- / Table controls -->

            <div class="table-responsive">

              <b-table
                :items="tasksMyAssigned"
                :fields="fieldsMyAssigned"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :striped="true"
                :bordered="true"
                :current-page="currentPageMyAssigned"
                :per-page="perPage"
                class="card-table">

                <template v-slot:cell(titulo)="data">
                  <router-link v-bind:to="'detalle_tarea/' + data.item.id" class="message-subject flex-shrink-1 d-block text-secondary">
                    <strong>{{data.item.titulo}}</strong>
                  </router-link>
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
                    <span class="text-muted" v-if="totalItemsMyAssigned">Página {{ currentPageMyAssigned }} de {{ totalPagesMyAssigned }}</span>
                  </div>
                  <div class="col-sm pt-3">
                    <b-pagination class="justify-content-center justify-content-sm-end m-0"
                      v-if="totalItemsMyAssigned"
                      v-model="currentPageMyAssigned"
                      :total-rows="totalItemsMyAssigned"
                      :per-page="perPage"
                      size="sm" />
                  </div>
                </div>

              </b-card-body>
            </div>
          </div>

          <!-- My Created tasks -->
          <div v-if="tasksBoxes.myCreated.isActive === true">
            <b-card-body>

              <div class="row">
                <div class="col">
                  Registros por página: &nbsp;
                  <b-select size="sm" v-model="perPage" :options="[10, 20, 30, 40, 50]" class="d-inline-block w-auto" />
                </div>
                <div class="col">
                  <b-input size="sm" placeholder="Buscar..." class="d-inline-block w-auto float-sm-right" @input="filterMyCreated($event)" />
                </div>
              </div>

            </b-card-body>
            <!-- / Table controls -->

            <div class="table-responsive">

              <b-table
                :items="tasksMyCreated"
                :fields="fieldsMyCreated"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :striped="true"
                :bordered="true"
                :current-page="currentPageMyCreated"
                :per-page="perPage"
                class="card-table">

                <template v-slot:cell(titulo)="data">
                  <router-link v-bind:to="'detalle_tarea/' + data.item.id" class="message-subject flex-shrink-1 d-block text-secondary">
                    <strong>{{data.item.titulo}}</strong>
                  </router-link>
                </template>

                <template v-slot:cell(fecha_tarea)="data">
                  <span>{{data.item.fecha_tarea|formatDate}}</span>
                </template>

                <template v-slot:cell(fecha_vencimiento)="data">
                  <span :class="{'text-danger': data.item.vencida}">{{data.item.fecha_vencimiento|formatDate}}</span>
                  <i class="ion ion-ios-timer text-danger" v-if="data.item.vencida" title="Tarea vencida"></i>
                </template>

                <template v-slot:cell(estado)="data">
                  <b-badge variant="outline-success" >{{data.item.estado}}</b-badge>
                </template>

              </b-table>

              <!-- Pagination -->
              <b-card-body class="pt-0 pb-3">

                <div class="row">
                  <div class="col-sm text-sm-left text-center pt-3">
                    <span class="text-muted" v-if="totalItemsMyCreated">Página {{ currentPageMyCreated }} de {{ totalPagesMyCreated }}</span>
                  </div>
                  <div class="col-sm pt-3">
                    <b-pagination class="justify-content-center justify-content-sm-end m-0"
                      v-if="totalItemsMyCreated"
                      v-model="currentPageMyCreated"
                      :total-rows="totalItemsMyCreated"
                      :per-page="perPage"
                      size="sm" />
                  </div>
                </div>

              </b-card-body>
              <!-- / Pagination -->
            </div>
          </div>

          <!-- To Approve tasks -->
          <div v-if="tasksBoxes.toApprove.isActive === true">
            <b-card-body>

              <div class="row">
                <div class="col">
                  Registros por página: &nbsp;
                  <b-select size="sm" v-model="perPage" :options="[10, 20, 30, 40, 50]" class="d-inline-block w-auto" />
                </div>
                <div class="col">
                  <b-input size="sm" placeholder="Buscar..." class="d-inline-block w-auto float-sm-right" @input="filterToApprove($event)" />
                </div>
              </div>

            </b-card-body>
            <!-- / Table controls -->

            <div class="table-responsive">

              <b-table
                :items="tasksToApprove"
                :fields="fieldsToApprove"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :striped="true"
                :bordered="true"
                :current-page="currentPageToApprove"
                :per-page="perPage"
                class="card-table">

                <template v-slot:cell(titulo)="data">
                  <router-link v-bind:to="'detalle_tarea/' + data.item.id" class="message-subject flex-shrink-1 d-block text-secondary ">
                    <strong>{{data.item.titulo}}</strong>
                  </router-link>
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
                    <span class="text-muted" v-if="totalItemsToApprove">Página {{ currentPageToApprove }} de {{ totalPagesToApprove }}</span>
                  </div>
                  <div class="col-sm pt-3">
                    <b-pagination class="justify-content-center justify-content-sm-end m-0"
                      v-if="totalItemsToApprove"
                      v-model="currentPageToApprove"
                      :total-rows="totalItemsToApprove"
                      :per-page="perPage"
                      size="sm" />
                  </div>
                </div>

              </b-card-body>
            </div>
          </div>

          <!-- Closed tasks -->
          <div v-if="tasksBoxes.closed.isActive === true">
            <b-card-body>

              <div class="row">
                <div class="col">
                  Registros por página: &nbsp;
                  <b-select size="sm" v-model="perPage" :options="[10, 20, 30, 40, 50]" class="d-inline-block w-auto" />
                </div>
                <div class="col">
                  <b-input size="sm" placeholder="Buscar..." class="d-inline-block w-auto float-sm-right" @input="filterClosed($event)" />
                </div>
              </div>

            </b-card-body>
            <!-- / Table controls -->

            <div class="table-responsive">

              <b-table
                :items="tasksClosed"
                :fields="fieldsClosed"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :striped="true"
                :bordered="true"
                :current-page="currentPageClosed"
                :per-page="perPage"
                class="card-table">

                <template v-slot:cell(titulo)="data">
                  <router-link v-bind:to="'detalle_tarea/' + data.item.id" class="message-subject flex-shrink-1 d-block text-secondary">
                    <strong>{{data.item.titulo}}</strong>
                  </router-link>
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
                    <span class="text-muted" v-if="totalItemsClosed">Página {{ currentPageClosed }} de {{ totalPagesClosed }}</span>
                  </div>
                  <div class="col-sm pt-3">
                    <b-pagination class="justify-content-center justify-content-sm-end m-0"
                      v-if="totalItemsClosed"
                      v-model="currentPageClosed"
                      :total-rows="totalItemsClosed"
                      :per-page="perPage"
                      size="sm" />
                  </div>
                </div>

              </b-card-body>
            </div>
          </div>
        </b-card>
        <!-- / Messages list -->

      </div><!-- / .row -->
    </div>

  </div>
</template>

<!-- Page -->
<style src="@/vendor/styles/pages/messages.scss" lang="scss"></style>

<script>
import axios from 'axios'
import validaciones from '../helpers/validations'

export default {
  name: 'pages-messages-v3-list',
  intervalo: null,
  metaInfo: {
    title: 'Tareas'
  },
  beforeCreate: function () {
    if (!this.$session) {
      this.$router.push('/login')
    }
  },
  created () {
    this.tokenApp = validaciones.verifyAuth(this)
    this.cargarTareas()
    this.establecerActualizacion()
  },
  data: () => ({
    tokenApp: '',
    searchKeys: ['id', 'nombre', 'titulo', 'estado'],
    sortBy: 'fecha_tarea',
    sortDesc: true,
    perPage: 50,

    fieldsMyAssigned: [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'nombre', label: 'Propietario', sortable: true },
      { key: 'titulo', sortable: true, thStyle: 'min-width: 18rem' },
      { key: 'prioridad', sortable: true },
      { key: 'fecha_tarea', label: 'Fecha Tarea', thClass: 'text-center', sortable: true, tdClass: 'text-center' },
      { key: 'fecha_vencimiento', label: 'Fecha Vencimiento', sortable: true, thClass: 'text-nowrap, text-center', tdClass: 'text-center' },
      { key: 'Estado', sortable: true, tdClass: 'text-center', thClass: 'text-nowrap, text-center' }
    ],

    fieldsMyCreated: [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'titulo', sortable: true, thStyle: 'min-width: 18rem' },
      { key: 'prioridad', sortable: true },
      { key: 'fecha_tarea', label: 'Fecha Tarea', sortable: true, thClass: 'text-center', tdClass: 'text-center' },
      { key: 'fecha_vencimiento', label: 'Fecha Vencimiento', sortable: true, thClass: 'text-nowrap, text-center', tdClass: 'text-center' },
      { key: 'Estado', sortable: true, tdClass: 'text-center', thClass: 'text-nowrap, text-center' }
    ],

    fieldsToApprove: [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'titulo', sortable: true, thStyle: 'min-width: 18rem' },
      { key: 'prioridad', sortable: true },
      { key: 'fecha_tarea', label: 'Fecha Tarea', sortable: true, thClass: 'text-center', tdClass: 'text-center' },
      { key: 'fecha_vencimiento', label: 'Fecha Vencimiento', sortable: true, thClass: 'text-nowrap, text-center', tdClass: 'text-center' },
      { key: 'Estado', sortable: true, tdClass: 'text-center', thClass: 'text-nowrap, text-center' }
    ],

    fieldsClosed: [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'nombre', label: 'Propietario', sortable: true },
      { key: 'titulo', sortable: true, thStyle: 'min-width: 18rem' },
      { key: 'prioridad', sortable: true },
      { key: 'fecha_tarea', label: 'Fecha Tarea', thClass: 'text-center', sortable: true, tdClass: 'text-center' },
      { key: 'fecha_vencimiento', label: 'Fecha Vencimiento', sortable: true, thClass: 'text-nowrap, text-center', tdClass: 'text-center' },
      { key: 'Estado', sortable: true, tdClass: 'text-center', thClass: 'text-nowrap, text-center' }
    ],

    currentPageMyAssigned: 1,
    currentPageMyCreated: 1,
    currentPageToApprove: 1,
    currentPageClosed: 1,

    originalTasksMyAssigned: [],
    originalTasksMyCreated: [],
    originalTasksToApprove: [],
    originalTasksClosed: [],

    // Mail boxes
    currentTaskBox: 'myAssigned',
    tasksBoxes: {
      myAssigned: { title: 'Tareas Asignadas a mi', icon: 'ion ion-md-filing', count: 0, isActive: true },
      myCreated: { title: 'Tareas Creadas por mi', icon: 'ion ion-ios-filing', count: 0, isActive: false },
      toApprove: { title: 'Tareas por aprobar', icon: 'ion ion-ios-list-box', count: 0, isActive: false },
      closed: { title: 'Tareas cerradas', icon: 'ion ion-ios-folder', count: 0, isActive: false }
    },

    // Messages
    tasksMyAssigned: [],
    tasksMyCreated: [],
    tasksToApprove: [],
    tasksClosed: []
  }),
  computed: {
    totalItemsMyAssigned () {
      return this.tasksMyAssigned.length
    },
    totalItemsMyCreated () {
      return this.tasksMyCreated.length
    },
    totalItemsToApprove () {
      return this.tasksToApprove.length
    },
    totalItemsClosed () {
      return this.tasksClosed.length
    },
    totalPagesMyAssigned () {
      return Math.ceil(this.totalItemsMyAssigned / this.perPage)
    },
    totalPagesMyCreated () {
      return Math.ceil(this.totalItemsMyCreated / this.perPage)
    },
    totalPagesToApprove () {
      return Math.ceil(this.totalItemsToApprove / this.perPage)
    },
    totalPagesClosed () {
      return Math.ceil(this.totalItemsClosed / this.perPage)
    }
  },
  methods: {

    changePage (page) {
      if (page === 'myCreated') {
        this.tasksBoxes.myAssigned.isActive = false
        this.tasksBoxes.toApprove.isActive = false
        this.tasksBoxes.closed.isActive = false
        this.tasksBoxes.myCreated.isActive = true
      } else if (page === 'myAssigned') {
        this.tasksBoxes.myAssigned.isActive = true
        this.tasksBoxes.myCreated.isActive = false
        this.tasksBoxes.toApprove.isActive = false
        this.tasksBoxes.closed.isActive = false
      } else if (page === 'toApprove') {
        this.tasksBoxes.myAssigned.isActive = false
        this.tasksBoxes.myCreated.isActive = false
        this.tasksBoxes.closed.isActive = false
        this.tasksBoxes.toApprove.isActive = true
      } else if (page === 'closed') {
        this.tasksBoxes.myAssigned.isActive = false
        this.tasksBoxes.myCreated.isActive = false
        this.tasksBoxes.toApprove.isActive = false
        this.tasksBoxes.closed.isActive = true
      }
      this.currentTaskBox = page
    },

    cargarTareas () {
      // MyAssigned tasks
      axios.get(`${this.apiUrl}tareas/misAsignadas`, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': this.tokenApp
        }
      }).then(response => {
        const d = response.data
        this.tasksMyAssigned = []
        this.originalTasksMyAssigned = []
        for (var x in d) {
          this.tasksMyAssigned.push(d[x])
          this.originalTasksMyAssigned.push(d[x])
        }
        this.tasksBoxes.myAssigned.count = this.tasksMyAssigned.length
      }).catch(e => {
        console.log(e)
      })

      // MyCreated tasks
      axios.get(`${this.apiUrl}tareas/misCreadas`, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': this.tokenApp
        }
      }).then(response => {
        const d = response.data
        this.tasksMyCreated = []
        this.originalTasksMyCreated = []
        for (var x in d) {
          this.tasksMyCreated.push(d[x])
          this.originalTasksMyCreated.push(d[x])
        }
        this.tasksBoxes.myCreated.count = this.tasksMyCreated.length
      }).catch(e => {
        console.log(e)
      })

      // ToApprove tasks
      axios.get(`${this.apiUrl}tareas/porAprobar`, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': this.tokenApp
        }
      }).then(response => {
        const d = response.data
        this.tasksToApprove = []
        this.originalTasksToApprove = []
        for (var x in d) {
          this.tasksToApprove.push(d[x])
          this.originalTasksToApprove.push(d[x])
        }
        this.tasksBoxes.toApprove.count = this.tasksToApprove.length
      }).catch(e => {
        console.log(e)
      })

      // Closed tasks
      axios.get(`${this.apiUrl}tareas/cerradas`, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': this.tokenApp
        }
      }).then(response => {
        const d = response.data
        this.tasksClosed = []
        this.originalTasksClosed = []
        for (var x in d) {
          this.tasksClosed.push(d[x])
          this.originalTasksClosed.push(d[x])
        }
        this.tasksBoxes.closed.count = this.tasksClosed.length
      }).catch(e => {
        console.log(e)
      })
    },

    filterMyAssigned (value) {
      const val = value.toLowerCase()
      const filtered = this.originalTasksMyAssigned.filter(d => (
        Object.keys(d)
          .filter(k => this.searchKeys.includes(k))
          .map(k => String(d[k]))
          .join('|')
          .toLowerCase()
          .indexOf(val) !== -1 || !val
      ))
      this.tasksMyAssigned = filtered
    },

    filterMyCreated (value) {
      const val = value.toLowerCase()
      const filtered = this.originalTasksMyCreated.filter(d => {
        return Object.keys(d)
          .filter(k => this.searchKeys.includes(k))
          .map(k => String(d[k]))
          .join('|')
          .toLowerCase()
          .indexOf(val) !== -1 || !val
      })
      this.tasksMyCreated = filtered
    },

    filterToApprove (value) {
      const val = value.toLowerCase()
      const filtered = this.originalTasksToApprove.filter(d => {
        return Object.keys(d)
          .filter(k => this.searchKeys.includes(k))
          .map(k => String(d[k]))
          .join('|')
          .toLowerCase()
          .indexOf(val) !== -1 || !val
      })
      this.tasksToApprove = filtered
    },

    filterClosed (value) {
      const val = value.toLowerCase()
      const filtered = this.originalTasksClosed.filter(d => {
        return Object.keys(d)
          .filter(k => this.searchKeys.includes(k))
          .map(k => String(d[k]))
          .join('|')
          .toLowerCase()
          .indexOf(val) !== -1 || !val
      })
      this.tasksClosed = filtered
    },

    establecerActualizacion () {
      var parent = this
      this.intervalo = setInterval(function () {
        parent.cargarTareas()
      }, 5000)
    }
  },

  mounted () {
    this.layoutHelpers.setCollapsed(true, false)
  },

  beforeRouteLeave (to, from, next) {
    clearInterval(this.intervalo)
    next()
  }
}
</script>
