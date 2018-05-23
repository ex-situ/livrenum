<template>
  <div class="content">

    <h1 class="title">Version de développement de l'outil <i>Livre numérique</i></h1>

<!--     <div class="notification is-warning">
      <span class="icon"><i class="fa fa-exclamation-circle"></i></span>
      <span>Si vous ne pouvez consulter les fiches ou si elles ne s'affichent pas, <b>supprimez les cookies pour ce site</b> et tout devrait rentrer dans l'ordre. Il s'agit d'un problème avec une ancienne version des cookies qui peuvent toujours exister sur votre poste et empêcher le bon fonctionnement de l'application</span>
    </div>
 -->

    <p>Bienvenue sur la première version de l'outil <i>LivreNum</i>. Celle-ci est toujours en cours de développement et sera mise-à-jour périodiquement. Malgré le fait qu'il puisse y avoir quelques régressions de temps en temps, elle peut être considérée comme robuste.</p>
    <p>La présente page sera également mise à jour pour refléter l'état du développement de l'outil, il est donc important de prendre connaissance des informations s'y trouvant avant d'utiliser celui-ci. Les problèmes et limitations connus seront listés ci après dans le but de minimiser les signalements multiples d'un même problème.</p>
    <p>Merci pour votre participation et n'hésitez pas à me faire part de vos commentaires et questions directement via Slack ou en personne.</p>

    <h2 class="title is-4">Bon à savoir</h2>
    <ul>
      <li>Il n'est pas nécessaire de passer par la page d'ajout d'un créateur pour en ajouter un. Il est possible de le faire en même temps que l'ajout d'une fiche.</li>
      <li>Lors de la création d'une "relation" d'une fiche vers une autre, la relation inverse sera automatiquement créée.</li>
    </ul>

    <h2 class="title is-4">Fonctionnalités stables</h2>
    <ul>
      <li>Oeuvres</li>
      <ul>
        <li>Création, modification, suppression</li>
        <li>Affichage en liste ou en grille</li>
        <li>Filtrage par titre, corpus, type, support, mots-clés, caractéristiques médiatiques, types d'interactions et langue</li>
        <li>Médias associés (images seulement pour le moment) avec titre et description. Avec sélecteur d'image de couverture</li>
        <li>Les fiches sont liées aux créateurs (individus et organisations) et leurs rôles</li>
        <li>Possible de spécifier les créateurs principaux. Ce n'est pour l'instant pas pris en compte mais ça permettra, lorsqu'il y a des créateurs principaux pour les fiches, de ne présenter que ceux-ci dans les listes et autres affichages compacts (en plus des organisations qui seront toujours affichées prioritairement)</li>
        <li>Relations entre les fiches avec création automatique des relations réciproques</li>
      </ul>
      <li>Créateurs</li>
      <ul>
        <li>Création, modification, suppression</li>
        <li>Filtrage par nom et type</li>
        <li>Prise en charge de créateurs étant des individus ou des organisations</li>
        <li>Médias associés (images seulement pour le moment) avec titre et description. Avec sélecteur d'image de couverture</li>
        <li>Lien vers les oeuvres créées par le créateur</li>
      </ul>
    </ul>

    <h2 class="title is-4">Limitations et problèmes connus</h2>
    <ul>
      <li>Problème intermittent avec les filtres des fiches lors du rafraîchissement de la page. Simplement qu'à saisir un caractère et à l'effacer pour corriger</li>
      <li>Les gabarits visuels ne sont pas dans leur version finale et évoluent en s'inspirant du <a href="/static/assets/Ensemble_v2.pdf" target="_blank">document de référence actuel</a>. Le thème visuel actuel (polices, contrôles et couleurs) est celui par défaut du <a href="http://bulma.io" target="_blank">framework CSS Bulma</a> qui utilise les icônes de <a href="http://fontawesome.io/icons/" target="_blank">Font Awesome</a>.</li>
      <li>Tous les champs ne sont pas encore intégrés <strike>aux formulaires et</strike> aux pages d'affichage</li>
      <li>Les formulaires sont actuellement statiques (pas d'adaptation des champs affichés en fonction d'autres entrées) et la validation des champs est minimale</li>
      <li>L'ajout de médias aux fiches ne fonctionne pour l'instant que par <i>glisser-déposer</i> ou saisie d'un URL existant et <u>n'accepte que les images</u></li>
      <li>Il n'est pour le moment pas possible d'utiliser l'outil sur un mobile ou une tablette</li>
    </ul>

    <h2 class="title is-4">Technologies utilisées</h2>
    <ul>
      <li>HTML5, CSS3, ECMAScript 6</li>
      <li>NodeJS, Express, Babel</li>
      <li><a href="https://vuejs.org/" target="_blank">Vue</a> + <a href="https://vuex.vuejs.org/" target="_blank">Vuex</a> + <a href="https://router.vuejs.org/" target="_blank">Vue-router</a></li>
      <li><a href="https://www.mongodb.com/" target="_blank">MongoDB</a>, <a href="http://mongoosejs.com/" target="_blank">Mongoose</a></li>
      <li><a href="https://github.com/mzabriskie/axios" target="_blank">Axios</a><strike>, <a href="https://socket.io/" target="_blank">Socket.io</a></strike></li>
      <li><a href="http://bulma.io" target="_blank">Bulma</a>, <a href="http://fontawesome.io/icons/" target="_blank">Fonts Awesome</a></li>
    </ul>

  </div>
</template>

<script>
export default {
  name: 'home'
}
</script>
