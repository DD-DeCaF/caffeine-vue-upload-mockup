<template>
  <v-container>
    <experiment-dialog></experiment-dialog>

    <v-layout align-center justify-center padding>
      <v-flex lg8>
        <v-card>
          <v-card-text>
            <h1>Experiments</h1>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style>
  .v-speed-dial,
  .v-btn--floating {
    position: absolute;
  }
  .v-btn--floating {
    margin: 0 0 16px 16px;
  }
</style>

<script>
  import ExperimentDialog from '@/components/ExperimentDialog.vue';

  export default {
    data: () => ({
      fab: false,
      hidden: false,
      tabs: null
    }),
    components: {
      'experiment-dialog': ExperimentDialog,
    },

    computed: {
    }
  }
</script>
