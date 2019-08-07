import Vue from 'vue'
import Router from 'vue-router'
import Location from './views/Location.vue'
import Storeselected from './views/Storeselected.vue'
import StoreselectedTime from './views/StoreselectedTime.vue'
import ChooseMethod from './views/ChooseMethod.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/location',
      name: 'location',
      component: Location
    },
    {
      path: 'storeselected',
      name: 'storeselected',
      component: Storeselected
    },
    {
      path: 'storeselectedTime',
      name: 'storeselectedTime',
      component: StoreselectedTime
    },
    {
      path: 'chooseMethod',
      name: 'chooseMethod',
      component: ChooseMethod
    },
    {
      path: '/*',
      redirect: { name: 'location' }
    }
  ],
  mode: 'abstract',
  linkActiveClass: 'active'
})
