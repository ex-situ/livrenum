<template>
  <div class="medialist">

    <div class="modal" :class="{'is-active':modalActive}">
      <div class="modal-background"></div>
      <div class="modal-content">
        <p class="image">
          <img :src="modalSource">
        </p>
      </div>
      <button class="modal-close is-large" @click="modalActive=false"></button>
    </div>

  <!-- MODE ÉDITION -->
    <div v-if="mode=='edit'">
      <form @submit.prevent="addMedia">

        <div class="media-list">

          <!-- Entrées existantes -->
          <div v-for="(media, index) in curValue" class="media-item">
            <div class="media-slot">
              <figure class="thumbnail-wrapper">
                <div class="media-remove"><button type="button" class="button is-small is-danger" :data-index="index" @click.capture="removeMedia"><span class="icon is-small"><i class="fa fa-trash"></i></span></button></div>
                <label class="media-cover small">Couverture <input class="radio" type="radio" name="curCover" :data-index="index" :checked="index==curCover" @click="coverSelect"></label>
                <img v-if="media.url && media.validUrl" class="media-thumbnail" :src="media.url" @error.prevent />
              </figure>
              <div class="media-url"><input type="url" class="input is-small media-url" v-model="media.url" :data-index="index" @input="validateUrl" placeholder="URL" required></div>
            </div>

            <div class="media-title"><input type="text" v-model="media.title" placeholder="Titre" class="input is-small" @change="update" required></div>
            <div class="media-description"><textarea v-model="media.description" class="input is-small" style="resize:none;" @change="update">{{ media.description }}</textarea></div>
          </div>
          <hr v-if="curValue.length>0" />
          <div v-else>&nbsp;</div>

          <!-- Nouvelle entrée -->
          <div class="media-new-item">
            <div class="media-slot">
              <div class="thumbnail-wrapper"><img v-if="newUrl" class="media-thumbnail" :src="newUrl"></div>
              <div v-if="!newUrl">
                <div class="media-dropzone">
                  <uploader :uploadUrl="uploadUrl" @uploaded="uploaded" />
                </div>
              </div>
              <div class="media-url"><input type="url" class="input is-small media-url" v-model="newUrl" placeholder="URL" required></div>
            </div>

            <div class="media-title"><input type="text" v-model="newTitle" placeholder="Titre" class="input is-small" required></div>
            <div class="media-description"><textarea v-model="newDescription" class="input is-small" style="resize:none;" placeholder="Description">{{ newDescription }}</textarea></div>
            <div class="media-add has-text-right"><button type="submit" class="button is-small is-primary is-fullwidth" :disabled="!canAddMedia"><span class="icon is-small"><i class="fa fa-plus"></i></span><span>Ajouter</span></button></div>
          </div>

        </div>

      </form>
    </div>

    <!-- MODE AFFICHAGE -->
    <div v-if="mode=='show'">

      <div v-if="value.length>0" class="media-list">
        <!-- Ne pas afficher l'image désignée domme couverture -->
        <div v-if="skipCover" v-for="media in mediasLessCover" class="media-item">
          <figure>
            <a :href="media.url" target="_blank" @click.prevent="openModal"><img class="media-thumbnail" :src="media.url" :title="media.title"></a>
            <figcaption v-if="media.description" class="media-caption">{{ media.description }}</figcaption>
          </figure>
        </div>
        <!-- Afficher toutes les images (incluant la couverture) -->
        <div v-else v-for="media in value" class="media-item">
          <figure>
            <a :href="media.url" target="_blank" @click.prevent="openModal"><img class="media-thumbnail" :src="media.url" :title="media.title"></a>
            <figcaption v-if="media.description" class="media-caption">{{ media.description }}</figcaption>
          </figure>
        </div>
      </div>
      <p v-else class="text-muted">Aucun média associé</p>

    </div>

    <!-- MODE COUVERTURE -->
    <div v-if="mode=='cover'">
      <a :href="coverUrl" target="_blank" @click.prevent="openModal"><img :src="coverUrl" style="width:100%;height:auto;"></a>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import uploader from '@/components/uploader'

export default {
  name: 'medialist',
  components: {
    axios, uploader
  },
  data () {
    return {
      curValue: [],
      curCover: false,
      newUrl: "",
      newTitle: "",
      newDescription: "",
      editMode: true,
      modalActive: false,
      modalSource: ""
    }
  },
  computed: {
    mediasLessCover: function() {
      return this.value.filter( (m) => !m.isCover )
    },
    canAddMedia: function() {
      return this.newUrl != "" && this.newTitle != ""
    },
    coverUrl: function() {
      if (this.curCover >= 0) {
        return this.curValue[this.curCover].url;
      } else {
        return "/static/assets/images/non-disponible.png";
      }
    }
  },
  props: {
    value: {
      type: Array,
      default: [],
      required: true
    },
    uploadUrl: {
      type: String,
      default: ""
    },
    mode: {
      type: String,
      default: 'show'
    },
    skipCover: {
      type: Boolean,
      default: false
    },
    orientation: {
      type: String,
      default: 'horizontal'
    }
  },
  methods: {
    validateUrl(e) {
      axios.get(e.target.value)
      .then( response => {
        this.curValue[e.target.dataset.index].validUrl = true;
        return true;
      })
      .catch( error => {
        this.curValue[e.target.dataset.index].validUrl = false;
        return false;
      })
    },
    addMedia() {
      this.curValue.push({
        title: this.newTitle,
        url: this.newUrl,
        description: this.newDescription || "",
        isCover: false,
        validUrl: true
      });

      this.$emit('input', this.curValue)
      this.newTitle = "";
      this.newUrl = "";
      this.newDescription = "";
    },
    removeMedia(e) {
      let index = e.target.dataset.index || e.target.parentNode.dataset.index || e.target.parentNode.parentNode.dataset.index;
      this.curValue.splice(index, 1);
      this.update();
    },
    update() {
      let validValue = true
      this.curValue.forEach( (m) => {
        if (m.title == "" || m.url == "" || !m.validUrl) {
          validValue = false;
        }
      });

      if (validValue) {
        this.$emit('input', this.curValue);
      } else {
        console.log("Bug!");
      }
    },
    coverSelect(e) {
      this.curValue.forEach( (m) => { m.isCover = false; });

      if (this.curCover == e.target.dataset.index) {
        this.curCover = -1;
      } else {
        this.curCover = e.target.dataset.index;
        this.curValue[this.curCover].isCover = true;
      }

      this.update();
    },
    uploaded(url) {
      this.newUrl = url;
    },
    openModal(e) {
      this.modalSource = e.target.src;
      this.modalActive = true;
    }
  },
  created() {
    this.editMode = this.edit;
    this.curValue = this.value;
    this.curCover = this.value.findIndex( (m) => m.isCover === true);
  }
}
</script>

<style lang="less" scoped>
input[type="radio"] {
  margin-top: -1px;
  vertical-align: middle;
}

.medialist {
  width: 100%;
}
.media-list {
}
.media-item {
  padding-bottom: .25em;
  margin-bottom: 1em;

  &:hover .media-remove {
    display: block;
  }
}
.media-remove {
  display:  none;
  font-size: 65%;
  position: absolute;
  top: 5px;
  left: 5px;
}
.media-cover {
  position:  absolute;
  top: 5px;
  right: 5px;
  padding: 1px 1px 1px 5px;
  font-size: 80%;
  font-weight: bold;
  color: #fff;
  background-color: #333;
  opacity: .7;
  border-radius: 5px;
}
.media-slot {
  padding-bottom: .5em;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
}
.thumbnail-wrapper {
  margin: 0;
  padding: 0;
  margin-bottom: -6px;
  position:  relative;
  border-bottom:  none;
}
.media-thumbnail {
  height:  auto;
  width:  100%;
  padding: 0;
  margin: 0;
}
.media-dropzone {
  width: 100%;
  border: 1px #ccc solid;
  margin-bottom:  -1px;
}
.media-url > input {
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
}
.media-title > input {
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  border-bottom-width: .5px;
}
.media-description > textarea {
  height: 3rem;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
  border-top-width: .5px;
}
.media-caption {
}
.media-add {
  margin-top: 1em;
}
</style>
