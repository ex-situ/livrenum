<template>
  <div class="works">

    <div class="columns">
      <div class="column is-three-quarters is-offset-one-quarter">
        <h1 class="title">Fiches
          <span v-if="works.length == allWorksCount" class="subtitle">({{ allWorksCount }})</span>
          <span v-else class="subtitle">({{works.length}}/{{ allWorksCount }})</span>
        </h1>
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <div class="field has-addons">
                <div class="control">
                  <a class="button is-static">Tri</a>
                </div>
                <div class="control">
                  <div class="select selSorting">
                    <select v-model="sorting">
                      <option value="titleAsc">Titre A → Z</option>
                      <option value="titleDesc">Titre Z → A</option>
                      <option value="yearAsc">Année vieux → récent</option>
                      <option value="yearDesc">Année récent → vieux</option>
                      <option value="relevanceAsc">Pertinence croissante</option>
                      <option value="relevanceDesc">Pertinence décroissante</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="level-item">
            <div class="field has-addons">
              <p class="control">
                <button type="button" class="button is-default" :class="{'is-active':displayMode=='grid', 'is-primary':displayMode=='grid'}" @click="displayMode='grid'"><span class="icon is-small"><i class="fa fa-th-large"></i></span></button>
              </p>
              <p class="control">
                <button type="button" class="button is-default" :class="{'is-active':displayMode=='list', 'is-primary':displayMode=='list'}" @click="displayMode='list'"><span class="icon is-small"><i class="fa fa-list"></i></span></button>
              </p>
            </div>
          </div>

          <div class="level-right">
            <router-link class="button is-primary" :to="{name:'WorkAdd'}"><span class="icon is-small"><i class="fa fa-plus"></i></span><span>Nouvelle fiche</span></router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column is-one-quarter">

      <!-- FILTRES -->
        <div class="panel content is-small">

          <!-- Filtre sur le titre -->
          <div class="panel-heading">
            <span>Filtrer les fiches</span>
          </div>
          <div class="panel-block">
            <p class="control has-icons-left">
              <input v-model="filters.workTitle.value" class="input is-small" type="search" placeholder="Titre" @input="updateFilter('workTitle', filters.workTitle.value || '')">
              <span class="icon is-small is-left">
                <i class="fa fa-filter"></i>
              </span>
            </p>
          </div>

          <!-- Filtres  -->
          <CheckboxFilter :value="filters.workCorpus" :itemCount="works.length" :showSortControls="false" label="Corpus" @input="updateFilter('workCorpus', filters.workCorpus.value)" @reset="resetFilter('workCorpus')" />
          <CheckboxFilter :value="filters.workType" :itemCount="works.length" :maxValues="50" label="Types" @input="updateFilter('workType', filters.workType.value)" @reset="resetFilter('workType')" />
          <CheckboxFilter :value="filters.workMedium" :itemCount="works.length" label="Supports" @input="updateFilter('workMedium', filters.workMedium.value)" @reset="resetFilter('workMedium')" />
          <CheckboxFilter :value="filters.workKeywords" :itemCount="works.length" label="Mots-clés" @input="updateFilter('workKeywords', filters.workKeywords.value)" @reset="resetFilter('workKeywords')" />
          <CheckboxFilter :value="filters.workMediaCharact" :itemCount="works.length" label="Caract. médiatiques" @input="updateFilter('workMediaCharact', filters.workMediaCharact.value)" @reset="resetFilter('workMediaCharact')" />
          <CheckboxFilter :value="filters.workInteractions" :itemCount="works.length" label="Types d'interactions" @input="updateFilter('workInteractions', filters.workInteractions.value)" @reset="resetFilter('workInteractions')" />
          <CheckboxFilter :value="filters.workLanguages" :itemCount="works.length" label="Langues" @input="updateFilter('workLanguages', filters.workLanguages.value)" @reset="resetFilter('workLanguages')" />

        </div>
      </div>

      <div class="column">
        <WorkList :works="works" :displayMode="displayMode" />
      </div>

    </div>

  </div>
</template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  import WorkList from '@/components/WorkList'
  import CheckboxFilter from '@/components/CheckboxFilter'

  export default {
    name: 'works',
    components: {
      WorkList, CheckboxFilter
    },
    data: function() {
      return {
        displayMode: 'grid',
        sorting: 'titleAsc'
      }
    },
    watch: {
      displayMode: function(mode) {
        this.$cookie.set('displayMode', mode);
      },
      sorting: function(s) {
        this.setSorting(s);
      }
    },
    computed: {
      ...mapState({
        filters: state => state.filters
      }),
      ...mapGetters({
        works: 'filteredWorks',
        allWorksCount: 'allWorksCount',
        typeIcon: 'typeIcon',
        rolesByWorkId: 'rolesByWorkId'
      })
    },
    methods: {
      ...mapMutations({
        setSort: 'setSort'
      }),
      ...mapActions({
        setFilter: 'setFilter',
        updateFilters: 'updateFilters',
        resetFilter: 'resetFilter'
      }),
      updateFilter(filterName, filterValue) {
        this.$store.dispatch('setFilter', {
          filterName: filterName,
          filterValue: filterValue
        })
      },
      resetFilter(filterName) {
        this.$store.dispatch('resetFilter', filterName)
      },
      setSorting(sorting) {
        this.sorting = sorting;
        switch(sorting) {
          case 'relevanceDesc':
            this.$store.commit('setSort', { col:'relevance', ascending:false});
            break;
          case 'relevanceAsc':
            this.$store.commit('setSort', { col:'relevance', ascending:true});
            break;
          case 'yearDesc':
            this.$store.commit('setSort', { col:'yearPublished', ascending:false});
            break;
          case 'yearAsc':
            this.$store.commit('setSort', { col:'yearPublished', ascending:true});
            break;
          case 'titleDesc':
            this.$store.commit('setSort', { col:'title', ascending:false});
            break;
          case 'titleAsc':
            this.$store.commit('setSort', { col:'title', ascending:true});
            break;
        }
      }
    },
    created() {
      this.displayMode = this.$cookie.get('displayMode')?this.$cookie.get('displayMode'):'grid';
      this.$store.dispatch('updateFilters');
    }
  }
</script>

<style lang="less" scoped>
</style>
