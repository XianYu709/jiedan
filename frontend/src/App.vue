<template>
  <Navigation />
  <div class="main-content">
    <router-view/>
  </div>
</template>

<script>
import Navigation from './components/Navigation.vue';

export default {
  name: 'App',
  components: {
    Navigation
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Dancing+Script:wght@600&family=Pacifico&family=Great+Vibes&display=swap');

body {
  margin: 0;
  padding: 0;
  font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background-color: #fafafa;
  background-image: 
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='none' stroke='%23FFB6C1' stroke-width='1' d='M50,10 C55,10 60,15 60,20 C60,25 55,30 50,30 C45,30 40,25 40,20 C40,15 45,10 50,10 Z M50,30 C55,30 60,35 60,40 C60,45 55,50 50,50 C45,50 40,45 40,40 C40,35 45,30 50,30 Z'/%3E%3C/svg%3E"),
    linear-gradient(135deg, rgba(255, 182, 193, 0.15) 0%, rgba(147, 112, 219, 0.15) 100%);
  background-attachment: fixed;
  color: #333;
  position: relative;
  overflow-x: hidden;
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath fill='%23E91E63' fill-opacity='0.05' d='M20 0 L20 40 M0 20 L40 20 M10 10 L30 30 M30 10 L10 30'/%3E%3C/svg%3E");
  z-index: -2;
  opacity: 0.3;
}

* {
  box-sizing: border-box;
}

.main-content {
  padding-top: 70px; /* 为导航栏留出空间 */
  min-height: 100vh;
  position: relative;
  animation: fadeIn 0.8s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 全局按钮样式 */
button {
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ff6b9d 0%, #e91e63 100%);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(233, 30, 99, 0.2);
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(233, 30, 99, 0.3);
}

button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 5px rgba(233, 30, 99, 0.2);
}

/* 全局输入框样式 */
input, textarea, select {
  border-radius: 12px;
  border: 1px solid rgba(233, 30, 99, 0.3);
  padding: 12px 18px;
  transition: all 0.3s ease;
  font-family: 'Montserrat', sans-serif;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: #e91e63;
  box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.15), 0 2px 10px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

/* 装饰元素 */
.main-content::before {
  content: '';
  position: fixed;
  top: 0;
  right: 0;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 105, 180, 0.1) 0%, transparent 70%);
  z-index: -1;
  animation: pulse 15s infinite alternate;
}

.main-content::after {
  content: '';
  position: fixed;
  bottom: 0;
  left: 0;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(147, 112, 219, 0.1) 0%, transparent 70%);
  z-index: -1;
  animation: pulse 15s infinite alternate-reverse;
}

/* 添加浮动爱心装饰 */
.main-content::before, .main-content::after {
  content: '';
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: -1;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.05); opacity: 0.7; }
  100% { transform: scale(1); opacity: 0.5; }
}

/* 全局卡片样式 */
.card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(233, 30, 99, 0.1);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

/* 标题样式 */
h1, h2, h3 {
  font-weight: 700;
  color: #e91e63;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

h1 {
  font-family: 'Great Vibes', cursive;
  font-size: 3.5rem;
}

h2 {
  font-family: 'Pacifico', cursive;
  font-size: 2.5rem;
}
</style>