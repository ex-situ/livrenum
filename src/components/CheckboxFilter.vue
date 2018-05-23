<template>
  <div class="CheckboxFilter">
    <div v-if="filter.state.length > 0" class="panel-heading">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <span>{{ label }}</span>
            <span v-if="filter.value.length > 0" class="content is-small">&nbsp;(<a href="#" @click.prevent="reset">réinitialiser</a>)</span>
          </div>
        </div>
        <div class="level-right">
          <div v-if="filter.state.length > maxValues || showSortControls" class="level-item sort-controls">
            <div class="field has-addons">
              <p class="control is-marginless">
                <a class="button is-small" :class="{'is-active' : sortedByCount==false}" @click="sortedByCount=false">
                  <span class="icon is-small">
                    <i class="fa fa-sort-alpha-asc"></i>
                  </span>
                </a>
              </p>
              <p class="control is-marginless">
                <a class="button is-small" :class="{'is-active' : sortedByCount==true}" @click="sortedByCount=true">
                  <span class="icon is-small">
                    <i class="fa fa-sort-amount-desc"></i>
                  </span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="filter.state.length>0" class="panel-block">
      <div class="panel-body">

        <div v-for="(state, index) in sortedStates" class="field is-marginless">
          <label v-if="state.count > 0" class="checkbox" :class="{'is-hidden': index> maxValues && !showAll}">
            <input v-if="!filter.value.includes(state.value) && itemCount <= state.count" type="checkbox" :checked="true" disabled="disabled">
            <input v-else type="checkbox" class="checkbox" v-model="filter.value" :value="state.value" @change="emitValue()" />
            <span class="ucFirst" :class="{'is-muted': !filter.value.includes(state.value) && itemCount == state.count}">{{ state.value }} <span v-if="!filter.value.includes(state.value)">({{ state.count }})</span></span>
          </label>
        </div>
        <a v-if="filter.state.length>maxValues && !showAll" class="showall-link" @click="showAll=true">Afficher toutes les valeurs</a>
        <a v-if="filter.state.length>maxValues && showAll" class="showall-link" @click="showAll=false">Afficher moins de valeurs</a>

      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  export default {
    name: 'CheckboxFilter',
    data() {
      return {
        filter: this.value,
        sortedByCount: this.sortByCount,
        showAll: false
      }
    },
    props: {
      value: {
        type: Object,
        required: true
      },
      itemCount: {
        type: Number,
        required: true
      },
      label: {
        type: String,
        default: "Filtre"
      },
      maxValues: {
        type: Number,
        default: 15
      },
      sortByCount: {
        type: Boolean,
        default: true
      },
      showSortControls: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      sortedStates: function() {
        return this.sortedByCount ? this.value.state.sort( (a,b) => b.count-a.count) : this.value.state.sort( (a,b) => a.value.localeCompare(b.value) );
      }
    },
    methods: {
      emitValue() {
        this.$emit('input', this.filter);
      },
      reset() {
        this.$emit('reset');
      }
    },
    created: function() {
      this.filter = this.value;
      this.sortedByCount = this.sortByCount;
    }
  }
</script>

<style scoped>
  .CheckboxFilter {
    margin-top:  -1px;
  }
  .is-hidden {
    display: none;
  }
  .showall-link {
    margin-left: 2.2em;
  }
  .sort-controls a {
    margin-top: -4px !important;
    margin-bottom: -4px !important;
  }
</style>
