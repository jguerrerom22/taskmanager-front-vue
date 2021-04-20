<template>
  <div>

    <div class="row">

      <div class="col">

        <!-- Messages list -->
        <b-card no-body>

          <!-- Header -->
          <b-card-header header-tag="h4" class="media flex-wrap align-items-center py-4">
            <div class="media-body"><i class="ion ion-md-person"></i> &nbsp; Usuarios</div>
          </b-card-header>
          <!-- / Header -->

          <!-- / Controls -->

          <!-- My Assigned tasks -->
          <div>
            <b-btn class="ml-2 mt-2" variant="primary rounded-pill" v-on:click="formActivo=true; infoUser={}; creando=true">Crear Usuario</b-btn>
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
                :items="users"
                :fields="fields"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :striped="true"
                :bordered="true"
                :current-page="currentPage"
                :per-page="perPage"
                class="card-table">

                <template v-slot:cell(usuario)="data">
                  <a href="javascript: void(0)" v-on:click="cargarUsuario(data.item)"><strong>{{data.item.usuario}}</strong></a>
                </template>

                <template v-slot:cell(activo)="data">
                  <b-badge v-if="data.item.activo" variant="outline-success">Activo</b-badge>
                  <b-badge v-if="!data.item.activo" variant="outline-danger">Inactivo</b-badge>
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
        </b-card>

      </div>
      <div class="col-md-4" v-if="formActivo">
        <b-card header="Creación/Edición de Usuario" header-tag="h5" header-class="pt-4 pb-0">
            <div class="row">
                <div class="col-md-6">
                    <b-form-group label="Usuario:">
                        <b-input v-model="infoUser.usuario" />
                    </b-form-group>
                </div>
                <div class="col-md-6">
                    <b-form-group label="Rol:">
                        <b-select placeholder="Seleccione rol" v-model="infoUser.rol">
                          <option value="1">Administrador</option>
                          <option value="2">Usuario</option>
                        </b-select>
                      </b-form-group>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <b-form-group label="Nombres:">
                        <b-input v-model="infoUser.nombre"  />
                    </b-form-group>
                </div>
                <div class="col-md-6">
                    <b-form-group label="Apellido:">
                        <b-input v-model="infoUser.apellido"  />
                    </b-form-group>
                </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                  <b-form-group label="Email:">
                      <b-input v-model="infoUser.email"  />
                  </b-form-group>
              </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <b-form-group label="Contraseña:">
                        <b-form-input type="password" v-model="infoUser.contrasena" ></b-form-input>
                    </b-form-group>
                </div>
                <div class="col-md-6">
                    <b-form-group >
                        <Label><input type="checkbox" v-model="infoUser.activo" /> Activo</Label>
                    </b-form-group>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 justify-content-center">
                    <b-btn variant="default" v-on:click="formActivo = false">Cancelar</b-btn>
                    <b-btn variant="primary" v-on:click="guardarUsuario()"><i class="ion ion-md-save"></i>&nbsp; Guardar</b-btn>
                </div>
            </div>
        </b-card>
      </div>
    </div>

  </div>
</template>

<!-- Page -->
<style src="@/vendor/styles/pages/messages.scss" lang="scss"></style>

<script>
import axios from 'axios'
import validaciones from '../helpers/validations'

export default {
  name: 'pages-users-v3-list',
  metaInfo: {
    title: 'Usuarios'
  },
  beforeCreate: function () {
    if (!this.$session) {
      this.$router.push('/login')
    }
  },
  created () {
    this.tokenApp = validaciones.verifyAuth(this)
    this.cargarUsuarios()
  },
  data: () => ({
    creando: false,
    formActivo: false,
    tokenApp: '',
    searchKeys: ['usuario', 'nombre', 'apellido', 'rol_nombre', 'email'],
    sortBy: 'nombre',
    sortDesc: true,
    perPage: 50,
    infoUser: {
      usuario: '',
      nombre: '',
      apellido: '',
      email: '',
      rol: '',
      contrasena: '',
      activo: false
    },
    fields: [
      { key: 'usuario', sortable: true },
      { key: 'nombre', sortable: true },
      { key: 'apellido', sortable: true, thStyle: 'min-width: 18rem' },
      { key: 'rol_nombre', label: 'Rol', sortable: true },
      { key: 'activo', sortable: true }
    ],

    currentPage: 1,
    originalUsers: [],
    users: []
  }),
  computed: {
    totalItems () {
      return this.users.length
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
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
      this.users = []
      this.originalUsers = []
      axios.get(`${this.apiUrl}users`, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': this.tokenApp
        }
      }).then(response => {
        const d = response.data
        for (var x in d) {
          this.users.push(d[x])
          this.originalUsers.push(d[x])
        }
      }).catch(e => {
        console.log(e)
      })
    },

    filter (value) {
      const val = value.toLowerCase()
      const filtered = this.originalUsers.filter(d => (
        Object.keys(d)
          .filter(k => this.searchKeys.includes(k))
          .map(k => String(d[k]))
          .join('|')
          .toLowerCase()
          .indexOf(val) !== -1 || !val
      ))
      this.users = filtered
    },

    cargarUsuario (item) {
      this.infoUser = {
        usuario: item.usuario,
        nombre: item.nombre,
        apellido: item.apellido,
        email: item.email,
        rol: '' + item.rol,
        activo: (item.activo === 1)
      }
      this.formActivo = true
      this.creando = false
    },

    guardarUsuario () {
      if (this.infoUser.usuario === '') {
        this.showBs4Toast('Error', 'Ingrese el usuario', 'warning')
        return
      }
      if (this.infoUser.nombres === '') {
        this.showBs4Toast('Error', 'Ingrese el nombre del usuario', 'warning')
        return
      }
      if (this.infoUser.apellidos === '') {
        this.showBs4Toast('Error', 'Ingrese el apellido del usuario', 'warning')
        return
      }
      if (this.infoUser.email === '') {
        this.showBs4Toast('Error', 'Ingrese el email del usuario', 'warning')
        return
      }
      if (!this.infoUser.rol) {
        this.showBs4Toast('Error', 'Seleccione el rol del usuario', 'warning')
        return
      }
      if (!this.infoUser.activo) {
        this.infoUser.activo = false
      }
      console.log(this.creando, !this.infoUser.contrasena)
      if (this.creando && !this.infoUser.contrasena) {
        this.showBs4Toast('Error', 'Ingrese una contraseña para usuario', 'warning')
        return
      }
      const method = this.creando ? 'POST' : 'PUT'
      axios({
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': this.tokenApp
        },
        url: `${this.apiUrl}users`,
        data: this.infoUser,
        validateStatus: () => true
      }).then(response => {
        if (response.status === 404 || response.status === 400) {
          this.showBs4Toast('Error', 'No se ha podido crear el usuario.', 'danger')
        } else {
          this.showBs4Toast('Error', 'Usuario guardado con éxito.', 'success')
          this.formActivo = false
          this.cargarUsuarios()
        }
      })
    }
  },

  mounted () {
    this.layoutHelpers.setCollapsed(true, false)
  }
}
</script>
