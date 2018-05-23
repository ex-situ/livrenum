<template>
  <div class="actor-list">

    <!-- MODE LISTE -->
    <table class="table is-narrow">
      <thead>
        <tr>
          <th width="40%">Nom</th>
          <th width="55%">Créations</th>
          <th width="4%"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="actor in actors" class="actor-item">
          <td>
            <router-link v-if="actor.isOrganization" :to="{ name:'Actor', params:{actorId:actor._id} }"><span class="icon is-small is-left"><i class="fa fa-users"></i></span><span> {{ actor.name }}</span></router-link>
            <router-link v-else :to="{ name:'Actor', params:{actorId:actor._id} }"><span class="icon is-small is-left"><i class="fa fa-user"></i></span><span> {{ actor.fullNameReverse }}</span><span v-if="actor.surname"> ({{ actor.surname }})</span></router-link>
          </td>
          <td>
            <ul v-if="worksByActorId(actor._id).length>0" class="list-unstyled">
              <li v-for="work in worksByActorId(actor._id)">
                <router-link :to="{name:'Work', params:{workId:work._id}}">
                  <span v-for="type in work.type"><span class="icon is-small is-left"><i :class="typeIcon(type)"></i></span></span> <span>{{ work.title }}</span>
                </router-link>
                <span class="content is-small">({{ actorRolesForWorkId(actor._id, work._id).join(', ') }})</span>
              </li>
            </ul>
            <span class="is-muted" v-else>Aucune œuvre liée</span>
          </td>
          <td class="text-right">
            <router-link  class="button is-small is-primary is-outlined action" :to="{name:'ActorEdit', params:{actorId:actor._id}}"><span class="icon is-small"><i class="fa fa-pencil"></i></span></router-link>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- MODE GRID -->
    <div v-if="displayMode=='grid'" class="actors-container is-flex-desktop">
      <article v-for="actor in actors" class="media-item box">
        <div class="media">
          <figure class="media-left">
            <span class="image is-128x128 media-cover">
              <router-link :to="{ name:'Actor', params: {actorId:actor._id}}"><img :src="actor.cover.url" class="thumbnail"></router-link>
            </span>
          </figure>
          <div class="media-content">
              <div class="title is-5"><router-link :to="{ name:'Work', params: {workId:work._id}}">{{ work.title }}</router-link></div>
              <div class="subtitle is-6"><span v-for="(type,index) in work.type"><br v-if="index>0"><span class="icon is-small"><i :class="typeIcon(type)"></i></span> <span class="ucFirst">{{ type }}</span></span><span v-if="work.yearPublished">, {{ work.yearPublished }}</span>
                <star-rating :rating="work.relevance" :read-only="true" :show-rating="false" :star-size="16" style="margin-top: 5px;"></star-rating>
              </div>
              <div v-if="rolesByWorkId(work._id).length>0" class="content is-small">
                <span v-if="rolesByWorkId(work._id).length>1">Créateurs:</span>
                <span v-else>Créateur:</span>
                <span v-for="(creator, index) in creatorList(rolesByWorkId(work._id))"><router-link :to="{ name:'Actor', params:{actorId:creator.id} }">{{ creator.fullName }}</router-link><span v-if="index<rolesByWorkId(work._id).length-1">, </span></span>
              </div>
          </div>
          <div class="media-right">
            <router-link class="button is-small is-primary is-outlined media-action" :to="{name:'WorkEdit', params:{workId:work._id}}"><span class="icon is-small"><i class="fa fa-pencil"></i></span></router-link>
          </div>
        </div>
      </article>
    </div>

    <!-- MODE LISTE EN PANEL -->
    <!-- <div v-if="displayMode=='panel'">
      <div class="panel content is-small">
        <div class="panel-heading">Créations</div>
        <div v-for="work in works" class="panel-block">
          <div class="has-text-top" style="width:90%;">
            <router-link :to="{name:'Work', params:{workId:work._id}}">
              <span v-for="type in work.type" class="icon is-small">
                <i :class="typeIcon(type)"></i>
              </span>
              <span>{{ work.title }}</span>
            </router-link>
          </div>
          <div style="width:10%;"><span>{{ work.yearPublished }}</span></div>
        </div>
      </div>
    </div> -->

  </div>
</template>

<script>
  import Vue from 'vue';
  import { mapGetters } from 'vuex'
  import StarRating from 'vue-star-rating'

  export default {
    name: 'WorkList',
    components: {
      StarRating
    },
    data() {
      return {
      }
    },
    props: {
      works: {
        type: Array,
        required: true
      },
      displayMode: {
        type: String,
        default: 'list',
      }
    },
    computed: {
      ...mapGetters({
        typeIcon: 'typeIcon',
        rolesByWorkId: 'rolesByWorkId'
      })
    },
    methods: {
      creatorList(roles) {
        return roles.reduce(((acc, act) => [...acc, { id:act.id, fullName: act.fullName }] ), []);
      }
    }
  }
</script>

<style lang="less" scoped>
  .works-container {
    flex-wrap: wrap;
    align-items: stretch;
  }

  .media-item {
    margin-bottom: .5em !important;

    &:hover .media-action {
      display: block;
    }
  }

  @media screen and (min-width: 1000px) {
    .media-item {
      flex-basis: 48.5%;
      margin-left: .5em;
    }
  }

  @media screen and (min-width: 1000px) and (max-width: 1192px) {
    .media-item {
      .title, .subtitle {
        font-size: 90%;
      }
    }
  }

  .media-action {
    display: none;
  }

  .media-actions:hover .is-hidden {
    display: block !important;
  }

  .media-right {
    width: 1.8em;
  }

  .media-cover {
    overflow: hidden;
  }

</style>
