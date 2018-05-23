<template>
  <div v-if="actor" class="actor">

    <div class="columns">
      <div class="column is-three-quarters is-offset-one-quarter">

        <div class="level">
          <span class="level-left">
            <span>
              <h1 v-if="actor.isOrganization" class="title"><span class="icon is-medium"><i class="fa fa-users"></i></span> {{ actor.fullName }}</h1>
              <span v-else>
                <h1 class="title"><span class="icon is-medium"><i class="fa fa-user"></i></span> {{ actor.fullName }}</h1>
                <h2 v-if="actor.surname && !actor.useSurname" class="subtitle is-5" style="margin-left:1.7em;">({{ actor.surname }})</h2>
              </span>
            </span>
          </span>
          <span class="level-right">
            <div class="field is-grouped">
              <span class="control"><button type="button" class="button is-link is-delault" @click="cancel"><span class="icon is-small"><i class="fa fa-arrow-left"></i></span><span>Retour</span></button></span>
              <span class="control"><router-link class="button is-primary" title="Modifier" :to="{name:'ActorEdit', params:{actorId:actor._id}}"><span class="icon is-small"><i class="fa fa-pencil"></i></span><span>Modifier</span></router-link></span>
            </div>
          </span>
        </div>

      </div>
    </div>

    <div class="columns">
      <div class="column is-one-quarter">
        <medialist v-model="actor.media" mode="cover"></medialist>
      </div>

      <div class="column">
        <div class="content">
          <vue-markdown v-if="actor.description">{{ actor.description }}</vue-markdown>
          <p class="text-muted" v-else>Description non disponible</p>
        </div>
      </div>

      <div class="column is-one-quarter">
        <WorkList v-if="works.length" :works="works" displayMode="panel" />
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import WorkList from '@/components/WorkList'
import Medialist from '@/components/Medialist'
import VueMarkdown from 'vue-markdown'
import StarRating from 'vue-star-rating'

export default {
  name: 'actor',
  components: {
    WorkList, Medialist, VueMarkdown, StarRating
  },
  data: function() {
    return {
    }
  },
  computed: {
    actor: function() {
      return this.actorById(this.$route.params.actorId);
    },
    works: function() {
      return this.worksByActorId(this.$route.params.actorId);
    },
    ...mapGetters({
      actorById: 'actorById',
      worksByActorId: 'worksByActorId'
    })
  },
  methods: {
    getRoles: (actors, actorId) =>  {
      return actors.reduce(function(roles, act) {
        return act.actor._id === actorId?[...roles, act.role]:roles;
      }, []).join(', ');
    },
    cancel: function(event) {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
</style>
