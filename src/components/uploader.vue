<template>
  <div class="uploader">
    <div class="dropzone" :class="{'is-dragover':isDragover}"
      @drag.prevent.stop
      @dragstart.prevent.stop
      @dragover.prevent="isDragover=true"
      @dragenter.prevent="isDragover=true"
      @dragleave.prevent="isDragover=false"
      @dragend.prevent="isDragover=false"
      @drop.prevent="fileDrop">

      <div class="dropIcon has-text-centered">
        <span class="icon is-large"><i class="fa fa-cloud-upload"></i></span>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import axios from 'axios'

  export default {
    name: 'uploader',
    components: {
      axios
    },
    data() {
      return {
        isDragover: false,
        files: {},
        formData: {}
      }
    },
    props: {
      uploadUrl: {
        type: String,
        default: ""
      }
    },
    computed: {
    },
    methods: {
      fileDrop(e) {
        this.isDragover = false;
        this.formData.append("file", e.dataTransfer.files[0]);
        this.formData.append("filename", e.dataTransfer.files[0].name);
        axios.post(this.uploadUrl, this.formData)
          .then( (response) => {
            this.$emit('uploaded', response.data.url)
          })
          .catch( (error) => {
            console.log(error);
          });
      }
    },
    created() {
      this.formData = new FormData();
    }
  }
</script>

<style scope>
.dropzone {
  background-color: #eee;
  outline: 2px dashed #ccc;
  outline-offset: -.5em;
  padding: 1em;
}
.is-dragover {
  background-color: #2E7DE8;
  color:  #fff;
}
</style>
