<template>
  <div
    :tabindex="tabindex"
    :class="{ 'multiselect--active': isOpen, 'multiselect--disabled': disabled, 'multiselect--above': isAbove }"
    @focus="activate()"
    @blur="searchable ? false : deactivate()"
    @keydown.self.down.prevent="pointerForward()"
    @keydown.self.up.prevent="pointerBackward()"
    @keydown.enter.tab.stop.self="addPointerElement($event)"
    @keyup.esc="deactivate()"
    class="multiselect">
      <slot name="carret">
        <div @mousedown.prevent.stop="toggle()" class="multiselect__select"></div>
      </slot>
      <slot name="clear" :search="search"></slot>
      <div ref="tags" class="ms-input">
        <div class="multiselect__tags-wrap" v-show="visibleValue.length > 0">
          <template v-for="option of visibleValue" @mousedown.prevent>
            <slot name="tag" :option="option" :search="search" :remove="removeElement">
              <span class="ms-value tag is-primary">
                <span v-text="getOptionLabel(option)"></span>
                <i aria-hidden="true" tabindex="1" @keydown.enter.prevent="removeElement(option)"  @mousedown.prevent="removeElement(option)" class="delete is-small"></i>
              </span>&nbsp;
            </slot>
          </template>
        </div>
        <template v-if="internalValue && internalValue.length > limit">
          <strong class="multiselect__strong" v-text="limitText(internalValue.length - limit)"></strong>
        </template>
        <transition name="multiselect__loading">
          <slot name="loading"><div v-show="loading" class="multiselect__spinner"></div></slot>
        </transition>
        <input
          ref="search"
          :name="name"
          :id="id"
          type="text"
          autocomplete="off"
          :placeholder="placeholder"
          v-if="searchable"
          :style="inputStyle"
          :value="isOpen ? search : currentOptionLabel"
          :disabled="disabled"
          @input="updateSearch($event.target.value)"
          @focus.prevent="activate()"
          @blur.prevent="deactivate()"
          @keyup.esc="deactivate()"
          @keydown.down.prevent="pointerForward()"
          @keydown.up.prevent="pointerBackward()"
          @keydown.enter.prevent.stop.self="addPointerElement($event)"
          @keydown.delete.stop="removeLastElement()"
          class="multiselect__input"/>
        <span
          v-if="!searchable"
          class="multiselect__single"
          v-text="currentOptionLabel">
        </span>
      </div>
      <transition name="multiselect">
        <div
          class="multiselect__content-wrapper"
          v-show="isOpen"
          @mousedown.prevent
          :style="{ maxHeight: optimizedHeight + 'px' }"
          ref="list">
          <div class="panel content is-small" :style="contentStyle">
            <slot name="beforeList"></slot>
            <div v-if="multiple && max === internalValue.length">
              <span class="panel-block">
                <slot name="maxElements">Un maximum de {{ max }} options est sélectionné. Retirez des options pour en ajouter d'autres.</slot>
              </span>
            </div>
            <template v-if="!max || internalValue.length < max">
              <span v-for="(option, index) of filteredOptions" :key="index">
                <span
                  v-if="!(option && (option.$isLabel || option.$isDisabled))"
                  :class="optionHighlight(index, option)"
                  @click.stop="select(option)"
                  @mouseenter.self="pointerSet(index)"
                  :data-select="option && option.isTag ? tagPlaceholder : selectLabelText"
                  :data-selected="selectedLabelText"
                  :data-deselect="deselectLabelText"
                  class="tag ms-option">
                    <slot name="option" :option="option" :search="search">
                      <span>{{ getOptionLabel(option) }}</span>
                    </slot>
                </span>
                <span
                  v-if="option && (option.$isLabel || option.$isDisabled)"
                  :class="optionHighlight(index, option)"
                  class="is-muted">
                    <slot name="option" :option="option" :search="search">
                      <span>{{ getOptionLabel(option) }}</span>
                    </slot>
                </span>
              </span>
            </template>
            <div v-show="showNoResults && (filteredOptions.length === 0 && search && !loading)" class="panel-block">
              <span class="">
                <slot name="noResult">Élément introuvable</slot>
              </span>
            </div>
            <slot name="afterList"></slot>
          </div>
        </div>
      </transition>
  </div>
</template>

<script>
  import multiselectMixin from './multiselectMixin'
  import pointerMixin from './pointerMixin'

  export default {
    name: 'vue-multiselect',
    mixins: [multiselectMixin, pointerMixin],
    props: {

      /**
       * name attribute to match optional label element
       * @default ''
       * @type {String}
       */
      name: {
        type: String,
        default: ''
      },
      /**
       * String to show when pointing to an option
       * @default 'Press enter to select'
       * @type {String}
       */
      selectLabel: {
        type: String,
        default: 'Press enter to select'
      },
      /**
       * String to show next to selected option
       * @default 'Selected'
       * @type {String}
      */
      selectedLabel: {
        type: String,
        default: 'Selected'
      },
      /**
       * String to show when pointing to an alredy selected option
       * @default 'Press enter to remove'
       * @type {String}
      */
      deselectLabel: {
        type: String,
        default: 'Press enter to remove'
      },
      /**
       * Decide whether to show pointer labels
       * @default true
       * @type {Boolean}
      */
      showLabels: {
        type: Boolean,
        default: true
      },
      /**
       * Limit the display of selected options. The rest will be hidden within the limitText string.
       * @default 'label'
       * @type {String}
       */
      limit: {
        type: Number,
        default: 99999
      },
      /**
       * Sets maxHeight style value of the dropdown
       * @default 300
       * @type {Integer}
       */
      maxHeight: {
        type: Number,
        default: 300
      },
      /**
       * Function that process the message shown when selected
       * elements pass the defined limit.
       * @default 'and * more'
       * @param {Int} count Number of elements more than limit
       * @type {Function}
       */
      limitText: {
        type: Function,
        default: count => `et ${count} de plus`
      },
      /**
       * Set true to trigger the loading spinner.
       * @default False
       * @type {Boolean}
      */
      loading: {
        type: Boolean,
        default: false
      },
      /**
       * Disables the multiselect if true.
       * @default false
       * @type {Boolean}
      */
      disabled: {
        type: Boolean,
        default: false
      },
      /**
       * Fixed opening direction
       * @default ''
       * @type {String}
      */
      openDirection: {
        type: String,
        default: ''
      },
      showNoResults: {
        type: Boolean,
        default: true
      },
      tabindex: {
        type: Number,
        default: 0
      }
    },
    computed: {
      visibleValue () {
        return this.multiple
          ? this.internalValue.slice(0, this.limit)
          : []
      },
      deselectLabelText () {
        return this.showLabels
          ? this.deselectLabel
          : ''
      },
      selectLabelText () {
        return this.showLabels
          ? this.selectLabel
          : ''
      },
      selectedLabelText () {
        return this.showLabels
          ? this.selectedLabel
          : ''
      },
      inputStyle () {
        if (this.multiple && this.value && this.value.length) {
          return this.isOpen ? { 'width': 'auto' } : { 'display': 'none' }
        }
      },
      contentStyle () {
        return this.options.length
          ? { 'display': 'inline-block' }
          : { 'display': 'block' }
      },
      isAbove () {
        if (this.openDirection === 'above' || this.openDirection === 'top') {
          return true
        } else if (this.openDirection === 'below' || this.openDirection === 'bottom') {
          return false
        } else {
          return this.prefferedOpenDirection === 'above'
        }
      }
    }
  }
</script>

<style>
fieldset[disabled] .multiselect {
  pointer-events: none;
}

.ms-input {
  all: initial;
  font: inherit;
  overflow-y: auto;
  border-radius: 3px;
  padding-bottom: 0.5em;
  padding-left: 0.625em;
  padding-top: 0.5em;
  background-color: white;
  border: 1px solid #dbdbdb;
  color: #363636;
  cursor: pointer;
  display: block;
  outline: none;
  padding-right: 2.5em;
}

.ms-value {
  margin-bottom: .25em;
}

.ms-option {
  margin-bottom: .25em;
  cursor: pointer;
}

@keyframes spinning {
  from { transform:rotate(0) }
  to { transform:rotate(2turn) }
}
</style>
