<template>
  <div>
    <div class="row">

      <!-- Messages sidebox -->
      <div class="messages-sidebox col-md-4 mb-4">

        <b-btn variant="primary mt-md-4" :block="true" v-on:click="volver()"><i class="ion ion-md-arrow-round-back mr-md-2"></i> Volver</b-btn>
        <hr class="border-light my-4">

        <h6 class="font-weight-bold">({{totalAsignados}}) Asignar a:</h6>

        <b-input size="sm" placeholder="Buscar..." class="d-inline-block" @input="filterUsuarios($event)" /><br>
        <!-- Usuarios -->
        <a v-for="(box, boxId) in usuarios" v-on:click="seleccionarUsuario(boxId)" :key="box.title" href="javascript:void(0)" class="d-flex align-items-center py-2 text-muted">
          <span class="circle">{{box.sigla}}</span>
          <span :class="{'font-weight-bold text-body': box.seleccionado === true}">{{box.nombre}} {{box.apellido}} <span v-if="box.seleccionado === true" class="ion ion-md-checkmark-circle" style="color: #84B949; font-weight: bold; height: 10px"></span></span>
        </a>
        <!-- / Usuarios -->

        <hr class="border-light my-4">

      </div>
      <!-- / Messages sidebox -->

      <div class="col-md-6">
        <b-card header="Nueva Tarea" header-tag="h4" header-class="py-4">

          <b-form-group label="Título:">
            <b-input v-model="tareaData.titulo" />
          </b-form-group>

          <b-form-group >
            <Label><input type="checkbox" v-model="tareaData.esRecurrencia" /> Repetir tarea</Label>
          </b-form-group>

          <b-form-group label="Prioridad:">
            <b-select v-model="tareaData.prioridad" placeholder="Seleccione prioridad">
              <option v-for="option in prioridades" :value="option.id" :key="option.id"> {{ option.nombre }} </option>
            </b-select>
          </b-form-group>

          <b-form-group class="mt-4" label="Descripción:">
            <!-- Fallback -->
            <b-textarea v-model="tareaData.descripcion" style="height: 140px" />
          </b-form-group>

          <!-- Footer -->
          <div class="text-right mt-4">
            <b-btn variant="primary ml-2" v-on:click="guardarTarea()"><i class="ion ion-md-save"></i>&nbsp; Guardar</b-btn>
            <b-btn variant="default ml-2" v-on:click="volver()">Cancelar</b-btn>
          </div>
          <!-- / Footer -->

        </b-card>
      </div>

      <div class="col-md-3">
        <b-card header="Recurrencia" header-tag="h5" header-class="pt-4 pb-0">
          <b-form-group label="Fecha de vencimiento:">
            <datepicker v-model="tareaData.vencimiento" :bootstrapStyling="true" />
          </b-form-group>

          <div v-if="tareaData.esRecurrencia">
            <b-form-group label="Recurrencia:">
              <b-select v-model="tareaData.recurrencia" placeholder="Seleccione recurrencia" @change="cambiarDias()">
                <option v-for="option in recurrencias" :value="option" :key="option"> {{ option }} </option>
              </b-select>
            </b-form-group>

            <b-form-group label="Día de la tarea:" v-if="visibleDiasDiario">
              <b-select v-model="tareaData.diasDiario" placeholder="Seleccione días">
                <option v-for="option in diasDiario" :value="option" :key="option"> {{ option }} </option>
              </b-select>
            </b-form-group>

            <b-form-group label="Día de la tarea:" v-if="visibleDiasSemana">
              <b-select v-model="tareaData.diasSemana" placeholder="Seleccione días">
                <option v-for="option in diasSemana" :value="option" :key="option"> {{ option }} </option>
              </b-select>
            </b-form-group>

            <b-form-group label="Primera Quincena:" v-if="visibleDiasQuincenal">
              <b-select v-model="tareaData.diasQuincena1" placeholder="Seleccione días">
                <option v-for="option in diasQuincena1" :value="option" :key="option"> {{ option }} </option>
              </b-select>
            </b-form-group>

            <b-form-group label="Segunda Quincena:" v-if="visibleDiasQuincenal">
              <b-select v-model="tareaData.diasQuincena2" placeholder="Seleccione días">
                <option v-for="option in diasQuincena2" :value="option" :key="option"> {{ option }} </option>
              </b-select>
            </b-form-group>

            <b-form-group label="Día de la tarea:" v-if="visibleDiasMensual">
              <b-select v-model="tareaData.diasMes" placeholder="Seleccione días">
                <option v-for="option in diasMensual" :value="option" :key="option"> {{ option }} </option>
              </b-select>
            </b-form-group>

            <b-form-group label="Días de vencimiento:">
              <b-select v-model="tareaData.diasVencimiento" placeholder="Seleccione días">
                <option v-for="option in diasVencimiento" :value="option" :key="option"> {{ option }} </option>
              </b-select>
            </b-form-group>
          </div>

        </b-card>

      </div>
    </div><!-- / .row -->
  </div>
</template>

<style src="@/vendor/libs/vue-quill-editor/typography.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-quill-editor/editor.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<!-- Page -->
<style src="@/vendor/styles/pages/messages.scss" lang="scss"></style>

<style lang="scss">
  .ql-container.ql-snow {
    height: 400px;
  }
</style>

<script>
import Datepicker from 'vuejs-datepicker'
import axios from 'axios'
import validaciones from '../helpers/validations'

export default {
  name: 'pages-messages-v3-compose',
  metaInfo: {
    title: 'Nueva Tarea'
  },
  components: {
    Datepicker
    // quillEditor: () => import('vue-quill-editor/dist/vue-quill-editor').then(m => m.quillEditor).catch(() => {})
  },
  data: () => ({
    tokenApp: '',
    // Tarea
    tareaData: {
      titulo: '',
      prioridad: 2,
      vencimiento: '',
      descripcion: '',
      asignados: [],
      esRecurrencia: false,
      recurrencia: '',
      diasDiario: 0,
      diasSemana: 0,
      diasQuincena1: 0,
      diasQuincena2: 0,
      diasMes: 0,
      diasVencimiento: 0
    },
    usuarios: [],
    usuariosOriginal: [],
    totalAsignados: 0,
    prioridades: [],

    visibleDiasDiario: false,
    visibleDiasSemana: false,
    visibleDiasQuincenal: false,
    visibleDiasMensual: false,

    recurrencias: ['Diaria', 'Semanal', 'Quincenal', 'Mensual'],

    diasDiario: [1, 2, 3, 4, 5, 6, 7, 8],
    diasSemana: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    diasQuincena1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    diasQuincena2: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
    diasMensual: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
    diasVencimiento: [],

    // Editor
    editorOptions: {
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }, { 'font': [] }, { 'size': [] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
          [{ 'align': [] }]
        ]
      }
    }
  }),
  created () {
    this.tokenApp = validaciones.verifyAuth(this)
    this.cargarUsuarios()
    this.cargarPrioridades()
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

    cargarUsuarios () {
      axios.get(`${this.apiUrl}users/active`, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': this.tokenApp
        }
      }).then(response => {
        const d = response.data
        for (var i in d) {
          let info = { usuario: d[i].usuario, nombre: d[i].nombre + ' ' + d[i].apellido, sigla: d[i].sigla, seleccionado: false }
          this.usuarios.push(info)
          this.usuariosOriginal.push(info)
        }
      }).catch(e => {
        console.log(e)
      })
    },

    cargarPrioridades () {
      // MyAssigned tasks
      axios.get(`${this.apiUrl}prioridad`, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': this.tokenApp
        }
      }).then(response => {
        if (response.data.length > 0) {
          this.prioridades = response.data
        }
      }).catch(e => {
        console.log(e)
      })
    },

    cambiarDias () {
      this.visibleDiasDiario = false
      this.visibleDiasSemana = false
      this.visibleDiasQuincenal = false
      this.visibleDiasMensual = false
      this.diasVencimiento = []

      switch (this.tareaData.recurrencia) {
        case 'Diaria':
          for (let i = 1; i <= 31; i++) this.diasVencimiento.push(i)
          this.visibleDiasDiario = true
          break
        case 'Semanal':
          for (let i = 1; i <= 7; i++) this.diasVencimiento.push(i)
          this.visibleDiasSemana = true
          break
        case 'Quincenal':
          for (let i = 1; i <= 15; i++) this.diasVencimiento.push(i)
          this.visibleDiasQuincenal = true
          break
        case 'Mensual':
          for (let i = 1; i < 31; i++) this.diasVencimiento.push(i)
          this.visibleDiasMensual = true
          break

        default:
          break
      }
    },

    seleccionarUsuario (index) {
      this.usuarios[index].seleccionado = !this.usuarios[index].seleccionado
      if (this.usuarios[index].seleccionado) {
        this.totalAsignados++
      } else {
        this.totalAsignados--
      }
    },

    guardarTarea () {
      this.tareaData.asignados = this.usuarios.filter(x => x.seleccionado === true).map(function (task, index, array) {
        return task.usuario
      })

      if (this.tareaData.asignados.length === 0) {
        this.showBs4Toast('Error', 'Seleccione al menos un responsable de la tarea', 'warning')
        return
      }
      if (this.tareaData.titulo === '') {
        this.showBs4Toast('Error', 'Ingrese el título de la tarea', 'warning')
        return
      }
      if (this.tareaData.descripcion === '') {
        this.showBs4Toast('Error', 'Ingrese la descripción de la tarea', 'warning')
        return
      }
      if (this.tareaData.vencimiento === '') {
        this.showBs4Toast('Error', 'Ingrese la fecha de vencimiento de la tarea', 'warning')
        return
      }
      if (this.tareaData.esRecurrencia) {
        if (this.tareaData.recurrencia === '') {
          this.showBs4Toast('Error', 'Debe seleccionar un tipo de recurrencia', 'warning')
          return
        }
        if (this.tareaData.recurrencia === 'Diaria') {
          if (this.tareaData.diasDiario === 0) {
            this.showBs4Toast('Error', 'Seleccione día de recurrencia', 'warning')
            return
          }
        }
        if (this.tareaData.recurrencia === 'Semanal') {
          if (this.tareaData.diasSemana === 0) {
            this.showBs4Toast('Error', 'Seleccione día de recurrencia', 'warning')
            return
          }
        }
        if (this.tareaData.recurrencia === 'Quincenal') {
          if (this.tareaData.diasQuincena1 === 0) {
            this.showBs4Toast('Error', 'Seleccione día de la quincena 1', 'warning')
            return
          }
          if (this.tareaData.diasQuincena2 === 0) {
            this.showBs4Toast('Error', 'Seleccione día de la quincena 2', 'warning')
            return
          }
        }
        if (this.tareaData.recurrencia === 'Mensual') {
          if (this.tareaData.diasMes === 0) {
            this.showBs4Toast('Error', 'Seleccione día de recurrencia', 'warning')
            return
          }
        }
        if (this.tareaData.diasVencimiento === 0) {
          this.showBs4Toast('Error', 'Seleccione días de vencimiento', 'warning')
          return
        }
      }

      this.tareaData.vencimiento = this.tareaData.vencimiento.getFullYear() + '-' + (this.tareaData.vencimiento.getMonth() + 1) + '-' + this.tareaData.vencimiento.getDate()
      axios({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': this.tokenApp
        },
        url: `${this.apiUrl}tareas`,
        data: this.tareaData,
        validateStatus: () => true
      }).then(response => {
        if (response.status === 404 || response.status === 400) {
          this.error = true
        } else {
          this.$router.replace({ name: 'home' })
        }
      })
    },

    filterUsuarios (value) {
      const val = value.toLowerCase()
      const filtered = this.usuariosOriginal.filter(d => {
        return Object.keys(d)
          .filter(k => ['nombre', 'apellido'].includes(k))
          .map(k => String(d[k]))
          .join('|')
          .toLowerCase()
          .indexOf(val) !== -1 || !val
      })
      this.usuarios = filtered
    },

    volver () {
      this.$router.replace({ name: 'home' })
    }
  },
  mounted () {
    this.layoutHelpers.setCollapsed(true, false)
  }
}
</script>
