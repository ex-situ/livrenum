<template>
  <div class="actorList">

    <div class="columns">
      <div class="column is-three-quarters is-offset-one-quarter">
        <div class="level">
          <div class="level-left">
            <h1 class="title">Créateurs
              <span v-if="actors.length == allActorsCount" class="subtitle">({{ allActorsCount }})</span>
              <span v-else class="subtitle">({{actors.length}}/{{ allActorsCount }})</span>
             </h1>
          </div>
          <div class="level-item">
            <div class="field has-addons">
              <p class="control">
                <button type="button" class="button is-default" :class="{'is-active':displayMode=='grid', 'is-primary':displayMode=='grid'}" @click="displayMode='grid'" disabled><span class="icon is-small"><i class="fa fa-th-large"></i></span></button>
              </p>
              <p class="control">
                <button type="button" class="button is-default" :class="{'is-active':displayMode=='list', 'is-primary':displayMode=='list'}" @click="displayMode='list'" disabled><span class="icon is-small"><i class="fa fa-list"></i></span></button>
              </p>
            </div>
          </div>
          <div class="level-right">
            <router-link type="button" class="button is-primary" :to="{name:'ActorAdd'}"><span class="icon is-small"><i class="fa fa-plus"></i></span><span>Nouveau créateur</span></router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column is-one-quarter">

        <div class="panel content is-small">

          <!-- Filtre sur le titre -->
          <div class="panel-heading">
            <span>Filtrer les créateurs</span>
          </div>
          <div class="panel-block">
            <p class="control has-icons-left">
              <input v-model="filters.actorName.value" class="input is-small is-fullwidth" type="search" placeholder="Nom" @input="updateFilter('actorName', filters.actorName.value)">
              <span class="icon is-small is-left">
                <i class="fa fa-filter"></i>
              </span>
            </p>
          </div>

          <!-- Filtre sur le type -->
          <div class="panel-heading">
            <span>Type</span>
          </div>
          <div class="panel-block">
            <div class="panel-body">
              <ul class="list-unstyled">
                <li><label><input type="radio" class="radio" name="actorType" value="" v-model="filters.actorType.value" @change="updateFilter('actorType', filters.actorType.value)"> Tous</label></li>
                <li><label><input type="radio" class="radio" name="actorType" value="people" v-model="filters.actorType.value" @change="updateFilter('actorType', filters.actorType.value)"> Personnes</label></li>
                <li><label><input type="radio" class="radio" name="actorType" value="organization" v-model="filters.actorType.value" @change="updateFilter('actorType', filters.actorType.value)"> Organisations</label></li>
              </ul>
            </div>
          </div>

        </div>

      </div>
      <div class="column">

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
                <router-link v-else :to="{ name:'Actor', params:{actorId:actor._id} }"><span class="icon is-small is-left"><i class="fa fa-user"></i></span><span> {{ actor.fullNameReverse }}</span><span v-if="actor.surname && !actor.useSurname"> ({{ actor.surname }})</span></router-link>
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
            <tr v-if="actors.length==0">
              <td colspan="6" class="is-muted has-text-centered"><p>Aucune entrée à afficher...</p></td>
            </tr>

          </tbody>
        </table>

      </div>
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'actors',
  data: function() {
    return {
      displayMode: 'list'
    }
  },
  computed: {
    ...mapState({
      filters: state => state.filters
    }),
    ...mapGetters({
      actors: 'filteredActors',
      allActorsCount: 'allActorsCount',
      worksByActorId: 'worksByActorId',
      rolesByWorkId: 'rolesByWorkId',
      typeIcon: 'typeIcon'
    })
  },
  methods: {
    actorRolesForWorkId(actorId, workId) {
      return this.rolesByWorkId(workId).find( (role) => role.id==actorId).roles;
    },
    ...mapActions({
      setFilter: 'setFilter',
      updateFilters: 'updateFilters'
    }),
    updateFilter(filterName, filterValue) {
      this.$store.dispatch('setFilter', {
        filterName: filterName,
        filterValue: filterValue
      })
    }
  },
  created() {
    this.$store.dispatch('updateFilters');
  }
}
</script>

<style lang="less" scoped>
</style>
