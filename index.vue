<template>
  <div class="container-fluid m-0 p-0">
    <top-navbar/>

    <div class="dummy-top" style="height: 60px;"></div>

    <section id="body" class="d-flex">

      <div class="left-panel px-3">
        <div class="switch">
          <div class="switch-control d-flex align-items-center">
            <span class="text">Delivery</span>
            <input type="checkbox" id="delivery-mode"
                   v-model="pickup"
                   class="d-none">
            <label for="delivery-mode" class="mx-3">
              <span class="button"></span>
            </label>
            <span class="text">Pickup</span>
          </div>
        </div>
        <!-- /.switch -->
        <div class="when-to-deliver mt-4">
          <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button"
                    @click.stop="setDeliveryTime(true)"
                    class="btn btn-when-to"
                    :class="{selected: deliverAsap}">ASAP</button>
            <button type="button"
                    @click.stop="setDeliveryTime(false)"
                    class="btn btn-when-to"
                    :class="{selected: deliverAsap === false }">Later
            </button>
          </div>
          <div v-if="laterDetails.date && laterDetails.time" class="deliver-on">
            {{ laterDetails.date }} | {{ laterDetails.time }}
          </div>
          <div
            v-if="showLaterDropdown"
            v-click-outside="clickOutsideLaterDropdown"
            class="later-dropdown d-flex">
            <div class="left">
              <button
                @click="updateLaterDetails({ date: 'Today', time: laterDetails.time })"
                :class="{ selected: laterDetails.date === 'Today'}">
                Today
              </button>
              <button
                @click="updateLaterDetails({ date: 'Tomorrow', time: laterDetails.time })"
                :class="{ selected: laterDetails.date === 'Tomorrow'}">
                Tomorrow
              </button>
              <button
                @click="updateLaterDetails({ date: moment().add(2, 'days').format('MMM DD ddd'), time: laterDetails.time })"
                :class="{ selected: laterDetails.date === moment().add(2, 'days').format('MMM DD ddd') }">
                {{ moment().add(2, 'days').format('MMM DD ddd') }}
              </button>
              <button
                @click="updateLaterDetails({ date: moment().add(3, 'days').format('MMM DD ddd'), time: laterDetails.time })"
                :class="{ selected: laterDetails.date === moment().add(3, 'days').format('MMM DD ddd') }">
                {{ moment().add(3, 'days').format('MMM DD ddd') }}
              </button>
              <button
                @click="updateLaterDetails({ date: moment().add(4, 'days').format('MMM DD ddd'), time: laterDetails.time })"
                :class="{ selected: laterDetails.date === moment().add(4, 'days').format('MMM DD ddd') }">
                {{ moment().add(4, 'days').format('MMM DD ddd') }}
              </button>
            </div>
            <!-- /.left -->
            <div class="right">
              <perfect-scrollbar class="times text-left" id="times">
                <div
                  v-for="time in timeList"
                  :key="'time' + time"
                  @click="updateLaterDetails({ date: laterDetails.date, time: time })"
                  class="time"
                  :class="{selected: time === laterDetails.time}">{{ time }}</div>
              </perfect-scrollbar>
              <img @click="scrollTime('up')" src="@/assets/images/arrow-up-calendar.svg" width="14" class="scrollUp" alt="">
              <img @click="scrollTime('down')" src="@/assets/images/arrow-down-calendar.svg" width="14" class="scrollDown" alt="">
            </div>
            <!-- /.right -->
          </div>
          <!-- /.later-dropdown -->
        </div>
        <!-- /.when-to-deliver -->
        <hr class="my-4">
        <h6>Category</h6>
        <perfect-scrollbar class="category-filter">
          <div
            v-for="(category, index) in categories"
            :key="category.cuisine_id"
            class="form-group m-0">
            <input
              @change="refeshData"
              :disabled="fetching"
              type="checkbox" :id="'category-' + index" v-model="category.on">
            <label :for="'category-' + index">{{ category.cuisine_name }} ( {{ category.merchants_count }} )</label>
          </div>
          <!-- /.form-group -->
        </perfect-scrollbar>
        <!-- /.category-filter -->
      </div>
      <!-- /.left-panel -->

      <div class="right-panel w-100" ref="rightPanel">
        <div class="d-flex justify-content-between">
          <div class="d-flex flex-wrap">
            <div class="total-results"><span>{{ rData.numberOfResults }}</span> Results</div>
            <div class="selected-categories d-flex">
              <transition-group name="animWidth" class="d-flex justify-content-start">
                <div
                  v-for="(c, index) in selectedCategories"
                  :key="c.cuisine_id"
                  class="selected-category">
                  {{ c.cuisine_name }}
                  <img src="@/assets/images/tag-remove.svg"
                       @click="deselectCategory(c.cuisine_name)"
                       class="ml-2" alt="">
                </div>
                <!-- /.selected-category -->
              </transition-group>
            </div>
            <!-- /.selected-categories -->
          </div>
          <!-- /.left -->

        </div>
        <div class="restaurant-cards w-100 mt-3">
          <div
            v-for="restaurant in restaurants"
            :key="restaurant.merchant_id"
            @click="$router.push(`/menu/${restaurant.restaurant_slug}`)"
            class="restaurant-card d-flex justify-content-between">
            <div class="left d-flex justify-content-between align-items-center">
              <div class="d-flex w-100">
                <div class="logo-wrapper">
                  <div class="logo d-flex justify-content-center align-items-center">
                    <img :src="restaurant.photo">
                  </div>
                </div>
                <div class="dummy ml-4 mr-3 w-100">
                  <h3>{{ restaurant.restaurant_name }}</h3>
                  <div class="d-flex flex-wrap">
                    <div
                      v-for="(cuisine, index) in restaurant.cuisines"
                      :key="cuisine.cuisine_id"
                      class="category">
                      {{ cuisine.cuisine_name }}<span v-if="index < restaurant.cuisines.length - 1">,&nbsp;</span>
                    </div>
                  </div>
                  <p class="address">{{ restaurant.address }}</p>
                </div>
                <!-- /.dummy -->
                <div class="open-or-not d-flex align-items-center pl-4 ml-auto">
                  <div style="width: 90px;">
                    <div v-if="restaurant.shop_status === 'Open'"><img src="@/assets/images/open.svg" alt=""></div>
                    <div v-else-if="restaurant.shop_status === 'Close'"><img src="@/assets/images/closed.svg" alt=""></div>
                    <div v-else class="d-flex align-items-center">
                      <img src="@/assets/images/time-clock.svg" alt="">
                      <div class="ml-2">
                        <div class="text">Opens at</div>
                        <p>{{ cutOpenAt(restaurant.shop_status) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- /.left -->
            <div class="right d-flex justify-content-between align-items-center">
              <div class="estimated-time">
                <h5>{{ restaurant.delivery_estimation }} min</h5>
                <p>Est. Time</p>
              </div>
              <!-- /.estimated-time -->
              <div class="distance">
                <h5>{{ restaurant.delivery_distance }}</h5>
                <p>Distance</p>
              </div>
              <!-- /.distance -->
              <div class="minimum-order">
                <h5 class="money">{{ restaurant.minimum_order }}</h5>
                <p>Min. Order</p>
              </div>
              <!-- /.minimum-order -->
              <div class="delivery-fee">
                <h5 class="money">{{ restaurant.delivery_charges }}</h5>
                <p>Delivery Fee</p>
              </div>
              <!-- /.delivery-fee -->
            </div>
            <!-- /.right -->
          </div>
          <!-- /.menu-card -->
          <content-placeholders v-if="fetching" style="min-height: 142px;">
            <div v-for="i in remaining()" class="d-flex justify-content-between">
              <content-placeholders-img style="width: 85px; height: 85px" />
              <content-placeholders-text :lines="3" style="width: calc(100% - 100px);" />
            </div>
          </content-placeholders>
          <div v-observe-visibility="bottomReached"></div>
        </div>
        <!-- /.menu-cards -->
        <div v-if="rData.to < rData.total" class="load-more-wrapper" :key="1">
          <transition name="fadeUp">
            <button
              @click="loadRestaurants"
              v-if="showLoadMore"
              class="load-more">Load more...</button>
          </transition>
        </div>
        <!-- /.load-more-wrapper -->
      </div>
      <!-- /.right-panel -->
    </section>
    <!-- /#body -->
  </div>
  <!-- /.container-fluid -->
</template>

<script>
  import TopNavbar from '@/components/top-navbar.vue'
  import footerPart from '@/components/footer-part.vue'
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  import ClickOutside from 'vue-click-outside'
  import moment from 'moment'
  import Vue from 'vue'
  Vue.prototype.moment = moment
  import axios from 'axios'

  import PerfectScrollbar from 'vue2-perfect-scrollbar'
  import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
  Vue.use(PerfectScrollbar)

  import VueObserveVisibility from 'vue-observe-visibility'
  Vue.use(VueObserveVisibility)

  import VueContentPlaceholders from 'vue-content-placeholders'
  Vue.use(VueContentPlaceholders)

  export default {
    name: "results",
    data () {
      return {
        fetching: false,
        componentName: this.$options.name,
        categories: [],
        showLaterDropdown: false,
        showLoadMore: false,
        quarterHours: [],
        restaurants: [],
        rData: {
          numberOfResults: null,
          currentPage: 0,
          lastPage: 0,
          total: 0,
          from: 0,
          to: 0,
        }
      }
    },
    created() {
      // data for deliver-later
      let quarterHours = ['00', '15', '30', '45']
      let hours = ['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']
      let timeList = []
      hours.forEach( h => {
        quarterHours.forEach( q => {
          timeList.push(h + ':' + q + ' am')
        })
      })
      hours.forEach( h => {
        quarterHours.forEach( q => {
          timeList.push(h + ':' + q + ' pm')
        })
      })
      this.quarterHours = timeList

      // load restaurants
      this.loadRestaurants()
    },
    methods: {
      refeshData () {
        this.restaurants = []
        this.rData = {
          numberOfResults: null,
          currentPage: 0,
          lastPage: 0,
          total: 0,
          from: 0,
          to: 0,
        }
        this.loadRestaurants()
      },
      remaining() {
        if (this.rData.total === 0) return 10
        return this.rData.total - this.rData.to
      },
      bottomReached() {
        // if (this.fetching) return false
        // this.loadRestaurants()
        setTimeout(() => {
          if (!this.fetching) {
            this.showLoadMore = true
          }
        }, 200)
      },
      loadRestaurants() {
        if (this.fetching) return false
        this.showLoadMore = false
        if (this.rData.currentPage > 0) {
          setTimeout(() => {
            this.$refs.rightPanel.scrollBy(0, 180)
          }, 100)
        }
        // get restaurant list
        if (this.rData.currentPage === this.rData.lastPage && this.rData.currentPage > 0) return false
        this.fetching = true

        const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }

        const postData = {
          latitude: this.userLocation.latitude,
          longitude: this.userLocation.longitude,
          filter_service_type: this.pickup ? 9 : 8,
          cuisine_type: this.selectedCategories.map(x => { return x.cuisine_id}).join(',')
        }

        axios({
          method: 'post',
          url: this.rData.currentPage === 0 ? '/search/merchants' : `/search/merchants?page=${this.rData.currentPage + 1}`,
          data: postData,
          headers: headers
        })
          .then(result => {
            this.restaurants.push(...result.data.data.merchants)
            if (!this.categories.length) {
              this.categories  = result.data.data.cuisines.map(x => {
                x.on = false
                return x
              })
            }
            this.rData.numberOfResults = result.data.meta.total
            this.rData.currentPage = result.data.meta.current_page
            this.rData.lastPage = result.data.meta.last_page
            this.rData.total = result.data.meta.total
            this.rData.from = result.data.meta.from
            this.rData.to = result.data.meta.to
          })
          .catch(e => {
            console.log(e)
          })
          .finally(() => {
            this.fetching = false
          })
      },
      cutOpenAt(str) {
        return str.split(' ').splice(2, 2).join(' ')
      },
      scrollTime(direction) {
        let timeDiv = this.$el.querySelector("#times");
        let timeTop = timeDiv.scrollTop
        if (direction === 'up') {
          timeDiv.scroll(0,timeTop + 10)
        } else {
          timeDiv.scroll(0,timeTop - 10)
        }
      },
      setDeliveryTime(context) {
        this.updateDeliverAsap(context)
        this.showLaterDropdown = !this.deliverAsap
        if (context) {
          this.updateLaterDetails({date: '', time: ''})
        }
      },
      clickOutsideLaterDropdown() {
        this.showLaterDropdown = false
        if (this.laterDetails.date === '' || this.laterDetails.time === '') {
          this.updateLaterDetails({date: '', time: ''})
          this.setDeliveryTime('asap')
        }
      },
      deselectCategory(name) {
        let i = this.categories.findIndex(c => {
          return c.cuisine_name === name
        })
        this.categories[i].on = false
        this.refeshData()
      },
      updateLaterDetails(value) {
        this.$store.commit('updateLaterDetails', value)
      },
      updateDeliverAsap(value) {
        this.$store.commit('updateDeliverAsap', value)
      }
    },
    computed: {
      deliverAsap() {
        return this.$store.state.deliverAsap
      },
      laterDetails() {
        return this.$store.state.laterDetails
      },
      timeList() {
        if (this.laterDetails.date === 'Today') {
          let now = new Date();
          let mins = now.getMinutes();
          let quarterHours = Math.round(mins/15);
          //now.setHours(now.getHours() + 1) // the next hour onwards
          if (quarterHours === 4)
          {
            now.setHours(now.getHours()+1);
          }
          let rounded = (quarterHours*15)%60;
          now.setMinutes(rounded);
          let firstQuarter = moment(now).format('hh:mm a')
          let timeArray = []
          let foundFirstQuarter = false
          this.quarterHours.forEach( t => {
            console.log(firstQuarter + ' = ' + t)
            if (!foundFirstQuarter) {
              if (t === firstQuarter) foundFirstQuarter = true
            } else {
              timeArray.push(t)
            }
          })
          return timeArray
        } else {
          return this.quarterHours
        }
      },
      selectedCategories() {
        return this.categories.filter(c => c.on);
      },
      userLocation() {
        return this.$store.getters.userLocation
      },
      pickup: {
        get () {
          return this.$store.state.pickup
        },
        set (value) {
          this.$store.commit('updatePickup', value)
        }
      },
      ...mapState([
        //'pickup'
      ]),
      ...mapGetters([]),
      ...mapMutations([]),
      ...mapActions([]),
    },
    watch : {
      pickup() {
        this.refeshData()
      }
    },
    components: {
      TopNavbar,
      footerPart,
    },
    directives: {
      ClickOutside
    }
  }
</script>

<style scoped lang="scss">
  // transitions

  // know-more
  .fadeUp-enter-active, .fadeUp-leave-active {
    -webkit-transition: all 0.7s;
    -moz-transition: all 0.7s;
    -ms-transition: all 0.7s;
    -o-transition: all 0.7s;
    transition: all 0.7s;
    opacity: 1;

    -webkit-transform: translateY(0);
    -moz-transform: translateY(0);
    -ms-transform: translateY(0);
    -o-transform: translateY(0);
    transform: translateY(0);
  }
  .fadeUp-enter, .fadeUp-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    -webkit-transform: translateY(20px);
    -moz-transform: translateY(20px);
    -ms-transform: translateY(20px);
    -o-transform: translateY(20px);
    transform: translateY(20px);
  }

  // cuisines
  .animWidth-enter-active, .animWidth-leave-active {
    transition: all .2s;
    transform-origin: left;
  }
  .animWidth-enter, .animWidth-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: scaleX(0);
  }
  
  
  * {
    font-family: 'Montserrat', sans-serif;
  }
  button {
    border: none;
    outline: none;
  }
  section#body {
    background-color: #F8F8F8;

    .money:before {
      content: '$';
    }

    p {
      margin: 0;
      padding: 0;
    }

    .left-panel {
      padding: 47px 43px !important;
      width: 305px;
      height: auto;
      background-color: #FCFCFC;

      border-right: 1px solid #e5e9f2;

      .switch {
        span.text {
          font-size: 16px;
          color: #747474;
        }

        label {
          width: 54px;
          height: 26px;
          -webkit-border-radius: 13px;
          -moz-border-radius: 13px;
          border-radius: 13px;
          border: solid 2px #d8d3d0;
          background-color: #d4f2e7;
          position: relative;
          -webkit-transform: translateY(5px);
          -moz-transform: translateY(5px);
          -ms-transform: translateY(5px);
          -o-transform: translateY(5px);
          transform: translateY(5px);
          cursor: pointer;

          .button {
            position: absolute;
            top: 2px;
            display: inline-block;
            width: 18px;
            height: 18px;
            -webkit-border-radius: 9px;
            -moz-border-radius: 9px;
            border-radius: 9px;
            background: #007585;
          }
        }

        input + label .button {
          margin-left: 3px;
          -webkit-transition: margin-left 0.3s;
          -moz-transition: margin-left 0.3s;
          -ms-transition: margin-left 0.3s;
          -o-transition: margin-left 0.3s;
          transition: margin-left 0.3s;
        }

        input:checked + label .button {
          margin-left: 30px;
        }
      }
      .when-to-deliver {
        position: relative;
        .btn-when-to {
          width: auto;
        }
        button {
          width: 138px;
          height: 30px;
          line-height: 10px;
          font-size: 14px;
          color: #007585;
          border: solid 2px #d8d3d0;
          background-color: #ffffff;
          padding: 6px 26px;
          position: relative;
          &.selected {
            background-color: #d4f2e7;
          }
        }
        .deliver-on {
          font-size: 14px;
          color: #747474;
          margin-top: 15px;
        }
        .later-dropdown {
          padding: 16px 22px;
          position: absolute;
          left: 100px;
          top: 54px;
          background: #ffffff;
          border: 2px solid #E5E9F2;
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
          -webkit-box-shadow: 6px 6px 10px 0 rgba(0, 0, 0, 0.29);
          -moz-box-shadow: 6px 6px 10px 0 rgba(0, 0, 0, 0.29);
          box-shadow: 6px 6px 10px 0 rgba(0, 0, 0, 0.29);
          cursor: default;
          z-index: 4000;
          &:before {
            content: '';
            position: absolute;
            width: 10px;
            height: 10px;
            background: #ffffff;
            display: block;
            left: 23px;
            top: -7px;
            -webkit-box-sizing: content-box;
            -moz-box-sizing: content-box;
            box-sizing: content-box;
            border: 2px solid #E5E9F2;
            border-right-color: transparent;
            border-bottom-color: transparent;
            -webkit-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            -o-transform: rotate(45deg);
            transform: rotate(45deg);
          }
          .left {
            margin-top: 8px;
            margin-right: 20px;
            padding-right: 20px;
            border-right: 1px solid #e5e9f2;
            button {
              font-size: 14px;
              &.selected {
                border-color: #007585;
                background-color: #007585;
                color: #fff;
              }
              &:not(:last-of-type) {
                margin-bottom: 9px;
              }
            }
          }
          .right {
            position: relative;
            .times {
              width: 110px;
              height: 166px;
              margin-top: 18px;
              overflow-x: hidden;
              overflow-y: auto;
              .time {
                font-size: 14px;
                color: #007585;
                font-weight: 500;
                line-height: 1.8;
                cursor: pointer;
                position: relative;
                &:after {
                  content: '';
                  position: absolute;
                  bottom: 5px;
                  right: 20px;
                  width: 18px;
                  height: 14px;
                }
                &.selected:after {
                  background: url("../../assets/images/check-calendar.svg") no-repeat center;
                  -webkit-background-size: contain;
                  background-size: contain;
                }
              }
            }
            .scrollUp {
              position: absolute;
              left: 25%;
              top: -6px;
              cursor: pointer;
            }
            .scrollDown {
              position: absolute;
              left: 25%;
              bottom: -8px;
              cursor: pointer;
            }
          }
        }
      }
      h6 {
        font-size: 18px;
        color: #747474;
        margin-bottom: 15px;
      }
      .category-filter {
        max-height: calc(100vh - 330px);
        overflow-y: auto;
        input {
          opacity: 0;
          cursor: pointer;
          position: relative;
        }
        input + label {
          position: relative;
          &:before {
            position: absolute;
            content: '';
            width: 20px;
            height: 20px;
            left: -29px;
            top: 3px;
            background: url("../../assets/images/checkbox.svg") no-repeat center;
            -webkit-background-size: cover;
            background-size: cover;
            -webkit-transition: all 0.3s;
            -moz-transition: all 0.3s;
            -ms-transition: all 0.3s;
            -o-transition: all 0.3s;
            transition: all 0.3s;
          }
          &:hover:before {
            background: url("../../assets/images/checkbox-hover.svg") no-repeat center;
          }
        }
        input:checked + label:before {
          background: url("../../assets/images/checked.svg") no-repeat center;
        }
        label {
          font-size: 16px;
          font-weight: 300;
          color: #747474;
          margin-left: 10px;
          cursor: pointer;
        }
      }
    }

    .right-panel {
      padding: 23px 31px;
      height: calc(100vh - 60px);
      overflow-x: auto;
      position: relative;

      .load-more-wrapper {
        width: 100%;
        text-align: center;
        button.load-more {
          position: absolute;
          margin-top: -30px;
          background: #006a7a;
          color: #ffffff;
          padding: 7px 25px;
          border: none;
          outline: none;
          -webkit-border-radius: 20px;
          -moz-border-radius: 20px;
          border-radius: 20px;
          -webkit-box-shadow: 6px 6px 10px 0 rgba(0, 0, 0, 0.29);
          -moz-box-shadow: 6px 6px 10px 0 rgba(0, 0, 0, 0.29);
          box-shadow: 6px 6px 10px 0 rgba(0, 0, 0, 0.29);
        }
      }

      .total-results {
        font-size: 20px;
        font-weight: 500;
        color: #747474;
        margin-right: 23px;
        span {
          color: #272b41;
        }
      }
      .selected-category {
        padding: 0 12px;
        background: #e7e7e7;
        -webkit-border-radius: 9px;
        -moz-border-radius: 9px;
        border-radius: 9px;
        margin-right: 10px;
        height: 26px;
        line-height: 26px;
        font-size: 14px;
        font-weight: 300;
        color: #747474;
        overflow: hidden;

        &:hover img {
          opacity: 1;
        }

        img {
          cursor: pointer;
          opacity: 0.7;
        }
      }
      .restaurant-card {
        padding: 21px 28px;
        background: #fff;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        margin-bottom: 10px;
        -webkit-box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.07);
        -moz-box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.07);
        box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.07);
        cursor: pointer;
        -webkit-transition: all 0.3s;
        -moz-transition: all 0.3s;
        -ms-transition: all 0.3s;
        -o-transition: all 0.3s;
        transition: all 0.3s;
        &:hover {
          -webkit-transform: translateY(-2px);
          -moz-transform: translateY(-2px);
          -ms-transform: translateY(-2px);
          -o-transform: translateY(-2px);
          transform: translateY(-2px);
          -webkit-box-shadow: 2px 3px 10px 0 rgba(0, 0, 0, 0.3);
          -moz-box-shadow: 2px 3px 10px 0 rgba(0, 0, 0, 0.3);
          box-shadow: 2px 3px 10px 0 rgba(0, 0, 0, 0.3);
        }
        .left {
          width: calc(50% - 30px);
          .logo {
            width: 85px;
            height: 85px;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 5px;
            background: #fff;
            img {
              max-width: 100%;
              max-height: 100%;
            }
          }
          h3 {
            font-size: 20px;
            font-weight: 600;
            color: #272b41;
          }
          .category, .address {
            font-size: 14px;
            font-weight: 300;
            line-height: 1.64;
            color: #747474;
          }
          .address {
            height: 22px;
            overflow: hidden;
          }
          .open-or-not {
            font-size: 12px;
            font-weight: 300;
            line-height: 1.92;
            color: #747474;
            width: 300px;
            p {
              font-weight: 500;
            }
          }
        }
        .right {
          width: calc(50% - 30px);
          h5 {
            font-size: 16px;
            line-height: 1.44;
            color: #272b41;
          }
          p {
            font-size: 14px;
            font-weight: 300;
            line-height: 1.64;
            color: #747474;
          }
        }
      }
    }
  }
</style>
