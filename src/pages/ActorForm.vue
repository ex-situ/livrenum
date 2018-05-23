<template>
  <div v-if="formData" class="actorForm content">
    <form class="form-horizontal" id="actorForm" @submit="submit">

      <div class="level">
        <span class="level-left">
          <span>
            <h1 v-if="isNewActor" class="title">Nouveau créateur</h1>
            <h1 v-else class="title">Modifier le créateur</h1>
          </span>
        </span>
        <span class="level-right">
          <div class="field is-grouped">
            <span class="control"><button type="button" class="button is-link is-delault" @click="cancel"><span class="icon is-small"><i class="fa fa-arrow-left"></i></span><span>Annuler</span></button></span>
            <span class="control"><button v-if="!isNewActor" type="button" class="button is-danger is-outlined" @click="deleteActor" :disabled="worksByActorId($route.params.actorId).length>0"><span class="icon is-small"><i class="fa fa-trash"></i></span><span>Supprimer</span></button></span>
            <span class="control"><button type="submit" class="button is-primary" @click.prevent="submit"><span class="icon is-small"><i class="fa fa-check"></i></span><span>Enregistrer</span></button></span>
          </div>
        </span>
      </div>

      <div class="columns">
        <div class="column">

          <div class="field">
            <label class="label">Type</label>
            <p class="control">
              <label class="radio"><input v-model="formData.isOrganization" :value="false" type="radio" name="radioType" @change="typeChange"> <span class="icon is-small"><i class="fa fa-user"></i></span> Individu</label>
              <label class="radio"><input v-model="formData.isOrganization" :value="true" type="radio" name="radioType" @change="typeChange"> <span class="icon is-small"><i class="fa fa-users"></i></span> Organisation/groupe</label>
            </p>
          </div>

          <div class="field">
            <label class="label">Nom</label>
            <p class="control">
              <input v-model="fullName" class="input is-large" type="text" placeholder="Nom complet" >
            </p>
          </div>

          <div v-if="!formData.isOrganization" class="field is-narrow">
            <label class="label">Pseudonyme</label>
            <div class="field">
              <p class="control" style="width:25%">
                <input v-model="formData.surname" class="input" type="text">
              </p>
              <p v-if="fullName && formData.surname" class="control">
                <label class="checkbox">
                  <input v-model="formData.useSurname" type="checkbox"> Utiliser comme nom officiel
                </label>
              </p>
            </div>
          </div>

          <div class="field">
            <label class="label"><span v-if="formData.isOrganization">Description</span><span v-else>Biographie</span></label>
            <p class="control">
              <markdowninput v-model.trim="formData.description"></markdowninput>
            </p>
          </div>

          <div class="field">
            <label class="label">Distinction(s)</label>
            <p class="control">
              <stringArray v-model="formData.awards"></stringArray>
            </p>
          </div>

          <div class="field">
            <label class="label">Commentaires</label>
            <p class="control">
              <markdowninput v-model.trim="formData.comments"></markdowninput>
            </p>
          </div>

        </div>

        <div class="column is-one-quarter">

          <div class="panel content is-small">
            <div class="panel-heading">Médias</div>
            <div class="panel-block">
              <medialist v-model="formData.media" :uploadUrl="uploadUrl" mode="edit"></medialist>
            </div>
          </div>

        </div>

      </div>

    </form>
  </div>
</template>

<script>
import { mapState,mapGetters,mapActions } from 'vuex'
import Medialist from '@/components/Medialist'
import Autocomplete from '@/components/autocomplete'
import StringArray from '@/components/stringarray'
import markdowninput from '@/components/markdowninput'

export default {
  name: 'actorForm',
  components: {
    Medialist, Autocomplete, StringArray, markdowninput
  },
  data: function() {
    return {
      isNewActor : true,
      fullName: '',
      formData: {},
      initialValues: {}
    }
  },
  computed: {
    ...mapState({
      uploadUrl: state => state.uploadUrl
    }),
    ...mapGetters({
      knownActors: 'knownActors',
      actorById: 'actorById',
      worksByActorId: 'worksByActorId'
    })
  },
  watch: {
    fullName(val) {
      this.formData.fullName = val;
      this.formData.name = val;
      if (this.formData.isOrganization) {
        this.formData.firstName = val;
        this.formData.lastName = '';
      } else {
        this.formData.firstName = val.substr(0, val.indexOf(' '));
        this.formData.lastName = val.substr(val.indexOf(' ') + 1);
      }
    }
  },
  methods: {
    submit: function(event) {
      if (this.isNewActor) {
        this.addActor(event);
      } else {
        this.updateActor();
      }
    },
    reset: function() {
      if (this.$route.params.actorId) {
        Object.assign(this.formData, this.initialValues);
      } else {
        this.formData = {
          isOrganization: false,
          name: "",
          firstName: "",
          lastName: "",
          fullName: "",
          surname: "",
          useSurname: false,
          description: "",
          awards: [],
          comments: "",
          works: [],
          media: []
        }
      }
    },
    cancel: function(event) {
      this.reset();
      this.$router.go(-1);
    },
    typeChange(e) {
      this.formData.name = this.formData.fullName;
      if (this.formData.isOrganization == true) {
        this.formData.firstName = this.formData.fullName;
        this.formData.lastName = "";
      } else {
        this.formData.firstName = this.formData.fullName.substr(0, this.formData.fullName.indexOf(' '));
        this.formData.lastName = this.formData.fullName.substr(this.formData.fullName.indexOf(' ') + 1);
      }
    },
    deleteActor: function(event) {
      if (confirm("Supprimer ce créateur? Cette opération est irréversible.")) {
        this.$store.dispatch('deleteActor', this.$route.params.actorId);
        this.$router.push({ name: "Actors" });
      }
    },
    addActor: function(event) {
      this.$store.dispatch('newActor', this.formData ).then(() => this.cancel());
    },
    updateActor: function() {
      this.$store.dispatch('updateActor', this.formData )
        .then(() => { this.cancel() } )
        .catch( () => { console.log("Oups!")});
    },
    showHelp: function(subject) {
      alert("Implémentation pour bientôt!");
    }
  },
  created: function() {
    if (this.$route.params.actorId) {
      this.isNewActor = false;
      this.formData = this.actorById(this.$route.params.actorId);
      Object.assign(this.initialValues, this.formData);
      this.fullName = this.formData.fullName;
    } else {
      this.reset();
    }
  }
}
</script>

<style lang="less" scoped>
</style>
