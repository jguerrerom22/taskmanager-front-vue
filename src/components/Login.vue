<template>
  <div class="authentication-wrapper authentication-1 px-4">
    <div class="authentication-inner py-5">

      <!-- Logo -->
      <div class="d-flex justify-content-center align-items-center">
        <div class="ui-w-60-p">
          <div class="w-100 position-relative" >
            <img src="@/assets/logo.png">
          </div>
        </div>
      </div>
      <!-- / Logo -->

      <!-- Form -->
      <form class="my-5">
        <b-form-group label="Usuario">
          <b-input v-model="credentials.user" />
        </b-form-group>
        <b-form-group>
          <div slot="label" class="d-flex justify-content-between align-items-end">
            <div>Contraseña</div>
            <!--<a href="javascript:void(0)" class="d-block small">Forgot password?</a>-->
          </div>
          <b-input type="password" v-model="credentials.password" />
        </b-form-group>

        <div v-if="error"><label class="text-danger">{{error}}</label></div>
        <div v-if="no_datos"><label class="text-danger">Ingrese sus credenciales</label></div>
        <div class="d-flex justify-content-between align-items-center m-0">
          <!-- <b-check v-model="credentials.rememberMe" class="m-0">Remember me</b-check> -->
          <b-btn variant="primary" v-on:click="login()">Iniciar Sesión</b-btn>
        </div>
      </form>
      <!-- / Form -->

      <!-- <div class="text-center text-muted">
        Don't have an account yet? <a href="javascript:void(0)">Sign Up</a>
      </div> -->

    </div>
  </div>
</template>

<!-- Page -->
<style src="@/vendor/styles/pages/authentication.scss" lang="scss"></style>

<script>
import axios from 'axios'
export default {
  name: 'pages-authentication-login-v1',
  metaInfo: {
    title: 'Login'
  },
  data: () => ({
    credentials: {
      user: '',
      password: ''
    },
    error: false,
    no_datos: false
  }),
  methods: {
    login () {
      this.error = false
      this.no_datos = false
      if (this.credentials.user !== '' && this.credentials.password !== '') {
        axios({
          method: 'POST',
          url: `${this.apiUrl}auth`,
          data: {
            usuario: this.credentials.user,
            contrasena: this.credentials.password
          },
          validateStatus: () => true
        }).then(response => {
          if (response.status === 404 || response.status === 400) {
            this.error = 'Ha ocurrido un error en la petición'
          } else {
            var res = response.data
            if (res.error) {
              this.error = res.message
              return
            }
            this.error = ''
            this.$session.start()
            this.$session.set('jwt', res.token)
            this.$session.set('nombre', res.nombre)
            this.$session.set('apellido', res.apellido)
            this.$session.set('esAdmin', res.esAdmin)
            this.$router.replace({ name: 'home' })
          }
        })
      } else {
        this.no_datos = true
      }
    }
  }
}
</script>
