<template>
  <div>
    <v-dialog v-model="experimentDialog">
      <div slot="activator">
        <v-fab-transition>
          <v-btn
            key="add"
            color="blue"
            dark
            fab
            fixed
            bottom
            right>
            <v-icon large>add</v-icon>
          </v-btn>
        </v-fab-transition>
      </div>

      <v-card>
        <v-layout row id="app">
          <v-flex lg9 md9 sm12 xs12 id="table" align-center justify-center style="margin: 2%;">
            <div>
              <v-data-table
                :headers="headers"
                :items="items"
                class="elevation-1">
                <template v-slot:items="props">
                  <td v-for="header in headers" v-bind:style="[Math.random() % 2 < 0.5 ? {color: 'red', textDecoration: 'underline', cursor: 'pointer'} : {}]">{{ props.item[header.text] }}</td>
                </template>
              </v-data-table>
            </div>
          </v-flex>
          <v-divider vertical></v-divider>
          <v-flex lg2 md2 sm12 xs12 id="file-panel" align-center justify-center>
            <div>
              <h2>Uploaded files</h2>
              <div>
                <ul id="upload-list">
                  <div v-for="file in uploadedFiles" @click="fileClicked(file)" style="cursor: pointer;">
                    <v-chip color="primary" text-color="white"
                            close @input="remove(file)">{{file.fileName}}
                    </v-chip>
                    <v-icon style="color: green; vertical-align: middle" v-if="Math.random() % 2 < 0.5">check_circle</v-icon>
                    <v-icon style="color: red; vertical-align: middle" v-else>warning</v-icon>

                  </div>
                </ul>
              </div>
            </div>
            <v-flex lg12 style="text-align: center;" id="dropzone">
              <v-layout row>
                <div
                  style="outline: 2px dashed deepskyblue; margin-top: 4%; margin-bottom: 4%; padding: 120px 0 85px 0; width: 100%;">
                  <div class="text-wrapper">
                    <v-icon  class="dnd" color="primary">cloud_upload</v-icon>
                    <label><strong class="file-selector">Choose files </strong><span>or drag them here</span>
                      <input type="file" class="file-selector-input" multiple @change="uploadFiles($event.target.files)"/>
                    </label>
                  </div>
                </div>
              </v-layout>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import Papa from 'papaparse'

  export default {
    data: () => ({
      experimentDialog: false,
      uploadedFiles: [],
      headers: [],
      items: [],
      selectedFile: '',
    }),
    methods: {
      uploadFiles: function (f) {
        var self = this;

        function loadFiles(file) {
          var fileName = file.name;
          var reader = new FileReader();

          reader.onload = function (e) {
            var content = e.target.result;
            self.uploadedFiles.push({
              content,
              fileName,
            });
          };
          reader.readAsText(file, "UTF-8");
        }
        console.log('FFFF', f.length);
        for (var i = 0; i < f.length; i++) {
          if (f[i].type !== "text/csv") {
            //if text file is not submitted alert and skip over it
            alert("Sorry, " + f[i].type + " is not an accepted file type.");
            continue;
          } else {
            if (this.uploadedFiles.length > 0) {
              if (
                !this.checkDuplicateFile(
                  f[i].name)
              ) {
                loadFiles(f[i]);
              }
            } else {
              loadFiles(f[i]);
            }
          }
        }
      },
      checkDuplicateFile: function (filename) {
        console.log('CHECK DUPLICATE FILE', this.uploadedFiles, this.uploadedFiles.find((el) => el.fileName === filename));
        if (this.uploadedFiles.find(el => el.fileName === filename)) {
          alert("Duplicate file: " + filename);
          return true;
        } else {
          return false;
        }
      },
      fileClicked(file) {
        this.selectedFile = file.name;
        this.items = Papa.parse(file.content, {header: true}).data;
        if (this.items.length > 0) {
          this.headers = Object.keys(this.items[0]).map((h) => Object.assign({text: h, value: h}));
        }
      },
      remove: function (file) {
        if (this.selectedFile === file.name) {
          this.items = [];
          this.headers = [];
        }
        this.uploadedFiles = this.uploadedFiles.filter((f) => f !== file)
      },
    },
    computed: {
      authenticated() {
        return this.$store.state.session.authenticated;
      },
    },
    mounted() {
      var self = this;
      document.querySelector('#file-panel').addEventListener("dragenter", function () {
        document.querySelector("#dropzone").style.opacity = .5;

      });

      document.querySelector('#file-panel').addEventListener("dragleave", function (e) {
        e.preventDefault();
        document.querySelector("#dropzone").style.opacity = 1;
      });

      document.querySelector('#file-panel').addEventListener("dragover", function (e) {
        e.preventDefault();
        document.querySelector("#dropzone").style.opacity = .5;
      });

      window.addEventListener("drop", function (e) {
        e.preventDefault();
        document.querySelector("#dropzone").style.opacity = 1;

        let files = e.dataTransfer.files;
        console.log("Drop files:", files);
        self.uploadFiles(files);
      });
    },
    created() {
    },
  };

</script>
<style>
  #file-panel {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: auto;
    margin: 2%
  }

  #upload-list {
    height: auto;
    padding: 0px;
  }

  ul {
    list-style-type: none;
  }

  .text-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: deepskyblue;
    padding: 5px;
  }

  .file-selector {
    cursor: pointer;
  }

  .file-selector-input {
    display: none;
  }

  .dnd {
    width: 50px;
    height: 50px;
    font-size: 50px;
  }
</style>
