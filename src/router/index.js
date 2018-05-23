import Vue from 'vue'
import Router from 'vue-router'
import Works from '@/pages/Works'
import WorkForm from '@/pages/WorkForm'
import Work from '@/pages/Work'
import Actors from '@/pages/Actors'
import ActorForm from '@/pages/ActorForm'
import Actor from '@/pages/Actor'
import Home from '@/pages/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },{
      path: '/fiches',
      name: 'Works',
      component: Works
    },{
      path: '/fiches/:workId',
      name: 'Work',
      component: Work
    },{
      path: '/fiches/:workId/modification',
      name: 'WorkEdit',
      component: WorkForm
    },{
      path: '/fiches/ajout',
      name: 'WorkAdd',
      component: WorkForm
    },{
      path: '/createurs',
      name: 'Actors',
      component: Actors
    },{
      path: '/createurs/:actorId',
      name: 'Actor',
      component: Actor
    },{
      path: '/createurs/:actorId/modification',
      name: 'ActorEdit',
      component: ActorForm
    },{
      path: '/createurs/ajout',
      name: 'ActorAdd',
      component: ActorForm
    }
  ]
})
