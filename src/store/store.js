import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueCookie from 'vue-cookie';

Vue.use(Vuex)

const serverAddress = 'http://starbuck.ex-situ.info/api';

function StringFilter(getterName, fieldName) {
  this.value = "";
  this.state = "";
  this.getterName = getterName;
  this.fieldName  = fieldName;
}

function CheckboxFilter(getterName, fieldName) {
  this.value  = [];
  this.state  = [];
  this.getterName = getterName;
  this.fieldName  = fieldName;
}

const state = {
  works: [],
  actors: [],
  currentUser: "",
  uploadUrl: "",

  worksSort: {
    col: 'title',
    ascending: true
  },

  filters: {
    workTitle        : new StringFilter  ('filteredWorks', 'title'),
    workCorpus       : new CheckboxFilter('filteredWorks', 'corpus'),
    workType         : new CheckboxFilter('filteredWorks', 'type'),
    workMedium       : new CheckboxFilter('filteredWorks', 'medium'),
    workMediaCharact : new CheckboxFilter('filteredWorks', 'mediaCharacteristics'),
    workInteractions : new CheckboxFilter('filteredWorks', 'interactionTypes'),
    workKeywords     : new CheckboxFilter('filteredWorks', 'keywords'),
    workLanguages    : new CheckboxFilter('filteredWorks', 'languages'),
    actorName        : new StringFilter  ('filteredActors', 'fullName'),
    actorType        : new StringFilter  ('filteredActors', 'type')
  },

  allowedType: [
    'animation',
    'application',
    'article',
    'atlas',
    'bande dessinée',
    'bande dessinée numérique',
    'bande dessinée papier',
    'court métrage',
    'documentaire',
    'encyclopédie',
    'enquête',
    'essai',
    'exposition',
    'fiction interactive',
    'film',
    'guide',
    'illustration',
    'installation artistique',
    'jeu vidéo',
    'livre numérique',
    'livre papier',
    'mémoire',
    'monographie',
    'ouvrage collectif',
    'ouvrage de référence',
    'peinture',
    'périodique',
    'présentation',
    'roman graphique',
    'thèse'
  ],

  allowedLanguages: [
    'allemand',
    'anglais',
    'arabe',
    'chinois',
    'coréen',
    'espagnol',
    'finnois',
    'français',
    'hindi',
    'inuktitut',
    'indonésien',
    'italien',
    'japonais',
    'latin',
    'néerlandais',
    'portugais',
    'russe',
    'serbe',
    'suédois',
    'thaï'
  ],

  allowedMediaCharacteristics: [
    "animation",
    "enregistrement de voix",
    "environnement 3D",
    "illustration",
    "images animées",
    "localisation",
    "photogrammétrie",
    "photographies",
    "réalité augmentée",
    "réalité virtuelle",
    "son",
    "texte",
    "video"
  ],

  allowedInteractions: [
    "activation de contenu",
    "déplacement physique",
    "déplacement/glissement de contenu",
    "interaction app. num./app. num.",
    "interaction livre/appareil numérique",
    "manipulation du livre papier",
    'navigation 3D - première personne',
    'navigation 3D - troisième personne',
    "navigation libre",
    "navigation linéaire",
    "navigation à choix multiples",
    "participatif de contenu",
    "rotation appareil"
  ],

  allowedMedia: [
    "application - console",
    "application - ordinateur",
    "application - smartphone",
    "application - smartwatch",
    "application - tablette",
    "document",
    "installation",
    "objet physique",
    "papier",
    "canevas",
    "web"
  ],

  availableThemes: [
    "affliction psychologique",
    "amour",
    "amour courtois",
    "bonheur",
    "curiosité",
    "douleur",
    "démesure",
    "exagération",
    "exploit chevaleresque",
    "gens en marges de la société",
    "humanité",
    "héros miséreux",
    "industrialisation",
    "irrégularité",
    "joie",
    "l'histoire",
    "liberté",
    "mort",
    "ouverture",
    "quête du savoir",
    "rationnalité",
    "recherche de la perfection",
    "ridicule",
    "science",
    "souffrance",
    "surcharge",
    "surnaturel",
    "transgression des limites",
    "trivialité",
    "vie",
    "vie vulgaire",
    "équilibre"
  ],

  availableKeywords: [
  ],

  typeIcon: {
    'animation':'film',
    'application':'cogs',
    'article':'file-text-o',
    'atlas':'globe',
    'bande dessinée':'comments-o',
    'bande dessinée numérique':'comments-o',
    'bande dessinée papier':'comments-o',
    'court métrage':'film',
    'documentaire':'film',
    'encyclopédie':'book',
    'enquête':'search',
    'essai':'file-text-o',
    'exposition':'institution',
    'fiction interactive':'code-fork',
    'film':'film',
    'guide':'hand-pointer-o',
    'illustration':'picture-o',
    'installation artistique':'cubes',
    'jeu vidéo':'gamepad',
    'livre numérique':'book',
    'livre papier':'book',
    'mémoire':'file-text-o',
    'monographie':'book',
    'ouvrage collectif':'users',
    'ouvrage de référence':'book',
    'peinture':'paint-brush',
    'périodique':'calendar',
    'présentation':'area-chart',
    'roman graphique':'comments-o',
    'thèse':'file-text-o'
  }
}

const getters = {
  allWorksCount: (state) => state.works.length,
  workById: (state) => (workId) => state.works.find(function(e) { return e._id === workId } ),
  currentWork: (state) => state.works.find(function(e) { return e._id === state.route.params.workId } ),
  sortedWorks: (state) => {
    if (state.worksSort.ascending)
      return state.works.sort((a, b) => String(a[state.worksSort.col]).localeCompare( String(b[state.worksSort.col]) ));
    else
      return state.works.sort((a, b) => String(a[state.worksSort.col]).localeCompare( String(b[state.worksSort.col]) )).reverse();
  },
  filteredWorks: (state, getters) => getters.sortedWorks.filter( (work) => {
    // Filtre sur le titre
    if (state.filters.workTitle) {
      if (work.title.toLowerCase().indexOf(state.filters.workTitle.state.toLowerCase()) == -1) {
        return false;
      }
    }

    // Filtre sur le corpus
    if (state.filters.workCorpus.value.length > 0) {
      let corpusMatch = true;
      state.filters.workCorpus.value.forEach( (corpus) => {
        if (!work.corpus.includes(corpus))
          corpusMatch = false;
      });
      if (!corpusMatch)
        return false;
    }

    // Filtre sur le type
    if (state.filters.workType.value.length > 0) {
      let typeMatch = true;
      state.filters.workType.value.forEach( (type) => {
        if (!work.type.includes(type))
          typeMatch = false;
      });
      if (!typeMatch)
        return false;
    }

    // Filtre sur le support
    if (state.filters.workMedium.value.length > 0) {
      let mediumMatch = true;
      state.filters.workMedium.value.forEach( (medium) => {
        if (!work.medium.includes(medium))
          mediumMatch = false;
      });
      if (!mediumMatch)
        return false;
    }

    // Filtre sur les mots-clés
    if (state.filters.workKeywords.value.length > 0) {
      let keywordsMatch = true;
      state.filters.workKeywords.value.forEach( (keyword) => {
        if (!work.keywords.includes(keyword))
          keywordsMatch = false;
      });
      if (!keywordsMatch)
        return false;
    }

    // Filtre sur les caractéristiques médiatiques
    if (state.filters.workMediaCharact.value.length > 0) {
      let mediaCharactMatch = true;
      state.filters.workMediaCharact.value.forEach( (mc) => {
        if (!work.mediaCharacteristics.includes(mc))
          mediaCharactMatch = false;
      });
      if (!mediaCharactMatch)
        return false;
    }

    // Filtre sur les interactions
    if (state.filters.workInteractions.value.length > 0) {
      let interactionMatch = true;
      state.filters.workInteractions.value.forEach( (interaction) => {
        if (!work.interactionTypes.includes(interaction))
          interactionMatch = false;
      });
      if (!interactionMatch)
        return false;
    }

    // Filtre sur la langue
    if (state.filters.workLanguages.value.length > 0) {
      let languageMatch = true;
      state.filters.workLanguages.value.forEach( (language) => {
        if (!work.languages.includes(language))
          languageMatch = false;
      });
      if (!languageMatch)
        return false;
    }

    return true;
  }),

  allActorsCount: (state) => state.actors.length,
  actorById: (state) => (actorId) => state.actors.find(function(e) { return e._id === actorId}),
  actorByName: (state) => (fullName) => state.actors.find(function(e) {return e.fullName === fullName}),
  sortedActors: (state) => state.actors.sort((a, b) => a.fullNameReverse.localeCompare(b.fullNameReverse)),
  filteredActors: (state, getters) => getters.sortedActors.filter( (actor) => {
    // Filtre sur le nom
    if (state.filters.actorName) {
      if (actor.fullName.toLowerCase().indexOf(state.filters.actorName.value.toLowerCase()) == -1) {
        return false;
      }
    }

    // Filtre sur le type
    if (state.filters.actorType.value == 'people' && actor.isOrganization) {
      return false;
    } else {
      if (state.filters.actorType.value == 'organization' && !actor.isOrganization) {
        return false;
      }
    }

    return true;
  }),
  worksByActorId: (state) => (actorId) => state.works.reduce(function(acc, val) {
    let matches = val.actors.filter(function(fItem) { return fItem.actor._id === actorId; }).length;
    return matches>0?[...acc, val]:acc;
  }, []).sort( (a,b) => b.yearPublished - a.yearPublished),
  rolesByWorkId: (state, getters) => (workId) => {
    let roles = [];   // { id: "", fullName: "", isOrganization: false, roles: [""] }
    getters.workById(workId).actors.forEach(function(actor) {
      let role = roles.findIndex((e) => e.id == actor.actor._id);
      if (role != -1){
        roles[role].roles.push(actor.role);
      } else {
        roles.push({ id:actor.actor._id, fullName:actor.actor.fullName, fullNameReverse:actor.actor.fullNameReverse, isOrganization: actor.actor.isOrganization, roles:[actor.role]});
      }
    });


    return roles
    .sort( (a, b) => {
      return b.fullNameReverse.localeCompare(a.fullNameReverse);
    })
    .sort( (a, b) => {
      if (a.isOrganization && !b.isOrganisation)
        return 1
      if (a.isOrganization && b.isOrganisation || !a.isOrganization && !b.isOrganisation)
        return 0
      if (!a.isOrganization && b.isOrganisation)
        return -1
    })
    .reverse();
    ;
  },
  typeIcon: (state) => (type) => {
    return `fa fa-${state.typeIcon[type]}`
  },
  knownTitles: (state) => state.works.reduce(function(acc, val) {
    return acc.includes(val.title)?acc:[...acc, val.title];
  }, []),
  knownPublishers: (state, getters) => getters.sortedActors.reduce(function(acc, val) {
    return val.isOrganization?[...acc, val.fullName]:acc;
  }, []),
  knownLocations: (state) => state.works.reduce(function(acc, val) {
    return acc.includes(val.location)?acc:[...acc, val.location];
  }, []),
  knownActors: (state, getters) => getters.sortedActors.reduce(function(acc, val) {
    return [...acc, val.fullName ];
  }, []),

  sortedThemes: (state) => state.availableThemes.sort((a, b) => a.localeCompare(b)),
  sortedKeywords: (state) => state.availableKeywords.sort((a, b) => a.localeCompare(b)),

  getFilterState: (state, getters) => (filterName) => {
    let fieldName = state.filters[filterName].fieldName;
    let getterName = state.filters[filterName].getterName;

    switch(true) {
      // CheckboxFilter
      case state.filters[filterName] instanceof CheckboxFilter:
        let values = [];
        getters[getterName].forEach( element => {
          element[fieldName].forEach( fieldValue => {
            let valueIndex = values.findIndex( v => v.value == fieldValue);
            if (valueIndex != -1) {
              values[valueIndex].count += 1;
            } else {
              values.push( { value:fieldValue, count:1 } );
            }
          });
        });

        return values.sort((a, b) => a.value.localeCompare(b.value));
        break;

      // StringFilter
      case state.filters[filterName] instanceof StringFilter:
        return String(state.filters[filterName].value);
        break;

      default:
        console.log("Erreur lors de la détection du type de filtre!");
    }
  }
}

const mutations = {
  setUploadUrl(state, uploadUrl) {
    state.uploadUrl = uploadUrl;
  },
  setCurrentUser(state, username) {
    state.currentUser = username;
  },

  // WORKS _______________________________________________________________
  getWorks(state, works) {
    state.works = works;
  },
  newWork(state, newWork) {
    state.works.push(newWork);
  },
  updateWork(state, updatedWork) {
    state.works.splice(state.works.findIndex(function(doc) {
      return doc._id === updatedWork._id;
    }), 1, updatedWork);
  },
  deleteWork(state, workId) {
    state.works.splice(state.works.findIndex(function(doc) {
      return doc._id === workId;
    }), 1);
  },

  // ACTORS _______________________________________________________________
  getActors(state, actors) {
    state.actors = actors;
  },
  newActor(state, newActor) {
    state.actors.push(newActor);
  },
  updateActor(state, updatedActor) {
    state.actors.splice(state.actors.findIndex(function(act) {
      return act._id === updatedActor._id;
    }), 1, updatedActor);
  },
  deleteActor(state, actorId) {
    state.actors.splice(state.actors.findIndex(function(act) {
      return act._id === actorId;
    }), 1);
  },

  // SORT___________________________________________________________________
  // Works
  setSort(state, sorting) {
    state.worksSort = sorting;
  },

  // FILTER_________________________________________________________________
  setFilter(state, payload) {
    // payload = {filterName, filterValue, filterState}
    state.filters[payload.filterName].value = payload.filterValue;
    state.filters[payload.filterName].state = payload.filterState;

    if (state.filters[payload.filterName] instanceof CheckboxFilter) {
      VueCookie.set(payload.filterName, payload.filterValue.join(','));
    } else {
      VueCookie.set(payload.filterName, payload.filterValue);
    }
  },

  // VOCABULAIRE CONTRÔLÉ
  // Ajout aux listes ouvertes
  addTheme(state, newTheme) {
    state.availableThemes.push(newTheme);
  },
  addKeyword(state, newKeyword) {
    state.availableKeywords.push(newKeyword);
  }
}

const actions = {
  // WORKS
  getWorks: (context) => {
    axios.get(`${serverAddress}/works`)
    .then(function(res) {
      context.commit('getWorks', res.data);
    })
    .catch(function(err) {
      console.log(`Erreur: ${err}`);
    });
  },
  newWork: (context, newWork) => {
    return new Promise((resolve, reject) => {
      axios.post(`${serverAddress}/works`, newWork)
      .then(function(res) {
        context.commit('newWork', res.data);
        resolve();
      })
      .catch(function(err) {
        console.log(err);
        reject();
      });
    });
  },
  updateWork: (context, updatedWork) => {
    return new Promise((resolve, reject) => {
      axios.put(`${serverAddress}/works/${updatedWork._id}`, updatedWork)
      .then(function(res) {
        context.commit('updateWork', res.data);
        resolve();
      })
      .catch(function(err) {
        console.log(err);
        reject();
      })
    });
  },
  deleteWork: (context, workId) => {
    return new Promise((resolve, reject) => {
      axios.delete(`${serverAddress}/works/${workId}`)
      .then(function(res) {
        context.commit('deleteWork', workId);
        resolve();
      })
      .catch(function(err) {
        console.log(err);
        reject();
      })
    });
  },

  // ACTORS
  getActors: (context) => {
    axios.get(`${serverAddress}/actors`)
    .then(function(res) {
      context.commit('getActors', res.data);
    })
    .catch(function(err) {
      console.log(`Erreur: ${err}`);
    });
  },
  newActor: (context, newActor) => {
    return new Promise((resolve, reject) => {
      axios.post(`${serverAddress}/actors`, newActor)
      .then(function(res) {
        context.commit('newActor', res.data);
        resolve();
      })
      .catch(function(err) {
        console.log(err);
        reject();
      });
    });
  },
  updateActor: (context, updatedActor) => {
    return new Promise((resolve, reject) => {
      axios.put(`${serverAddress}/actors/${updatedActor._id}`, updatedActor)
      .then(function(res) {
        context.commit('updateActor', res.data);
        resolve();
      })
      .catch(function(err) {
        console.log(err);
        reject();
      });
    });
  },
  deleteActor: (context, actorId) => {
    return new Promise((resolve, reject) => {
      axios.delete(`${serverAddress}/actors/${actorId}`)
      .then(function(res) {
        context.commit('deleteActor', actorId);
        resolve();
      })
      .catch(function(err) {
        console.log(err);
        reject();
      });
    });
  },

  // FILTRES
  updateFilters: (context, but) => {
    Object.keys(context.state.filters).forEach( (f) => {
      if (f != but) {
        let value;
        if (context.state.filters[f] instanceof CheckboxFilter) {
          value = VueCookie.get(f)?VueCookie.get(f).split(','):[];
        } else {
          value = VueCookie.get(f)?VueCookie.get(f):"";
        }

        context.commit('setFilter', {
          filterName: f,
          filterValue: value,
          filterState: context.getters.getFilterState(f)
        });
      }
    });
  },

  setFilter: (context, payload) => {
    context.commit('setFilter', {
      filterName: payload.filterName,
      filterValue: payload.filterValue,
      filterState: context.getters.getFilterState(payload.filterName)
    });

    context.dispatch('updateFilters', payload.filterName);
  },

  resetFilter: (context, filterName) => {
    let value = context.state.filters[filterName] instanceof CheckboxFilter?[]:"";

    context.commit('setFilter', {
      filterName: filterName,
      filterValue: value,
      filterState: context.getters.getFilterState(filterName)
    });

    context.dispatch('updateFilters');
  }
}

export default new Vuex.Store( {
  state,
  getters,
  mutations,
  actions
});
