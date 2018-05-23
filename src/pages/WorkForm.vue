<template>
  <div v-if="formData" class="workForm content">
    <form class="form-horizontal" id="workForm" @submit="submit">

      <div class="level">
        <span class="level-left">
          <span>
            <h1 v-if="isNewWork" class="title">Nouvelle œuvre</h1>
            <h1 v-else class="title">Modifier la fiche<div class="is-muted subtitle"> (créée par <i>{{ formData.entryBy || "un utilisateur non spécifié" }}</i> le {{ formatDate(formData.entryCreated) }})</div></h1>
          </span>
        </span>
        <span class="level-right">
          <div class="field is-grouped">
            <span class="control"><button type="button" class="button is-link is-delault" @click="cancel"><span class="icon is-small"><i class="fa fa-arrow-left"></i></span><span>Annuler</span></button></span>
            <span class="control"><button v-if="!isNewWork" type="button" class="button is-danger is-outlined" @click="deleteWork"><span class="icon is-small"><i class="fa fa-trash"></i></span><span>Supprimer</span></button></span>
            <span class="control"><button type="submit" class="button is-primary" @click.prevent="submit"><span class="icon is-small"><i class="fa fa-check"></i></span><span>Enregistrer</span></button></span>
          </div>
        </span>
      </div>

      <div class="columns">
        <div class="column">

          <div class="field">
            <label class="label">Titre</label>
            <p class="control">
              <input v-model="formData.title" class="input is-large" type="text" required>
            </p>
          </div>

          <div class="field">

            <div class="field" style="width:50%;">
              <label class="label">Type(s)</label>
              <div>
                <multiselect
                  v-model="formData.type"
                  :options="allowedType"
                  :searchable="true"
                  :multiple="true"
                  :HideSelected="true"
                  :CloseOnSelect="false"
                  placeholder=""
                  select-label="Ajouter"
                  selected-label="Sélectionné"
                  deselect-label="Retirer"
                  tag-placeholder="Nouveau thème" />
              </div>
            </div>

          </div>

          <div class="columns">
            <div class="column">

              <div class="field">
                <p class="control">
                  <label class="label">Corpus</label>
                  <div class="field is-grouped">
                    <p class="control">
                      <label class="checkbox">
                        <input type="checkbox" value="oeuvre" v-model="formData.corpus"> Œuvre
                      </label>
                    </p>
                    <p class="control">
                      <label class="checkbox">
                        <input type="checkbox" value="ouvrage théorique" v-model="formData.corpus"> Ouvrage théorique
                      </label>
                    </p>
                  </div>
                </p>
              </div>
            </div>

            <div class="column">

              <div class="field">
                <label class="label">Pertinence</label>
                <div><star-rating v-model="formData.relevance" :show-rating="false" :star-size="25"></star-rating></div>
              </div>
            </div>
          </div>

          <hr>

          <div class="columns">
            <div class="column">

              <div class="title">Référence</div>

              <div class="field">
                <label class="label">Éditeur</label>
                <div>
                  <autocomplete v-model.trim="formData.publisher" :suggestions="knownPublishers" required></autocomplete>
                </div>
              </div>

              <div class="field">
                <label class="label">Lieu d'édition</label>
                <div>
                  <autocomplete v-model.trim="formData.location" :suggestions="knownLocations" required></autocomplete>
                </div>
              </div>

              <label class="label">Année / édition / volume / publication</label>
              <div class="field has-addons">
                <p class="control quarter is-marginless">
                  <input type="number" class="input" v-model.trim="formData.yearPublished" placeholder="AAAA" required>
                </p>
                <p class="control quarter is-marginless">
                  <input type="text" class="input" placeholder="Édition" v-model="formData.edition">
                </p>
                <p class="control quarter is-marginless">
                  <input type="text" class="input" placeholder="No. vol." v-model="formData.volumeNo">
                </p>
                <p class="control quarter is-marginless">
                  <input type="text" class="input" placeholder="No. pub." v-model="formData.publicationNo">
                </p>
              </div>

              <div class="field">
                <label class="label">Nombre de pages</label>
                <div class="control quarter">
                  <input type="number" class="input" placeholder="" size="4" v-model="formData.pageCount">
                </div>
              </div>

              <label class="label">Intervalle de pages</label>
              <div class="field has-addons">
                <p class="control quarter is-marginless">
                  <input type="text" class="input" v-model.trim="formData.pageStart" placeholder="Début">
                </p>
                <p class="control quarter is-marginless">
                  <input type="text" class="input" v-model.trim="formData.pageEnd" placeholder="Fin">
                </p>
              </div>

              <div class="field">
                <label class="label">Série</label>
                <div class="control">
                  <input type="text" class="input" placeholder="" v-model="formData.serie">
                </div>
              </div>

              <div class="field">
                <label class="label">Notes éditoriales</label>
                <div class="control">
                  <textarea class="textarea" v-model.trim="formData.editionComment"></textarea>
                </div>
              </div>

              <div class="field">
                <label class="label">URL de la ressource</label>
                <div class="control">
                  <input type="url" class="input" placeholder="" v-model="formData.url">
                </div>
              </div>

              <div class="field">
                <label class="label">Lieu de trouvaille</label>
                <div class="control">
                  <input type="text" class="input" placeholder="" v-model="formData.found">
                </div>
              </div>

            </div>

            <div class="column">
              <div class="title">Créateurs</div>
              <actorSelect v-model="formData.actors"></actorSelect>

              <div class="title">Relations</div>
              <relationSelect v-model="formData.relations" :removeIds="[formData.id]"></relationSelect>

              <div class="title">Distinctions</div>
              <div class="field">
                <div>
                  <stringArray v-model="formData.awards"></stringArray>
                </div>
              </div>

            </div>
          </div>

          <hr>
          <div class="columns">
            <div class="column">

              <div class="title">Description et analyse</div>

              <div class="field">
                <label class="label">Synthèse</label>
                <div>
                  <markdowninput v-model.trim="formData.synthesis"></markdowninput>
                </div>
              </div>

              <div class="field">
                <label class="label">Description existante</label>
                <div>
                  <markdowninput v-model.trim="formData.description"></markdowninput>
                </div>
              </div>

              <div class="field">
                <label class="label">Discours critique existant</label>
                <div>
                  <markdowninput v-model.trim="formData.report"></markdowninput>
                </div>
              </div>

              <div class="field">
                <label class="label">Commentaires</label>
                <div>
                  <markdowninput v-model.trim="formData.comments"></markdowninput>
                </div>
              </div>

              <div class="columns">
                <div class="column">

                  <div class="field">
                    <label class="label">Langue(s)</label>
                    <div>
                      <multiselect
                        v-model="formData.languages"
                        :options="allowedLanguages"
                        :searchable="true"
                        :taggable="true"
                        :multiple="true"
                        :HideSelected="true"
                        :CloseOnSelect="false"
                        placeholder=""
                        select-label="Ajouter"
                        selected-label="Sélectionné"
                        deselect-label="Retirer"
                        tag-placeholder="Nouveau thème" />
                    </div>
                  </div>

                  <div class="field">
                    <label class="label">Support(s)</label>
                    <div>
                      <multiselect
                        v-model="formData.medium"
                        :options="allowedMedia"
                        :searchable="true"
                        :multiple="true"
                        :HideSelected="true"
                        :CloseOnSelect="false"
                        placeholder=""
                        select-label="Ajouter"
                        selected-label="Sélectionné"
                        deselect-label="Retirer" />
                    </div>
                  </div>

                  <div class="field">
                    <label class="label">Mot(s)-clé(s)</label>
                    <div>
                      <multiselect
                        v-model="formData.keywords"
                        :options="availableKeywords"
                        :searchable="true"
                        :taggable="true"
                        :multiple="true"
                        :HideSelected="true"
                        placeholder=""
                        select-label="Ajouter"
                        selected-label="Sélectionné"
                        deselect-label="Retirer"
                        tag-placeholder="Nouveau mot-clé"
                        @tag="addKeyword" />
                    </div>
                  </div>

                </div>
                <div class="column">

                  <div class="field">
                    <label class="label">Caractéristiques médiatiques</label>
                    <div>
                      <multiselect
                        v-model="formData.mediaCharacteristics"
                        :options="allowedMediaCharacteristics"
                        :searchable="true"
                        :taggable="true"
                        :multiple="true"
                        :HideSelected="true"
                        :CloseOnSelect="false"
                        placeholder=""
                        select-label="Ajouter"
                        selected-label="Sélectionné"
                        deselect-label="Retirer" />
                    </div>
                  </div>

                  <div class="field">
                    <label class="label">Type(s) d'interaction</label>
                    <div>
                      <multiselect
                        v-model="formData.interactionTypes"
                        :options="allowedInteractions"
                        :searchable="true"
                        :taggable="true"
                        :multiple="true"
                        :HideSelected="true"
                        :CloseOnSelect="false"
                        placeholder=""
                        select-label="Ajouter"
                        selected-label="Sélectionné"
                        deselect-label="Retirer" />
                    </div>
                  </div>

                </div>
              </div>

              <hr>

              <div class="title">Citations</div>
              <div class="field">
                <div>
                  <stringArray v-model.trim="formData.quotes" :textarea="true"></stringArray>
                </div>
              </div>

            </div>
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
import { mapState,mapGetters,mapMutations,mapActions } from 'vuex'
import StarRating from 'vue-star-rating'
import Multiselect from '@/components/multiselect/Multiselect'
import Autocomplete from '@/components/autocomplete'
import StringArray from '@/components/stringarray'
import ActorSelect from '@/components/actorselect'
import RelationSelect from '@/components/relationselect'
import Medialist from '@/components/Medialist'
import markdowninput from '@/components/markdowninput'

export default {
  name: 'workForm',
  components: {
    StarRating, Autocomplete, StringArray, ActorSelect, RelationSelect, Multiselect, Medialist, markdowninput
  },
  data: function() {
    return {
      isNewWork : true,
      initialValues: {},
      formData: {}
    }
  },
  computed: {
    ...mapState({
      allowedTypes: state => state.allowedTypes,
      allowedType: state => state.allowedType,
      allowedActorRole: state => state.allowedActorRole,
      allowedLanguages: state => state.allowedLanguages,
      allowedMedia: state => state.allowedMedia,
      allowedMediaCharacteristics: state => state.allowedMediaCharacteristics,
      allowedInteractions: state => state.allowedInteractions,
      allowedPlatforms: state => state.allowedPlatforms,
      uploadUrl: state => state.uploadUrl,
      currentUser: state => state.currentUser
    }),
    ...mapGetters({
      works: 'sortedWorks',
      workById: 'workById',
      knownTitles: 'knownTitles',

      actorById: 'actorById',
      actorByName: 'actorByName',

      knownPublishers: 'knownPublishers',
      knownLocations: 'knownLocations',
      availableKeywords: 'sortedKeywords'
    })
  },
  methods: {
    submit: function(event) {
      if (this.isNewWork) {
        this.addWork(event);
      } else {
        this.updateWork(event);
      }
    },
    reset: function() {
      if (this.$route.params.workId) {
        Object.assign(this.formData, this.initialValues);
      } else {
        this.formData = {
          actors: [],
          awards: [],
          comments: "",
          corpus: [],
          description: "",
          edition: "",
          editionComment: "",
          found: "",
          interactionTypes: [],
          keywords: [],
          languages: [],
          location: "",
          media: [],
          mediaCharacteristics: [],
          medium: [],
          pageCount: null,
          pageEnd: "",
          pageStart: "",
          platforms: [],
          publicationNo: "",
          publisher: "",
          quotes: [],
          relations: [],
          relevance: 0,
          report: "",
          serie: "",
          synthesis: "",
          title: "",
          type: [],
          url: "",
          volumeNo: "",
          yearPublished: ""
        }
      }
    },
    cancel: function(event) {
      this.reset();
      this.$router.go(-1);
    },
    deleteWork: function(event) {
      if (confirm("Supprimer cette fiche? Cette opération est irréversible.")) {
        this.$store.dispatch('deleteWork', this.$route.params.workId);
        this.$router.push({ name: "Works" });
      }
    },
    addWork: function(event) {
      this.$store.dispatch('newWork', this.formData ).then(() => this.cancel());
    },
    updateWork: function() {
      this.$store.dispatch('updateWork', this.formData )
        .then(() => { this.cancel() } )
        .catch( () => { console.log("Oups!")});
    },
    addKeyword: function(newKeyword) {
      this.$store.commit('addKeyword', newKeyword);
      this.formData.keywords.push(newKeyword);
    },
    showHelp: function(subject) {
      alert("Implémentation pour bientôt!");
    },
    formatDate(date) {
      let monthName = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
      let d = new Date(date);
      return `${d.getDate()} ${monthName[d.getMonth()]} ${d.getFullYear()}`;
    }
  },
  created: function() {
    if (this.$route.params.workId) {
      this.isNewWork = false;
      this.formData = this.workById(this.$route.params.workId);
      Object.assign(this.initialValues, this.formData);
    } else {
      this.reset();
      this.formData.entryBy = this.currentUser;
    }
  }
}
</script>


<style lang="less" scoped>
  .quarter {
    width: 25%;
  }
</style>
