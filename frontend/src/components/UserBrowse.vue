<template>
  <div class="browse-container">
    <h2 class="browse-title">浏览用户</h2>
    
    <div class="swiper-container" v-if="users.length > 0">
      <div class="swiper-wrapper" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div 
          class="swiper-slide" 
          v-for="(user, index) in users" 
          :key="index"
          :class="{ 'active': currentIndex === index }"
        >
          <div class="user-card">
            <div class="user-avatar">
              <img v-if="user.photoUrl" :src="'http://localhost:8080' + user.photoUrl" alt="用户头像" />
              <div v-else class="avatar-placeholder">
                <span>{{ user.name ? user.name.charAt(0).toUpperCase() : '?' }}</span>
              </div>
            </div>
            
            <div class="user-info">
              <div class="user-header">
                <h3>{{ user.name || '未设置姓名' }}</h3>
                <div class="like-button" @click.stop="toggleLike(user)">
                  <i class="heart-icon" :class="{ 'liked': isUserLiked(user) }"></i>
                </div>
              </div>
              <div class="info-item" v-if="user.age">
                <span class="label">年龄:</span>
                <span class="value">{{ user.age }}岁</span>
              </div>
              <div class="info-item" v-if="user.education">
                <span class="label">学历:</span>
                <span class="value">{{ user.education }}</span>
              </div>
              <div class="info-item" v-if="user.height">
                <span class="label">身高:</span>
                <span class="value">{{ user.height }}cm</span>
              </div>
              <div class="info-item" v-if="user.weight">
                <span class="label">体重:</span>
                <span class="value">{{ user.weight }}kg</span>
              </div>
              <div class="info-item introduction" v-if="user.introduction">
                <span class="label">自我介绍:</span>
                <div class="value introduction-text" v-html="formatIntroduction(user.introduction)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 左右切换按钮 -->
      <button class="arrow-btn prev-btn" @click="prevUser" :disabled="currentIndex === 0">
        <span class="arrow">&lt;</span>
      </button>
      <button class="arrow-btn next-btn" @click="nextUser" :disabled="currentIndex === users.length - 1">
        <span class="arrow">&gt;</span>
      </button>
      
      <!-- 导航按钮 -->
      <div class="swiper-nav">
        <button class="nav-btn prev" @click="prevUser" :disabled="currentIndex === 0">
          <span>&lt;</span>
        </button>
        <div class="pagination">
          {{ currentIndex + 1 }} / {{ users.length }}
        </div>
        <button class="nav-btn next" @click="nextUser" :disabled="currentIndex === users.length - 1">
          <span>&gt;</span>
        </button>
      </div>
    </div>
    
    <div class="no-users" v-else>
      <p>暂无用户信息可浏览</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserBrowse',
  data() {
    return {
      users: [],
      currentIndex: 0,
      loading: false,
      error: null,
      currentUsername: '',
      likedUsers: {} // 用于存储用户喜欢状态的对象，键为用户ID，值为布尔值
    };
  },
  created() {
    // 获取当前登录用户名
    this.currentUsername = localStorage.getItem('username') || '';
    this.fetchAllUsers();
  },
  methods: {
    // 格式化自我介绍文本，处理富文本标记
    formatIntroduction(text) {
      if (!text) return '';
      
      // 处理Markdown风格的格式化
      let formattedText = text
        // 处理加粗
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // 处理斜体
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // 处理下划线
        .replace(/_(.*?)_/g, '<u>$1</u>')
        // 处理换行
        .replace(/\n/g, '<br>');
      
      return formattedText;
    },
    
    async fetchAllUsers() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:8080/api/users/all-profiles');
        // 过滤掉当前登录用户
        this.users = response.data.filter(user => {
          // 检查user对象结构并获取用户名
          const userUsername = user.user ? user.user.username : null;
          console.log('Filtering user:', userUsername, 'Current user:', this.currentUsername);
          return userUsername !== this.currentUsername;
        });
        // 从本地存储加载喜欢状态
        this.loadLikedUsers();
        this.loading = false;
      } catch (error) {
        console.error('获取用户列表失败', error);
        this.error = '获取用户列表失败，请稍后再试';
        this.loading = false;
      }
    },
    
    // 加载用户喜欢状态
    loadLikedUsers() {
      // 使用当前用户名作为前缀，确保每个用户的喜欢数据是独立的
      const likeKey = `likedUsers_${this.currentUsername}`;
      const savedLikes = localStorage.getItem(likeKey);
      if (savedLikes) {
        this.likedUsers = JSON.parse(savedLikes);
      }
    },
    
    // 保存用户喜欢状态到本地存储
    saveLikedUsers() {
      // 使用当前用户名作为前缀，确保每个用户的喜欢数据是独立的
      const likeKey = `likedUsers_${this.currentUsername}`;
      localStorage.setItem(likeKey, JSON.stringify(this.likedUsers));
    },
    
    // 切换用户喜欢状态
    async toggleLike(user) {
      // 确保正确获取用户ID和用户名
      const userId = user.id || (user.user && user.user.id);
      const username = user.user ? user.user.username : null;
      
      // 调试输出用户信息
      console.log('Toggle like for user:', user);
      console.log('User ID:', userId, 'Username:', username);
      
      if (!userId || !username) {
        console.error('无法获取用户ID或用户名');
        return;
      }
      
      // 切换喜欢状态
      const isLiked = !this.isUserLiked(user);
      this.likedUsers[userId] = isLiked;
      this.saveLikedUsers();
      
      // 如果是喜欢操作，调用后端API发送喜欢消息
      if (isLiked) {
        try {
          // 发送喜欢请求到后端
          const response = await axios.post(`http://localhost:8080/api/likes/send/${username}`, {}, {
            headers: {
              'Username': this.currentUsername
            }
          });
          
          console.log('喜欢消息已发送', response.data);
          
          // 如果互相喜欢，显示提示或执行其他操作
          if (response.data.isMutual) {
            console.log('互相喜欢！', response.data);
            // 这里可以添加互相喜欢的提示或其他操作
          }
          
          // 手动刷新消息中心
          // 如果在同一个应用中，可以通过事件总线或Vuex触发消息中心刷新
          // 这里简单地通过localStorage设置一个标记
          localStorage.setItem('refreshMessages', 'true');
        } catch (error) {
          console.error('发送喜欢消息失败', error.response ? error.response.data : error);
        }
      }
    },
    
    // 检查用户是否被喜欢
    isUserLiked(user) {
      const userId = user.id || (user.user && user.user.id);
      return userId ? !!this.likedUsers[userId] : false;
    },
    prevUser() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.animateSlide();
      }
    },
    nextUser() {
      if (this.currentIndex < this.users.length - 1) {
        this.currentIndex++;
        this.animateSlide();
      }
    },
    animateSlide() {
      // 添加滑动动画效果
      const slides = document.querySelectorAll('.swiper-slide');
      slides.forEach((slide, index) => {
        if (index === this.currentIndex) {
          slide.style.opacity = '1';
        } else {
          slide.style.opacity = '0.7';
        }
      });
    }
  }
};
</script>

<style scoped>
.browse-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.browse-title {
  text-align: center;
  color: #e91e63;
  margin-bottom: 30px;
}

.swiper-container {
  position: relative;
  overflow: hidden;
  padding: 20px 0;
}

.swiper-wrapper {
  display: flex;
  transition: transform 0.5s ease;
  width: 100%;
}

.swiper-slide {
  width: 100%;
  flex-shrink: 0;
  opacity: 1;
  transition: all 0.5s ease;
  position: relative;
}

.user-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(233, 30, 99, 0.2);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e91e63;
  color: white;
  font-size: 60px;
  font-weight: bold;
}

.user-info {
  width: 100%;
  text-align: center;
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}

.user-info h3 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.like-button {
  cursor: pointer;
  padding: 8px;
}

.heart-icon {
  display: inline-block;
  width: 30px;
  height: 30px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23e91e63" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>');
  background-repeat: no-repeat;
  background-position: center;
  transition: transform 0.3s ease, background-image 0.3s ease;
}

.heart-icon:hover {
  transform: scale(1.2);
}

.heart-icon.liked {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23e91e63" stroke="%23e91e63" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>');
  animation: heartBeat 0.5s ease-in-out;
}

@keyframes heartBeat {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.info-item {
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item.introduction {
  margin-top: 10px;
  flex-direction: column;
}

.info-item.introduction .label {
  margin-bottom: 5px;
}

.label {
  color: #666;
  font-weight: 500;
}

.value {
  color: #333;
  font-weight: 600;
}

.introduction-text {
  white-space: pre-wrap;
  line-height: 1.5;
  font-size: 14px;
  color: #555;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  max-height: 150px;
  overflow-y: auto;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
}

.introduction-text strong {
  color: #e91e63;
  font-weight: 600;
}

.introduction-text em {
  color: #3f51b5;
  font-style: italic;
}

.introduction-text u {
  text-decoration: underline;
  text-decoration-color: #ff9800;
  text-decoration-thickness: 2px;
}

.swiper-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

.nav-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e91e63;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s;
}

.nav-btn:hover:not(:disabled) {
  background-color: #c2185b;
}

.nav-btn:disabled {
  background-color: #f48fb1;
  cursor: not-allowed;
}

.pagination {
  margin: 0 15px;
  font-size: 16px;
  color: #666;
}

.arrow-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(233, 30, 99, 0.8);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.arrow-btn:hover:not(:disabled) {
  background-color: rgba(194, 24, 91, 1);
  transform: translateY(-50%) scale(1.1);
}

.arrow-btn:disabled {
  background-color: rgba(244, 143, 177, 0.8);
  cursor: not-allowed;
}

.prev-btn {
  left: -25px;
}

.next-btn {
  right: -25px;
}

.arrow {
  font-weight: bold;
}

.no-users {
  text-align: center;
  padding: 50px 0;
  color: #666;
  font-size: 18px;
}

@media (max-width: 600px) {
  .user-card {
    padding: 20px;
  }
  
  .user-avatar {
    width: 120px;
    height: 120px;
  }
  
  .user-info h3 {
    font-size: 20px;
  }
}
</style>