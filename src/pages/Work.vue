<template>
  <div v-if="work" class="work">

    <div class="columns">
      <div class="column is-three-quarters is-offset-one-quarter">

        <div class="level" style="display:inline-block; width:100%;">
          <span class="level-left">
            <span class="level-item">
              <div>
                <h1 class="title">
                  <span>{{ work.title }}</span>
                  <span v-if="work.yearPublished" class="is-size-6"> ({{ work.yearPublished }})</span>
                  <div v-if="work.type" class="is-size-6" style="margin-top: .3em;">
                    <span v-for="(type, index) in work.type">
                      <span class="icon is-small"><i :class="typeIcon(type)"></i></span> <span class="ucFirst">{{ type }}</span>&nbsp;
                    </span>
                  </div>
                </h1>
                <star-rating style="margin-top: .3em;" :rating="work.relevance" :read-only="true" :show-rating="false" :star-size="24"></star-rating>
              </div>
            </span>
          </span>
          <span class="level-right">
            <div class="level-item">
              <div class="field is-grouped">
                <span class="control">
                  <button type="button" class="button is-link is-default" @click="cancel"><span class="icon is-small prevent-underline"><i class="fa fa-arrow-left"></i></span><span class=" prevent-underline">Retour</span></button>
                </span>
                <span class="control">
                  <router-link class="button is-primary" :to="{name:'WorkEdit', params:{workId:work._id}}">
                    <span class="icon is-small"><i class="fa fa-pencil"></i></span><span>Modifier</span>
                  </router-link>
                </span>
              </div>
            </div>
          </span>
        </div>

      </div>
    </div>

    <div class="columns">
      <div class="column is-one-quarter">
        <!-- <a :href="coverUrl" target="_blank" >
          <img :src="coverUrl" style="width:100%;height:auto;">
        </a> -->

        <medialist v-model="work.media" mode="cover"></medialist>

        <div class="content is-small">
          <table class="table is-narrow">
            <tr v-if="work.publisher">
              <th>Éditeur</th>
              <td>{{ work.publisher }}</td>
            </tr>
            <tr v-if="work.location">
              <th>Lieu</th>
              <td>{{ work.location }}</td>
            </tr>
            <tr v-if="work.languages.length>0">
              <th>Langue(s)</th>
              <td><span class="ucFirst">{{ work.languages.join(', ')}}</span></td>
            </tr>
            <tr v-if="work.keywords.length>0">
              <th>Mots-clés</th>
              <td><span class="ucFirst">{{ work.keywords.join(', ') }}</span></td>
            </tr>
            <tr v-if="work.interactionTypes.length>0">
              <th>Interactions</th>
              <td><span class="ucFirst">{{ work.interactionTypes.join(', ') }}</span></td>
            </tr>
          </table>
        </div>
      </div>

      <div class="column">

        <div v-if="work.synthesis" class="content">
          <h1 class="title is-4">Synthèse</h1>
          <vue-markdown v-if="work.synthesis" :source="work.synthesis">{{ work.synthesis }}</vue-markdown>
        </div>

        <div v-if="work.description" class="content">
          <h1 class="title is-4">Description existante</h1>
          <vue-markdown :source="work.description">{{ work.description }}</vue-markdown>
        </div>

        <div v-if="work.report" class="content">
          <h1 class="title is-4">Compte-rendu critique</h1>
          <vue-markdown :source="work.report">{{ work.report }}</vue-markdown>
        </div>

        <div v-if="work.comments" class="content">
          <h1 class="title is-4">Commentaires</h1>
          <vue-markdown :source="work.comments">{{ work.comments }}</vue-markdown>
        </div>

        <div v-if="work.quotes.length>0" class="content">
          <h1 class="title is-4">Citations</h1>
          <blockquote v-for="quote in work.quotes" :key="quote._id"><vue-markdown :source="quote">{{ quote }}</vue-markdown></blockquote>
        </div>

      </div>
      <div class="column is-one-quarter">

        <div v-if="work.actors.length>0" class="panel content is-small">
          <div class="panel-heading">Créateurs</div>
          <div v-for="role in rolesByWorkId(work._id)" class="panel-block">
            <div class="has-text-top" style="width:50%;">
              <router-link v-if="role.fullName" :to="{name:'Actor', params:{actorId:role.id}}">
                <span class="icon is-small">
                  <i v-if="role.isOrganization" class="fa fa-users"></i>
                  <i v-else class="fa fa-user"></i>
                  </span> {{ role.fullNameReverse }}
              </router-link>
            </div>
            <div class="has-text-top ucFirst" style="width:50%;">{{ role.roles.join(', ') }}</div>
          </div>
        </div>

        <div v-if="work.relations.length>0" class="panel content is-small">
          <div class="panel-heading">Relations</div>
          <div v-for="relation in work.relations" class="panel-block">
            <span class="ucFirst">{{relation.relationType}}&nbsp;</span>
            <span><router-link :to="{name:'Work', params:{workId:relation.work}}">{{ workById(relation.work).title }}</router-link></span>
          </div>
        </div>

        <div v-if="work.awards.length>0" class="panel content is-small">
          <div class="panel-heading">Distinctions</div>
          <div v-for="award in work.awards" class="panel-block"><span class="icon is-small"><i class="fa fa-trophy"></i></span>&nbsp;{{ award }}</div>
        </div>

        <div v-if="work.media.length>1" class="panel content is-small">
          <div class="panel-heading">Médias</div>
          <div class="panel-block">
            <medialist v-model="work.media" :skipCover="true"></medialist>
          </div>
        </div>

      </div>
    </div>

    <div class="content is-small">
      <hr class="is-marginless">
      <div class="is-muted has-text-right">Fiche créée par {{ work.entryBy || "un utilisateur non spécifié" }} le {{ formatDate(work.entryCreated) }}</div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import StarRating from 'vue-star-rating'
import VueMarkdown from 'vue-markdown'
import Medialist from '@/components/Medialist'

export default {
  name: 'work',
  components: {
    StarRating, VueMarkdown, Medialist
  },
  data() {
    return {}
  },
  computed: {
    coverUrl: function() {
      return this.work.media.find( (m) => m.isCover === true)?this.work.media.find( (m) => m.isCover === true).url:'/static/assets/images/non-disponible.png';
    },
    ...mapGetters({
      work: 'currentWork',
      workById: 'workById',
      rolesByWorkId: 'rolesByWorkId',
      typeIcon: 'typeIcon'
    })
  },
  methods: {
    cancel: function(event) {
      this.$router.go(-1);
    },
    formatDate(date) {
      let monthName = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
      let d = new Date(date);
      return `${d.getDate()} ${monthName[d.getMonth()]} ${d.getFullYear()}`;
    }
  }
}
</script>

<style scoped>
</style>
