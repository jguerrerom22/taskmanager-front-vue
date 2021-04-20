<template>
  <!-- `.chat-wrapper` fills all available space of container -->
  <div class="chat-wrapper container-p-x container-p-y">

    <!-- Make card full height of `.chat-wrapper` -->
    <b-card no-body class="flex-grow-1 position-relative overflow-hidden">

      <!-- Make row full height of `.card` -->
      <div class="row no-gutters" style="max-height: calc(100vh - 157px);">
        <div class="chat-sidebox col">

          <!-- Wrap `.chat-scroll` to properly position scroll area. Remove this wtapper if you don't need scroll -->
          <div class="flex-grow-1 position-relative">
            <perfect-scrollbar :options="{ suppressScrollX: true, wheelPropagation: true }" class="chat-contacts list-group chat-scroll py-3">
              <div class="flex-grow-0 py-3 px-4">
                <h3>{{infoTarea.titulo}}</h3>
                <label>Propietario: <b>{{infoTarea.nombre}} {{infoTarea.apellido}}</b></label><br>
                <label>Prioridad: <b>{{infoTarea.prioridad}}</b></label><br>
                <label>Fecha de tarea: <b>{{infoTarea.fecha_tarea|formatDate}}</b></label><br>
                <label>Vencimiento: <b>{{infoTarea.fecha_vencimiento|formatDate}}</b></label><br>
                <label>Estado actual: <b>{{infoTarea.estado}}</b></label><br>
                <label class="form-row">
                  <div class="col-md-3 pt-2">Cambiar estado:</div>
                  <div class="col-md-4">
                    <b-select v-model="estadoSel">
                      <option v-for="option in estados" :value="option.id" :key="option.id"> {{ option.nombre }} </option>
                    </b-select>
                  </div>
                  <div class="col-md-2" v-if="infoTarea.id_estado!==2">
                    <a href="javascript: void(0)" v-on:click="guardarEstado()" ><i class="ion ion-ios-save pt-2" style="font-size: 20px;"></i></a>
                  </div>
                </label>
                <div class="tarea-descripcion" style="max-height: 210px; overflow-y: auto; background-color: #CCC;">
                  <pre v-html="infoTarea.detalle" style="white-space: pre-wrap; white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word;"></pre>
                </div>

              </div>

            </perfect-scrollbar>
          </div>

        </div>

        <div class="d-flex col flex-column">

          <!-- Chat header -->
          <div class="flex-grow-0 py-3 pr-4">

            <div class="media align-items-center">
              <div class="media-body">
                <h4 class="mb-0">Seguimiento</h4>
              </div>
            </div>

          </div>
          <hr class="flex-grow-0 border-light m-0">
          <!-- / Chat header -->

          <div class="flex-grow-1 position-relative" style="max-height: calc(100vh - 285px); overflow-y: auto" id="seguimientoContainer">

            <div class="chat-messages p-2">
              <perfect-scrollbar :options="{ suppressScrollX: true, wheelPropagation: true }" class="chat-contacts list-group chat-scroll py-3">
                <div v-if="!infoTarea.comentarios">
                  No se han registrado comentarios
                </div>
                <div >
                  <div v-for="message in infoTarea.comentarios" :key="message.id" class="mb-4">
                    <div>
                      <div class="text-muted small text-nowrap mt-2">{{message.fecha_comentario|longFormatDate}}</div>
                    </div>
                    <div class="flex-shrink-1 bg-lighter rounded py-2 px-3" >
                      <div class="font-weight-semibold mb-1">{{message.nombre}} {{message.apellido}}</div>
                      {{message.comentario}}
                    </div>
                  </div>
                </div>
              </perfect-scrollbar>

            </div><!-- / .chat-messages -->
          </div>

          <!-- Chat footer -->
          <hr class="border-light m-0">
          <div class="flex-grow-0 py-3 px-4">
            <b-input-group>
              <b-input v-model="comentario" placeholder="Escriba un comentario" />
              <b-btn variant="primary" slot="append" v-on:click="enviarComentario">Enviar</b-btn>
            </b-input-group>
          </div>
          <!-- / Chat footer -->

        </div>
      </div><!-- / .row -->

    </b-card><!-- / .card -->

  </div><!-- / .chat-wrapper -->
</template>
<script>
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
import axios from 'axios'
import validaciones from '../helpers/validations'

export default {
  name: 'pages-messages-v3-detail',
  metaInfo: {
    title: 'Detalle de Tarea'
  },
  components: {
    PerfectScrollbar
  },
  data: () => ({
    estadoSel: 0,
    estados: [],
    tokenApp: '',
    tarea: 0,
    infoTarea: {},
    comentario: ''
  }),
  created () {
    this.tokenApp = validaciones.verifyAuth(this)
    this.tarea = this.$route.params.task
    this.cargarInfoTarea()
    this.cargarEstados()
  },
  methods: {

    showBs4Toast (title, text, variant) {
      this.$bvToast.toast(text, {
        title: title,
        autoHideDelay: 4000,
        appendToast: true,
        toastClass: variant ? `bs4-toast bg-${variant}` : 'bs4-toast'
      })
    },

    cargarInfoTarea () {
      var idTarea = this.tarea
      // MyAssigned tasks
      axios.get(`${this.apiUrl}tareas/` + idTarea, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': this.tokenApp
        },
        validateStatus: () => true
      }).then(response => {
        if (response.status === 404 || response.status === 400) {
          this.error = true
        } else {
          var res = response.data
          this.error = false
          this.infoTarea = res
          this.estadoSel = res.id_estado
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
          this.error = true
        } else {
          this.estados = response.data
          this.error = false
        }
      }).catch(e => {
        console.log(e)
      })
    },

    guardarEstado () {
      axios({
        method: 'POST',
        url: `${this.apiUrl}tareas/status`,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': this.tokenApp
        },
        data: {
          idtarea: this.tarea,
          estado: this.estadoSel
        },
        validateStatus: () => true
      }).then(response => {
        if (response.status === 404 || response.status === 400) {
          this.error = true
        } else {
          let r = response.data
          if (r.error) {
            this.showBs4Toast('Error', r.message, 'danger')
          } else {
            if (this.estadoSel === 2) {
              this.showBs4Toast('Cerrada', 'La tarea ha sido cerrada', 'success')
              this.$router.replace({ name: 'home' })
            } else {
              this.showBs4Toast('Exitoso', 'Se ha modificado el estado', 'success')
            }
          }
        }
      }).catch(e => {
        console.log(e)
      })
    },

    enviarComentario () {
      if (this.comentario !== '') {
        axios({
          method: 'POST',
          url: `${this.apiUrl}tareas/${this.tarea}/comentario`,
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': this.tokenApp
          },
          data: {
            comentario: this.comentario
          },
          validateStatus: () => true
        }).then(response => {
          if (response.status === 404 || response.status === 400) {
            this.error = true
          } else {
            this.infoTarea.comentarios.push(response.data.comentario)
            this.comentario = ''
            var container = this.$el.querySelector('#seguimientoContainer')
            container.scrollTop = container.scrollHeight
          }
        }).catch(e => {
          console.log(e)
        })
      }
    }
  },

  mounted () {
    this.layoutHelpers.setCollapsed(true, false)
  }
}
</script>
