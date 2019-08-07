<template>
  <at-card class="right-side-bar">
    
    <div class="row at-row topMargin"><div class="col-md-12 colWidth">
      <div class="at-box-row bg-c-brand-light Choose-Store-Location" >Store Selected</div>
    </div>
    </div>
     <div class="row at-row cardMargin">
        <at-card :no-hover="true" class="colWidth paddingIcon">
        <div class="row at-row">
        <div class="col-md-3 padTop"> 
         <i class="icon icon-map-pin iconSize"></i>
        </div>
        <div class="col-md-12 cardTitle">
         <b>San Digo</b>  <br /> 
         85 Harvard St, Bostan MA, 01255
        </div>
        <div class="col-md-1  iconBorder"> </div> 
        <div class="col-md-3 padTop"> 
         <i class="icon icon-edit iconSize"></i>
        </div>
        </div>
        </at-card>
    </div>
    <div class="row at-row rowmargin sepratorBorder"> </div>

    <div class="row at-row topMargin">
    <div class="col-md-12 colWidth">
      <div class="at-box-row bg-c-brand-light Choose-Store-Location" >Choose  Time</div>
    </div>
     </div>
    <div class="row at-row cardMargin">
        <at-card :no-hover="true" class="dateTimecolWidth paddingIcon">
        <div class="row at-row">
        <div class="col-md-8 padTop"> 
         <i class="icon icon-calendar iconSize"></i>
        </div>
        <div class="col-md-1 iconBorder"> </div>
        <div class="col-md-11 cardTitle datetimeTxtMargin">
         <b>Tomorrow</b>  
        </div>
        </div>
        </at-card>
        <at-card :no-hover="true" class="dateTimecolWidth paddingIcon">
        <div class="row at-row">
        <div class="col-md-8 padTop"> 
         <i class="icon icon-clock iconSize"></i>
        </div>
        <div class="col-md-1 iconBorder"> </div>
        <div class="col-md-11 cardTitle datetimeTxtMargin">
         <b>10:30</b>  
        </div>
        </div>
        </at-card>
    </div>
     <div class="row at-row rowmargin sepratorBorder"> </div>
      <div class="row at-row topMargin">
    <div class="col-md-12 colWidth">
      <div class="at-box-row bg-c-brand-light Choose-Store-Location" >Choose a Method</div>
    </div>
     </div>
      <div class="row at-row cardMargin">
        <at-card :no-hover="true" class="colWidth">
        <div class="col-md-12 colWidth cardTitle"><b>Pickup</b> </div>
        <div class="col-md-12 colWidth cardDesc">Pickup your order from <a>Santa Monica </a> </div>
        </at-card>
    </div>
    <div class="row at-row cardMargin">
        <at-card :no-hover="true" class="colWidth">
        <div class="col-md-12 colWidth cardTitle"><b>Delivery</b> </div>
        <div class="col-md-12 colWidth cardDesc">Delivery your Location  <a>Tomorrow 10:30 </a> </div>
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
     }
   
  }
}
</script>
