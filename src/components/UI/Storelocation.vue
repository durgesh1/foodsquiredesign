<template>
  <at-card class="right-side-bar">
    <div class="row at-row no-gutter">
      <div class="col-md-12">
      <div class="at-box-row bg-c-brand-dark" @click="goToTab('main')">
      <i class="icon icon-x iconSize"></i>
      </div>
      </div>
      <div class="col-md-12">
      <div class="at-box-row bg-c-brand-light right"></div>
      </div>
    </div>
    <div class="row at-row topMargin"><div class="col-md-12 colWidth">
      <div class="at-box-row bg-c-brand-light Choose-Store-Location" >Choose Store Location</div>
    </div>
    </div>
    <div class="row at-row">
        <div class="col-md-12 colWidth" @click="goToTab('storeselected')">
        <div class="at-box-row bg-c-brand-light" >
          <at-input v-model="inputValue" placeholder="Search for Location" class="textInput" icon="search" ></at-input>
        </div>
        </div>
    </div>
    <div class="row at-row">
        <at-card :no-hover="true" class="colWidth">
        <div class="col-md-12 colWidth cardTitle">Santa Monica </div>
        <div class="col-md-12 colWidth cardDesc">85 Harvard St, Bostan MA, 01255 </div>
        </at-card>
    </div>
     <div class="row at-row cardMargin">
        <at-card :no-hover="true" class="colWidth">
        <div class="col-md-12 colWidth cardTitle">Rosemont </div>
        <div class="col-md-12 colWidth cardDesc">85 Harvard St, Bostan MA, 01255 </div>
        </at-card>
    </div>
    <div class="row at-row cardMargin">
        <at-card :no-hover="true" class="colWidth">
        <div class="col-md-12 colWidth cardTitle">Los Angeles </div>
        <div class="col-md-12 colWidth cardDesc">85 Harvard St, Bostan MA, 01255 </div>
        </at-card>
    </div>
    <div class="row at-row cardMargin">
        <at-card :no-hover="true" class="colWidth">
        <div class="col-md-12 colWidth cardTitle">Costa Mesa </div>
        <div class="col-md-12 colWidth cardDesc">85 Harvard St, Bostan MA, 01255 </div>
        </at-card>
    </div>
    <div class="row at-row cardMargin">
        <at-card :no-hover="true" class="colWidth">
        <div class="col-md-12 colWidth cardTitle">San Digo </div>
        <div class="col-md-12 colWidth cardDesc">85 Harvard St, Bostan MA, 01255 </div>
        </at-card>
    </div>
   
</at-card>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      inputValue: ''
    }
  },
  props: ['data'],
  methods: {
    ...mapMutations([
      'removeTodo'
    ]),
    goToTab (tab) {
      if(tab ==='main'){
       this.$router.push({ name: '/' })
      }else{
        this.$router.push({ name: tab })
      }
      
    },
    handleRemove () {
      this.removeTodo(this.data.id)
      this.$Notify({
        title: 'The note was removed',
        type: 'info'
      })
    }
  }
}
</script>
