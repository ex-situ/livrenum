<template>
  <div class="relationSelect">

    <div class="relation-list">
      <table v-if="curValue.length>0" class="table is-narrow">
        <thead>
          <tr>
            <th>Relations</th>
            <th>Titre</th>
            <th width="5%"><span class="icon is-small" title="Supprimer"><i class="fa fa-trash"></i></span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(relation, index) in curValue">
            <td><span class="ucFirst">{{ relation.relationType }}</span></td>
            <td><span v-if="relation.work">{{ workTitleByWorkId(relation.work) }}</span></td>
            <td class="has-text-right"><button type="button" class="button is-small is-inverted is-danger" @click.prevent="removeRelation(index)"><span class="icon is-small"><i class="fa fa-times"></i></span></button></td>
          </tr>
        </tbody>
      </table>
      <div v-else>
        <div class="panel">
          <p class="panel-block"><span class="icon"><i class="fa fa-info-circle"></i></span> <span>Aucune oeuvre liée</span></p>
        </div>
      </div>
    </div>

    <div class="relation-control">
      <div class="field has-addons">
        <p class="control">
          <span class="select">
            <select v-model="selRelation">
              <option value="" disabled selected>Choisir une relation</option>
              <option v-for="r in allowedRelations" :value="r">{{ r.charAt(0).toUpperCase() + r.slice(1) }}</option>
            </select>
          </span>
        </p>
        <p class="control">
          <div class="work-title">
            <autocomplete v-model.trim="txtWorkTitle" :suggestions="suggestions" placeholder="Titre" @knownvalue="workChange" ></autocomplete>
          </div>
        </p>
        <p class="control">
          <button type="button" class="button is-primary" :disabled="addButtonDisabled" @click="addRelation(txtWorkTitle, selRelation)"><span class="icon is-small"><i class="fa fa-plus"></i></span></button>
        </p>
      </div>
    </div>
  </div>

</template>

<script>
  import Vue from 'vue';
  import { mapGetters } from 'vuex'
  import Autocomplete from './autocomplete'

  export default {
    name: "RelationSelect",
    components: {
      Autocomplete
    },
    data() {
      return {
        curValue: [],
        txtWorkTitle: "",
        selRelation: "",
        allowedRelations: [
          "est une version de",
          "a pour version",

          "est une réécriture de",
          "a pour réécriture",

          "est un remake de",
          "a pour remake",

          "fait mention de",
          "est mentionné par",

          "s'inspire de",
          "a inspiré",

          "est une critique de",
          "est critiqué par",

          "est une illustration de",
          "est illustré par",

          "est la source de",
          "a pour source",

          "est la suite de",
          "a pour suite",

          "cite",
          "est cité par",

          "est une remédiation de",
          "est remédié par",

          "contient",
          "est contenu dans",

          "augmente",
          "est augmenté par"
        ]
      }
    },
    props: {
      value: {
        type: Array,
        required: true
      },
      removeIds: {
        type: Array,
        default: []
      }
    },
    computed: {
      addButtonDisabled() {
        return this.txtWorkTitle == "" || this.selRelation == "";
      },
      suggestions() {
        return this.knownWorks.filter(
            w => !this.removeIds.includes(w.id)
          )
          .reduce(
            (works, work) => [...works, work.title], []
          );
      },
      ...mapGetters({
        knownWorks: 'sortedWorks'
      })
    },
    methods: {
      addRelation(title, relation) {
        let work = this.workByTitle(title);

        if (work) {
          this.curValue.push( {work:work._id, relationType:relation} );
          this.emitValue();
          this.txtWorkTitle = "";
          this.selRelation = "";
        } else {
          console.log("ERREUR! Impossible de trouver l'oeuvre à mettre en relation!");
        }
      },
      removeRelation(index) {
        this.curValue.splice(index, 1);
        this.$emit('input', this.curValue);
      },
      workChange(e) {
        if (e === true) {
          this.unknownActor = false
        } else {
          this.unknownActor = true
        }
      },
      workByTitle(title) {
        return this.knownWorks.find( (w) =>  w.title === title);
      },
      workTitleByWorkId(id) {
        let work = this.knownWorks.find( w => w._id == id );
        return  work.title?work.title:"Erreur";
      },
      emitValue() {
        this.$emit('input', this.curValue);
      }
    },
    created: function() {
      this.curValue = this.value || [];
    }
  }
</script>

<style scoped lang="less">
  .work-title {
    position: relative;
    width: 100%;
  }
  .relation-list {
    margin-bottom: 1em;
  }
  .relation-control{
    width: 100%;
  }
</style>
