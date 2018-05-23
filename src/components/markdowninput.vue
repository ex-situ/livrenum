<template>
  <div class="markdown-input">
    <div class="actions">
      <div class="field has-addons">
        <p class="control">
          <button type="button" class="button is-small" :disabled="!selection"><span class="icon is-small"><i class="fa fa-bold" @click.prevent="setBold"></i></span></button>
        </p>
        <p class="control">
          <button type="button" class="button is-small" :disabled="!selection"><span class="icon is-small"><i class="fa fa-italic" @click.prevent="setItalic"></i></span></button>
        </p>
        <p class="control">
          <button type="button" class="button is-small" :disabled="!selection"><span class="icon is-small"><i class="fa fa-strikethrough" @click.prevent="setStrikethrough"></i></span></button>
        </p>
        <p class="control">
          <button type="button" class="button is-small" :disabled="!selection"><span class="icon is-small"><i class="fa fa-superscript" @click.prevent="setSuperscript"></i></span></button>
        </p>
        <p class="control">
          <button type="button" class="button is-small" :disabled="!selection"><span class="icon is-small"><i class="fa fa-subscript" @click.prevent="setSubscript"></i></span></button>
        </p>
        <p class="control">
          <button type="button" class="button is-small" :disabled="!selection"><span class="icon is-small"><i class="fa fa-quote-right" @click.prevent="setQuote"></i></span></button>
        </p>
      </div>


    </div>
    <textarea class="textarea" v-model="curValue" @select="select" @focus="unselect" @mousedown="unselect">{{ curValue }}</textarea>
  </div>
</template>

<script>
  import Vue from 'vue';
  export default {
    name: 'markdowninput',
    data() {
      return {
        curValue: "",
        selection: null
      }
    },
    props: {
      value: {
        type: String,
        default: ""
      }
    },
    watch: {
      curValue: function(val) {
        this.$emit('input', val);
      }
    },
    methods: {
      select(e) {
        this.selection = {
          start: e.target.selectionStart,
          end: e.target.selectionEnd,
          text: e.target.value.substring(e.target.selectionStart, e.target.selectionStart + (e.target.selectionEnd - e.target.selectionStart))
        };
      },
      unselect(e) {
        this.selection = null;
      },
      setBold() {
        this.curValue = this.curValue.substr(0, this.selection.start) + "**" + this.selection.text + "**" + this.curValue.substr(this.selection.end);
      },
      setItalic() {
        this.curValue = this.curValue.substr(0, this.selection.start) + "*" + this.selection.text + "*" + this.curValue.substr(this.selection.end);
      },
      setStrikethrough() {
        this.curValue = this.curValue.substr(0, this.selection.start) + "~~" + this.selection.text + "~~" + this.curValue.substr(this.selection.end);
      },
      setSuperscript() {
        this.curValue = this.curValue.substr(0, this.selection.start) + "^" + this.selection.text + "^" + this.curValue.substr(this.selection.end);
      },
      setSubscript() {
        this.curValue = this.curValue.substr(0, this.selection.start) + "~" + this.selection.text + "~" + this.curValue.substr(this.selection.end);
      },
      setQuote() {
        this.curValue = this.curValue.substr(0, this.selection.start) + "\n> " + this.selection.text + this.curValue.substr(this.selection.end);
      }
    },
    created: function() {
      this.curValue = this.value;
    }
  }
</script>

<style lang="less" scoped>
  .markdown-input {
    display: block;
      position: relative;
    width:  100%;

    .actions {
      opacity: 0;
      transition: opacity 1s;
      position: absolute;
      right: 0;
      top: -2em;
      z-index: 10;
    }

    &:hover {
      .actions {
        opacity: 1;
        transition: opacity 0s;
      }
    }
  }
</style>
