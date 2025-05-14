<template>
  <div class="login-container">
    <div class="form-container">
      <h2>{{ isLogin ? '登录' : '注册' }}</h2>
      
      <div class="form-group">
        <label for="username">用户名</label>
        <input 
          type="text" 
          id="username" 
          v-model="username" 
          placeholder="请输入用户名"
        />
      </div>
      
      <div class="form-group">
        <label for="password">密码</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          placeholder="请输入密码"
        />
      </div>
      
      <div class="error-message" v-if="errorMessage">
        {{ errorMessage }}
      </div>
      
      <button class="submit-btn" @click="submitForm">{{ isLogin ? '登录' : '注册' }}</button>
      
      <div class="toggle-form">
        <span @click="toggleForm">{{ isLogin ? '没有账号？点击注册' : '已有账号？点击登录' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginComponent',
  data() {
    return {
      username: '',
      password: '',
      isLogin: true,
      errorMessage: ''
    };
  },
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin;
      this.errorMessage = '';
    },
    async submitForm() {
      // 表单验证
      if (!this.username || !this.password) {
        this.errorMessage = '用户名和密码不能为空';
        return;
      }
      
      try {
        const endpoint = this.isLogin ? '/api/users/login' : '/api/users/register';
        await axios.post(`http://localhost:8080${endpoint}`, {
          username: this.username,
          password: this.password
        });
        
        // 登录/注册成功
        this.errorMessage = '';
        
        // 如果是登录成功，设置登录状态和用户名并跳转到主页
        if (this.isLogin) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('username', this.username);
          this.$router.push('/home');
        } else {
          // 如果是注册成功，切换到登录页面
          this.isLogin = true;
          this.errorMessage = '注册成功，请登录';
        }
      } catch (error) {
        // 处理错误
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = '服务器错误，请稍后再试';
        }
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath fill='%23E91E63' fill-opacity='0.05' d='M30 30 L30 0 M30 30 L60 30 M30 30 L30 60 M30 30 L0 30 M30 30 L60 0 M30 30 L60 60 M30 30 L0 60 M30 30 L0 0'/%3E%3C/svg%3E");
  z-index: -1;
  opacity: 0.6;
}

.form-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 30px rgba(233, 30, 99, 0.2);
  border: 1px solid rgba(233, 30, 99, 0.1);
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.8s ease-out;
}

.form-container::before {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(255, 105, 180, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  z-index: -1;
}

.form-container::after {
  content: '';
  position: absolute;
  bottom: -50px;
  left: -50px;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(147, 112, 219, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  z-index: -1;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #e91e63;
  font-family: 'Pacifico', cursive;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(233, 30, 99, 0.2);
}

.form-group {
  margin-bottom: 25px;
  position: relative;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

input {
  width: 100%;
  padding: 15px;
  border: 2px solid rgba(233, 30, 99, 0.2);
  border-radius: 12px;
  font-size: 16px;
  background-color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

input:focus {
  outline: none;
  border-color: #e91e63;
  box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.error-message {
  color: #f44336;
  margin: 15px 0;
  font-size: 14px;
  font-weight: 500;
  padding: 10px;
  border-radius: 8px;
  background-color: rgba(244, 67, 54, 0.1);
  border-left: 3px solid #f44336;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #ff6b9d 0%, #e91e63 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 15px rgba(233, 30, 99, 0.3);
  position: relative;
  overflow: hidden;
}

.submit-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.5s ease;
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(233, 30, 99, 0.4);
}

.submit-btn:hover::after {
  left: 100%;
}

.toggle-form {
  text-align: center;
  margin-top: 25px;
  font-size: 15px;
}

.toggle-form span {
  color: #e91e63;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  padding-bottom: 2px;
}

.toggle-form span::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #ff6b9d, #e91e63);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.toggle-form span:hover {
  color: #c2185b;
}

.toggle-form span:hover::after {
  transform: scaleX(1);
}
</style>