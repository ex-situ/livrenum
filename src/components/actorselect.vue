/* eslint-disable */
<template>
  <div class="actorsSelect">

    <div class="actor-list">
      <table v-if="value.length>0" class="table is-narrow">
        <thead>
          <tr>
            <th>Rôle</th>
            <th>Nom</th>
            <th width="5%"><span class="icon is-small is-left" title="Créateur majeur"><i class="fa fa-star"></i></span></th>
            <th width="5%"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(actor, index) in curValue">
            <td><span class="ucFirst">{{ actor.role }}</span></td>
            <td v-if="actor.actor.isOrganization"><span class="icon is-small"><i class="fa fa-users"></i></span> {{ actor.actor.name }}</td>
            <td v-else><span class="icon is-small"><i class="fa fa-user"></i></span> {{ actor.actor.fullName }}</td>
            <td><input type="checkbox" v-model="actor.isMajor"></td>
            <td class="has-text-right"><button type="button" class="button is-small is-inverted is-danger" @click.prevent="removeActor(index)"><span class="icon is-small"><i class="fa fa-times"></i></span></button></td>
          </tr>
        </tbody>
      </table>
      <div v-else>
        <div class="panel">
          <p class="panel-block"><span class="icon"><i class="fa fa-info-circle"></i></span>&nbsp;<span>Aucun créateur spécifié</span></p>
        </div>
      </div>
    </div>

    <div class="actor-control">
      <div class="field has-addons has-addons-centered">
        <p class="control">
          <span class="select">
            <select v-model="selRole">
              <option value="" disabled selected>Choisir un rôle</option>
              <option v-for="(t, i) in allowedRoles" :value="t.value" >{{t.text}}</option>
            </select>
          </span>
        </p>
        <p class="control">
          <div class="actor-name">
            <autocomplete v-model.trim="txtActorName" :suggestions="suggestions" placeholder="Nom du créateur" @knownvalue="actorChange" ></autocomplete>
            <div v-if="unknownActor" class="panel unknown-creator">
              <div class="panel-block">
                <div class="field">
                  <label class="label">Nouveau créateur</label>
                  <p class="control is-marginless">
                    <label class="radio"><input v-model="isOrganization" :value="true" type="radio" name="radioType"> <span class="icon is-small"><i class="fa fa-users"></i></span> <span>Organisation/groupe</span></label>
                  </p>
                  <p class="control is-marginless" :class="{'is-muted':!isValidPersonName}">
                    <label class="radio"><input v-model="isOrganization" :value="false" type="radio" name="radioType" :disabled="!isValidPersonName"> <span class="icon is-small"><i class="fa fa-user"></i></span> <span>Individu</span></label>
                  </p>
                  <p v-if="isValidPersonName && isOrganization === false" class="has-text-info"><span class="icon is-small"><i class="fa fa-info-circle"></i></span> <span class="is-size-7">Ne pas saisir de pseudonyme</span></p>
                </div>
              </div>
            </div>
          </div>
        </p>
        <p class="control">
          <button type="button" class="button is-primary" :disabled="addButtonDisabled" @click="addActor(txtActorName, selRole)"><span class="icon is-small"><i class="fa fa-plus"></i></span></button>
        </p>
      </div>
    </div>
  </div>

</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import Autocomplete from "./autocomplete";

export default {
  name: "ActorSelect",
  components: {
    Autocomplete
  },
  data() {
    return {
      curValue: [],
      unknownActor: false,
      isOrganization: false,
      txtActorName: "",
      selRole: "",
      allowedRoles: [
        { text: "Acteur", value: "acteur" },
        { text: "Artiste", value: "artiste" },
        { text: "Audio", value: "audio" },
        { text: "Auteur", value: "auteur" },
        { text: "Conception", value: "conception" },
        { text: "Création", value: "création" },
        { text: "Design", value: "design" },
        { text: "Développement", value: "développement" },
        { text: "Direction", value: "direction" },
        { text: "Direction artistique", value: "direction artistique" },
        { text: "Distribution", value: "distribution" },
        { text: "Écriture", value: "écriture" },
        { text: "Édition", value: "édition" },
        { text: "Effets sonores", value: "effets sonores" },
        { text: "Illustration", value: "illustration" },
        { text: "Montage", value: "montage" },
        { text: "Musique", value: "musique" },
        { text: "Production", value: "production" },
        { text: "Programmation", value: "programmation" },
        { text: "Publication", value: "publication" },
        { text: "Réalisation", value: "réalisation" },
        { text: "Scénarisation", value: "scénarisation" },
        { text: "Autre", value: "autre" }
      ]
    };
  },
  props: {
    value: {
      type: Array,
      default: function () {return [];},
      required: true
    }
  },
  computed: {
    addButtonDisabled() {
      return this.txtActorName === '' || this.selRole === '';
    },
    suggestions() {
      return this.knownActors.reduce((actors, actor) => [...actors, actor.fullName], []);
    },
    isValidPersonName() {
      const valid = this.txtActorName.split(' ').length >= 2;
      if (!valid) this.isOrganization = true;
      else this.isOrganization = null;

      return valid;
    },
    ...mapGetters({
      knownActors: 'sortedActors',
    }),
  },
  methods: {
    addActor(fullName, role) {
      const actor = this.actorByName(fullName);

      if (actor) {
        this.curValue.push({ actor, role, isMajor: false });
        this.$emit('input', this.curValue);
        this.txtActorName = '';
        this.selRole = '';
      } else {
        this.$store
          .dispatch('newActor', {
            fullName,
            name: fullName,
            isOrganization: this.isOrganization,
          })
          .then(() => {
            this.curValue.push({
              actor: this.actorByName(fullName),
              role,
              isMajor: false,
            });
            this.$emit('input', this.curValue);
            this.txtActorName = '';
            this.selRole = '';
            this.actorChange(true);
          })
          .catch(() => {
            console.log("Erreur lors de l'ajout du créateur!");
          });
      }
    },
    removeActor(index) {
      this.curValue.splice(index, 1);
      this.$emit('input', this.curValue);
    },
    actorByName(fullName) {
      return this.knownActors.find(el => el.fullName === fullName);
    },
    actorChange(e) {
      if (e === true) {
        this.unknownActor = false;
      } else {
        this.unknownActor = true;
      }
    },
  },
  created() {
    this.curValue = this.value;
  },
};
</script>

<style scoped>
.actor-name {
  position: relative;
  width: 100%;
}
.actor-list {
  margin-bottom: 1em;
}
.actor-control {
  width: 100%;
}
.unknown-creator {
  width: 100%;
  background-color: #fff;
  position: absolute;
  left: 0;
  z-index: 10;
}
</style>
