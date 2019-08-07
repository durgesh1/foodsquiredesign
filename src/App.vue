<template>
  <div id="app">
    <!-- access root props via $root -->
    <at-button type="primary"
      native-type="submit" v-if="$root.title" style="text-align: center"  name="edit" @click="goToTab('location')">
      {{ $root.title }}
    </at-button>
    <router-view />
  </div>
</template>

<script>
export default {
  props: ['title'],
  data () {
    return {
      activeTab: ''
    }
  },
  created () {
    this.activeTab = this.$route.name
  },
  methods: {
    goToTab (tab) {
      this.$router.push({ name: tab })
    }
  },
  watch: {
    '$route.name' () {
      this.activeTab = this.$route.name
    }
  }
}

</script>
