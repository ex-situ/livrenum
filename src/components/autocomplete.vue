<template>
  <div style="position:relative;width:100%;">
    <input :class="classes" type="text" ref="input" :value="value" :placeholder="placeholder" @keydown.enter.prevent="enter" @keydown.down="down" @keydown.up="up" v-on:input="change($event.target.value)" />
    <div class="panel suggestions"  :class="{'open':openSuggestion}" style="width:100%">
      <span class="panel-block small-text" v-for="(suggestion, index) in matches" :class="{'is-active': isActive(index)}" @click.prevent="suggestionClick(index)">
        <a href="#">{{ suggestion }}</a>
      </span>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';

  export default {
    data() {
      return {
        open: false,
        current: 0,
        classes: "input" + (this.isSmall?" is-small":"")
      }
    },
    props: {
      suggestions: {
        type: Array,
        required: true
      },
      value: {
        type: String,
        default: "",
        required: true
      },
      placeholder: {
        type: String
      },
      isSmall: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      matches() {
        return this.suggestions.filter((str) => {
          return str.toLowerCase().indexOf(this.value.toLowerCase()) != -1 && this.value != str;
        });
      },
      openSuggestion() {
        if (this.value !== "" && this.matches.length != 0 && this.open === true) {
          this.$emit('knownvalue', true);
        }
        return this.value !== "" && this.matches.length != 0 && this.open === true;
      }
    },
    methods: {
      enter(event) {
        this.$emit('input', String(this.matches[this.current]).trim());
        this.$emit('knownvalue', true);
        this.open = false;
      },
      up(event) {
        if (this.current > 0) {
          this.current--;
        }
      },
      down(event) {
        if (this.current < this.suggestions.length - 1) {
          this.current++;
        }
      },
      isActive(index) {
        return index === this.current;
      },
      change(val) {
        if (this.open == false) {
          this.open = true;
          this.current = 0;
        }

        this.$emit('knownvalue', val == "" || this.inSuggestions(val));
        this.$emit('input', String(val).trim());
      },
      suggestionClick(index) {
        this.$emit('input', String(this.matches[index]).trim());
        this.$emit('knownvalue', true);
        this.open = false;
      },
      inSuggestions(str) {
        return this.suggestions.find( (val) => val == str) != undefined
      }
    }
  }
</script>
<style scoped>
  .small-text {
    font-size: 80% !important;
  }
  .suggestions {
    position: absolute;
    background-color:  #fff;
    display: none;
    z-index: 10;
  }
  .suggestions.open {
    display: block;
  }
</style>
