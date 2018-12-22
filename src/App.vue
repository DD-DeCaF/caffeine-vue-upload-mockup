<template>
  <v-app id="app">
    <v-toolbar dark color="primary" app>
      <v-toolbar-side-icon @click.stop="navDrawer = !navDrawer"></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Caffeine</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-navigation-drawer temporary v-model="navDrawer" app>
      <v-list>
        <v-list-tile :to="'/'">
          <v-list-tile-action><v-icon>home</v-icon></v-list-tile-action>
          <v-list-tile-title>Home</v-list-tile-title>
        </v-list-tile>

        <v-list-tile :to="'/design'">
          <v-list-tile-action><v-icon>edit</v-icon></v-list-tile-action>
          <v-list-tile-title>Design</v-list-tile-title>
        </v-list-tile>

        <v-list-tile :to="'/interactiveMap'">
          <!-- TODO: use custom icon -->
          <v-list-tile-action><v-icon>timeline</v-icon></v-list-tile-action>
          <v-list-tile-title>Interactive Map</v-list-tile-title>
        </v-list-tile>

        <v-list-tile :to="'/jobs'">
          <v-list-tile-action><v-icon>hourglass_empty</v-icon></v-list-tile-action>
          <v-list-tile-title>Jobs</v-list-tile-title>
        </v-list-tile>

        <v-list-tile :to="'/maps'">
          <v-list-tile-action><v-icon>map</v-icon></v-list-tile-action>
          <v-list-tile-title>Maps</v-list-tile-title>
        </v-list-tile>

        <v-list-tile :to="'/models'">
          <v-list-tile-action><v-icon>rounded_corner</v-icon></v-list-tile-action>
          <v-list-tile-title>Models</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-content app>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    navDrawer: false,
  }),
};
</script>
