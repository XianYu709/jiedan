<template>
  <div class="home-container">
    <h1 class="title">恋遇</h1>
    <div class="browse-section">
      <UserBrowse />
    </div>
  </div>
</template>

<script>
import UserBrowse from './UserBrowse.vue';

export default {
  name: 'HomeComponent',
  components: {
    UserBrowse
  }
}
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.title {
  font-size: 64px;
  color: #e91e63;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 30px;
}

.browse-section {
  width: 100%;
  max-width: 800px;
}
</style>