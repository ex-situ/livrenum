<template>
  <div class="stringArray">
    <div v-for="(str, index) in curValue" class="field is-grouped">
      <span v-if="textarea==true" class="control is-expanded"><textarea class="textarea" type="text" v-model="curValue[index]" @input="change" ></textarea></span>
      <span v-else class="control is-expanded"><input class="input" type="text" v-model="curValue[index]" @input="change" ></span>
      <span class="control"><button v-if="curValue[index]" type="button" class="button is-inverted is-danger" @click.prevent="deleteString(index)"><span class="icon is-small"><i class="fa fa-times"></i></span></button></span>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  export default {
    name: 'stringarray',
    data() {
      return {
        curValue: []
      }
    },
    props: {
      value: {
        type: Array,
        default: [],
        required: true
      },
      textarea: {
        type: Boolean,
        default: false
      }
    },
    computed: {
    },
    methods: {
      change: function(event) {
        if (this.curValue[this.curValue.length-1] != "") {
          this.curValue = [...this.curValue, ""];
        }
        this.$emit('input', this.curValue.filter( (item) => item != "" ));
      },
      deleteString: function(index) {
        this.curValue.splice(index, 1);
        this.$emit('input', this.curValue.filter( (item) => item != "" ));
      }
    },
    created: function() {
      this.curValue = [...this.value, ""];
    }
  }
</script>

<style scoped>
  .stringArray {
    width:  100%;
  }
</style>
