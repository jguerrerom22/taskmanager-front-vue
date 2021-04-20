<template>
  <b-navbar toggleable="lg" :variant="getLayoutNavbarBg()" class="layout-navbar align-items-lg-center container-p-x">

    <!-- Brand -->
    <b-navbar-brand to="/"><img src="@/assets/logo.png" width="80px"></b-navbar-brand>

    <!-- Sidenav toggle -->
    <b-navbar-nav class="align-items-lg-center mr-auto mr-lg-4" v-if="sidenavToggle">
      <a class="nav-item nav-link px-0 ml-2 ml-lg-0" href="javascript:void(0)" @click="toggleSidenav">
        <i class="ion ion-md-menu text-large align-middle" />
      </a>
    </b-navbar-nav>

    <!-- Navbar toggle -->
    <b-navbar-toggle target="app-layout-navbar"></b-navbar-toggle>

    <b-collapse is-nav id="app-layout-navbar">
      <b-navbar-nav class="align-items-lg-center">
        <b-nav-item to="/">Lista Tareas</b-nav-item>
        <b-nav-item to="/tarea">Crear Tarea</b-nav-item>
        <b-nav-item to="/monitor" v-if="esAdmin">Seguimiento de Tareas</b-nav-item>
        <b-nav-item to="/usuarios" v-if="esAdmin">Usuarios</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
    <b-navbar-nav class="align-items-lg-center ml-auto">
      <b-nav-item-dropdown :right="!isRTL" class="demo-navbar-user">
        <template slot="button-content">
          <span class="d-inline-flex flex-lg-row-reverse align-items-center align-middle">
            <!-- <img :src="`${publicUrl}img/avatars/1.png`" alt class="d-block ui-w-30 rounded-circle"> -->
            <span class="px-1 mr-lg-2 ml-2 ml-lg-0">{{ nombre }}</span>
          </span>
        </template>

        <!-- <b-dd-item><i class="ion ion-ios-person text-lightest"></i> &nbsp; Perfil</b-dd-item> -->
        <!-- <b-dd-item><i class="ion ion-ios-mail text-lightest"></i> &nbsp; Messages</b-dd-item> -->
        <!-- <b-dd-item><i class="ion ion-md-settings text-lightest"></i> &nbsp; Account settings</b-dd-item> -->
        <!-- <b-dd-divider /> -->
        <b-dd-item><a href="javascript:void(0)" @click="logout"><i class="ion ion-ios-log-out text-danger"></i> &nbsp; Cerrar Sesión</a></b-dd-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  name: 'app-layout-navbar',

  props: {
    sidenavToggle: {
      type: Boolean,
      default: true
    }
  },

  data: () => ({
    nombre: '',
    esAdmin: false
  }),

  created () {
    this.$session.start()
    this.nombre = this.$session.get('nombre')
    this.esAdmin = this.$session.get('esAdmin')
  },

  methods: {
    logout: function () {
      this.$session.destroy()
      this.$router.push('/login')
    },

    toggleSidenav () {
      this.layoutHelpers.toggleCollapsed()
    },

    getLayoutNavbarBg () {
      return this.layoutNavbarBg
    }
  }
}
</script>
