<template>
  <div class="nav-container" v-if="isLoggedIn">
    <div class="nav-content">
      <div class="logo">恋遇</div>
      <div class="nav-links">
        <router-link to="/home" class="nav-link">首页</router-link>
        <router-link to="/profile" class="nav-link">个人信息</router-link>
        <router-link to="/messages" class="nav-link message-link">
          消息
          <span v-if="unreadCount > 0" class="message-badge">{{ unreadCount }}</span>
        </router-link>
      </div>
      <button class="logout-btn" @click="logout">退出登录</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  data() {
    return {
      isLoggedIn: false,
      username: '',
      unreadCount: 0,
      messageCheckInterval: null
    };
  },
  created() {
    // 检查用户是否已登录
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.username = localStorage.getItem('username') || '';
    
    // 监听登录状态变化
    window.addEventListener('storage', this.checkLoginStatus);
    
    // 如果已登录，获取未读消息数量
    if (this.isLoggedIn) {
      this.fetchUnreadCount();
      // 设置定时获取未读消息数量
      this.messageCheckInterval = setInterval(() => {
        this.fetchUnreadCount();
      }, 30000); // 每30秒检查一次
    }
  },
  beforeUnmount() {
    // 移除事件监听器
    window.removeEventListener('storage', this.checkLoginStatus);
    // 清除定时器
    if (this.messageCheckInterval) {
      clearInterval(this.messageCheckInterval);
    }
  },
  methods: {
    checkLoginStatus() {
      const newLoginStatus = localStorage.getItem('isLoggedIn') === 'true';
      if (newLoginStatus !== this.isLoggedIn) {
        this.isLoggedIn = newLoginStatus;
        this.username = localStorage.getItem('username') || '';
        
        if (this.isLoggedIn) {
          this.fetchUnreadCount();
          // 设置定时获取未读消息数量
          this.messageCheckInterval = setInterval(() => {
            this.fetchUnreadCount();
          }, 30000);
        } else if (this.messageCheckInterval) {
          clearInterval(this.messageCheckInterval);
        }
      }
    },
    async fetchUnreadCount() {
      if (!this.username) return;
      
      try {
        const response = await fetch('http://localhost:8080/api/messages/unread/count', {
          headers: {
            'Username': this.username
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          this.unreadCount = data.count;
        }
      } catch (error) {
        console.error('获取未读消息数量失败', error);
      }
    },
    logout() {
      // 清除登录状态
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      this.isLoggedIn = false;
      // 清除定时器
      if (this.messageCheckInterval) {
        clearInterval(this.messageCheckInterval);
      }
      // 跳转到登录页
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.nav-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 240, 245, 0.95) 100%);
  box-shadow: 0 4px 15px rgba(233, 30, 99, 0.15);
  z-index: 1000;
  border-bottom: 1px solid rgba(233, 30, 99, 0.1);
  backdrop-filter: blur(10px);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  height: 70px;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 32px;
  font-weight: bold;
  color: #e91e63;
  font-family: 'Great Vibes', cursive;
  text-shadow: 2px 2px 4px rgba(233, 30, 99, 0.2);
  position: relative;
  padding: 0 10px;
  transition: all 0.3s ease;
}

.logo::before, .logo::after {
  content: '❤';
  position: absolute;
  font-size: 14px;
  color: rgba(233, 30, 99, 0.6);
  top: 5px;
}

.logo::before {
  left: -5px;
  transform: rotate(-15deg);
}

.logo::after {
  right: -5px;
  transform: rotate(15deg);
}

.logo:hover {
  transform: scale(1.05);
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  padding: 8px 0;
  font-size: 16px;
}

.nav-link:hover {
  color: #e91e63;
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  color: #e91e63;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #ff6b9d, #e91e63);
  border-radius: 3px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

.message-link {
  position: relative;
}

.message-badge {
  position: absolute;
  top: -8px;
  right: -12px;
  background: linear-gradient(135deg, #ff6b9d, #e91e63);
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 5px rgba(233, 30, 99, 0.3);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.logout-btn {
  background: linear-gradient(135deg, #ff6b9d 0%, #e91e63 100%);
  border: none;
  color: white;
  padding: 8px 20px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(233, 30, 99, 0.2);
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(233, 30, 99, 0.3);
}

.logout-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 5px rgba(233, 30, 99, 0.2);
}
</style>