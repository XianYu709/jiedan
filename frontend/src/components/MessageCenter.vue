<template>
  <div class="message-center">
    <h2 class="title">约见中心</h2>
    
    <!-- 消息类型选择 -->
    <div class="message-tabs">
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'all' }" 
        @click="setActiveTab('all')"
      >
        全部约见
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'like' }" 
        @click="setActiveTab('like')"
      >
        喜欢消息
        <span v-if="unreadLikeCount > 0" class="badge">{{ unreadLikeCount }}</span>
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'meet' }" 
        @click="setActiveTab('meet')"
      >
        约见安排
      </button>
    </div>
    
    <!-- 喜欢消息列表 -->
    <div class="message-list" v-if="activeTab === 'like' && filteredMessages.length > 0">
      <div 
        v-for="message in filteredMessages" 
        :key="message.id"
        class="message-item"
        :class="{ 'unread': !message.read }"
        @click="handleMessageClick(message)"
      >
        <!-- 喜欢消息 -->
        <div v-if="message.messageType === 'LIKE'" class="like-message">
          <div class="message-avatar">
            <div class="avatar-placeholder">
              <span>{{ message.sender.name ? message.sender.name.charAt(0).toUpperCase() : message.sender.username.charAt(0).toUpperCase() }}</span>
            </div>
          </div>
          <div class="message-content">
            <div class="message-header">
              <span class="sender-name">{{ message.sender.name || message.sender.username }}</span>
              <span class="message-time">{{ formatTime(message.createdAt) }}</span>
            </div>
            <p class="message-text">{{ message.content }}</p>
            <div class="message-actions" v-if="!message.read">
              <button class="action-btn view-profile" @click.stop="viewProfile(message.sender.username)">
                查看资料
              </button>
              <button class="action-btn like-back" @click.stop="likeBack(message.sender.username, $event)">
                喜欢Ta
              </button>
              <button class="action-btn skip" @click.stop="markAsRead(message.id)">
                略过
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 约见安排列表 -->
    <div v-if="activeTab === 'meet' || activeTab === 'all'" class="meeting-list">
      <div v-if="conversations.length > 0">
        <div 
          v-for="conversation in conversations" 
          :key="conversation.id"
          class="conversation-item"
          @click="selectConversation(conversation)"
        >
          <div class="conversation-avatar">
            <div class="avatar-placeholder">
              <span>{{ getOtherUserInfo(conversation, 'name').charAt(0).toUpperCase() }}</span>
            </div>
          </div>
          <div class="conversation-content">
            <div class="conversation-header">
              <span class="other-name">{{ getOtherUserInfo(conversation, 'name') }}</span>
              <span class="conversation-time">{{ formatTime(conversation.lastMessageTime) }}</span>
            </div>
            <p class="conversation-text">点击安排约见时间（万达广场）</p>
          </div>
        </div>
      </div>
      <div v-else class="no-conversations">
        <p>暂无约见对话，先去喜欢其他用户吧</p>
      </div>
    </div>
    
    <!-- 约见时间安排组件 -->
    <div v-if="selectedConversation" class="meeting-arrangement-container">
      <button class="back-btn" @click="selectedConversation = null">返回列表</button>
      <MeetingArrangement :conversationId="selectedConversation.id" />
    </div>
    
    <!-- 无消息提示 -->
    <div class="no-messages" v-if="activeTab === 'like' && filteredMessages.length === 0">
      <p>暂无喜欢消息</p>
    </div>
    
    <!-- 用户资料弹窗 -->
    <div class="profile-modal" v-if="showProfileModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeProfileModal">&times;</button>
        <h3 class="modal-title">✨ 用户资料 ✨</h3>
        <div v-if="selectedProfile" class="profile-info">
          <div class="profile-avatar-container">
            <div class="profile-avatar">
              <img v-if="selectedProfile.photoUrl" :src="'http://localhost:8080' + selectedProfile.photoUrl" alt="用户头像" />
              <div v-else class="avatar-placeholder">
                <span>{{ selectedProfile.name ? selectedProfile.name.charAt(0).toUpperCase() : '?' }}</span>
              </div>
            </div>
            <div class="avatar-decoration"></div>
          </div>
          <h4 class="profile-name">{{ selectedProfile.name || '未设置姓名' }}</h4>
          <div class="profile-details">
            <div class="detail-item" v-if="selectedProfile.age">
              <span class="label">年龄:</span>
              <span class="value">{{ selectedProfile.age }}岁</span>
            </div>
            <div class="detail-item" v-if="selectedProfile.education">
              <span class="label">学历:</span>
              <span class="value">{{ selectedProfile.education }}</span>
            </div>
            <div class="detail-item" v-if="selectedProfile.height">
              <span class="label">身高:</span>
              <span class="value">{{ selectedProfile.height }}cm</span>
            </div>
            <div class="detail-item" v-if="selectedProfile.weight">
              <span class="label">体重:</span>
              <span class="value">{{ selectedProfile.weight }}kg</span>
            </div>
            <div class="detail-item introduction" v-if="selectedProfile.introduction">
              <span class="label">自我介绍:</span>
              <div class="value introduction-text" v-html="formatIntroduction(selectedProfile.introduction)"></div>
            </div>
          </div>
          <div class="profile-actions">
            <button class="action-btn like-back" @click="likeBack(selectedUsername)">
              <span class="btn-icon">❤️</span> 喜欢Ta
            </button>
            <button class="action-btn skip" @click="closeProfileModal">
              关闭
            </button>
          </div>
        </div>
        <div v-else class="loading-profile">
          <div class="loading-spinner"></div>
          加载中...
        </div>
      </div>
    </div>
    
    <!-- 互相喜欢提示弹窗 -->
    <div class="mutual-like-modal" v-if="showMutualLikeModal">
      <div class="modal-content mutual-like-content">
        <div class="hearts-decoration">
          <span class="heart heart1">❤</span>
          <span class="heart heart2">❤</span>
          <span class="heart heart3">❤</span>
        </div>
        <h3 class="modal-title congratulation">恭喜！你们互相喜欢了对方</h3>
        <p class="mutual-like-subtitle">现在可以开始安排约见了</p>
        <p class="meeting-instruction">在约见安排中，你们无法聊天，但可以发送自己有空的时间段，系统将匹配双方都有空的时间安排在万达广场见面。</p>
        <div class="modal-actions">
          <button class="action-btn primary" @click="goToMeetingArrangement">
            <span class="btn-icon">📅</span> 安排约见
          </button>
          <button class="action-btn secondary" @click="closeMutualLikeModal">
            稍后再说
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import MeetingArrangement from './MeetingArrangement.vue';

export default {
  name: 'MessageCenter',
  components: {
    MeetingArrangement
  },
  data() {
    return {
      messages: [],
      conversations: [],
      activeTab: 'all',
      username: '',
      showProfileModal: false,
      selectedProfile: null,
      selectedUsername: '',
      showMutualLikeModal: false,
      mutualLikeConversationId: null,
      selectedConversation: null
    };
  },
  computed: {
    filteredMessages() {
      if (this.activeTab === 'all') {
        return this.messages;
      } else if (this.activeTab === 'like') {
        return this.messages.filter(msg => msg.messageType === 'LIKE');
      } else if (this.activeTab === 'chat') {
        return this.messages.filter(msg => msg.messageType === 'CHAT');
      }
      return this.messages;
    },
    unreadLikeCount() {
      return this.messages.filter(msg => msg.messageType === 'LIKE' && !msg.read).length;
    }
  },
  created() {
    this.username = localStorage.getItem('username') || '';
    this.fetchMessages();
    
    // 设置定时器，定期刷新消息
    this.messageRefreshInterval = setInterval(() => {
      this.fetchMessages();
      this.fetchConversations();
    }, 30000); // 每30秒刷新一次
    
    // 监听localStorage变化
    window.addEventListener('storage', this.handleStorageChange);
  },
  
  beforeUnmount() {
    // 清除定时器
    if (this.messageRefreshInterval) {
      clearInterval(this.messageRefreshInterval);
    }
    
    // 移除事件监听
    window.removeEventListener('storage', this.handleStorageChange);
  },
  methods: {
    async fetchMessages() {
      try {
        console.log('正在获取消息...');
        const response = await axios.get('http://localhost:8080/api/messages/all', {
          headers: {
            'Username': this.username
          }
        });
        this.messages = response.data;
        console.log('获取到消息:', this.messages);
        
        // 检查并清除刷新标记
        if (localStorage.getItem('refreshMessages') === 'true') {
          localStorage.removeItem('refreshMessages');
        }
      } catch (error) {
        console.error('获取消息失败', error);
      }
    },
    
    async fetchConversations() {
      try {
        const response = await axios.get('http://localhost:8080/api/messages/conversations/meet', {
          headers: {
            'Username': this.username
          }
        });
        this.conversations = response.data;
      } catch (error) {
        console.error('获取对话失败', error);
      }
    },
    
    // 处理localStorage变化
    handleStorageChange(event) {
      if (event.key === 'refreshMessages' && event.newValue === 'true') {
        console.log('检测到消息刷新请求');
        this.fetchMessages();
      }
    },
    setActiveTab(tab) {
      this.activeTab = tab;
      this.selectedConversation = null;
    },
    formatTime(timestamp) {
      if (!timestamp) return '';
      
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        // 今天
        return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      } else if (diffDays === 1) {
        // 昨天
        return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      } else if (diffDays < 7) {
        // 一周内
        const days = ['日', '一', '二', '三', '四', '五', '六'];
        return '星期' + days[date.getDay()] + ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      } else {
        // 更早
        return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) + ' ' + 
               date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      }
    },
    async handleMessageClick(message) {
      if (!message.read) {
        await this.markAsRead(message.id);
      }
    },
    async markAsRead(messageId) {
      try {
        await axios.post(`http://localhost:8080/api/messages/read/${messageId}`, {}, {
          headers: {
            'Username': this.username
          }
        });
        // 更新本地消息状态
        const index = this.messages.findIndex(msg => msg.id === messageId);
        if (index !== -1) {
          this.messages[index].read = true;
        }
      } catch (error) {
        console.error('标记消息已读失败', error);
      }
    },
    async viewProfile(username) {
      this.selectedUsername = username;
      this.showProfileModal = true;
      
      try {
        const response = await axios.get(`http://localhost:8080/api/likes/liker-profile/${username}`, {
          headers: {
            'Username': this.username
          }
        });
        this.selectedProfile = response.data;
      } catch (error) {
        console.error('获取用户资料失败', error);
        this.selectedProfile = null;
      }
    },
    closeProfileModal() {
      this.showProfileModal = false;
      this.selectedProfile = null;
      this.selectedUsername = '';
    },
    async likeBack(likedUsername, event) {
      try {
        // 改变按钮样式并禁用
        if (event && event.target) {
          event.target.style.backgroundColor = '#ffffff';
          event.target.style.color = '#999999';
          event.target.disabled = true;
          // 显示已喜欢提示文字
          event.target.innerHTML = '您已对对方回应了喜欢';
        } else {
          // 处理用户资料弹窗中的喜欢按钮
          const likeButton = document.querySelector('.profile-actions .like-back');
          if (likeButton) {
            likeButton.style.backgroundColor = '#ffffff';
            likeButton.style.color = '#999999';
            likeButton.disabled = true;
            likeButton.innerHTML = '您已对对方回应了喜欢';
          }
        }
        
        // 对用户名进行URL编码，解决特殊字符问题
        const encodedUsername = encodeURIComponent(likedUsername);
        const response = await axios.post(`http://localhost:8080/api/likes/send/${encodedUsername}`, {}, {
          headers: {
            'Username': this.username
          }
        });
        
        if (response.data.isMutual) {
          // 先刷新约见对话列表，确保获取最新的约见对话
          await this.fetchConversations();
          // 互相喜欢，显示弹窗
          this.showMutualLikeModal = true;
          // 获取对话ID
          await this.fetchMutualLikeConversation();
        }
        
        // 关闭资料弹窗
        this.closeProfileModal();
        
        // 刷新消息列表
        this.fetchMessages();
      } catch (error) {
        console.error('喜欢失败', error);
        alert('喜欢失败: ' + ((error.response && error.response.data && error.response.data.message) || '未知错误'));
      }
    },
    async fetchMutualLikeConversation() {
      try {
        const response = await axios.get('http://localhost:8080/api/messages/conversations/meet', {
          headers: {
            'Username': this.username
          }
        });
        
        if (response.data && response.data.length > 0) {
          // 获取最新的约见对话
          this.mutualLikeConversationId = response.data[0].id;
        }
      } catch (error) {
        console.error('获取约见对话失败', error);
      }
    },
    closeMutualLikeModal() {
      this.showMutualLikeModal = false;
    },
    goToMeetingArrangement() {
      if (this.mutualLikeConversationId) {
        // 找到对应的对话
        const conversation = this.conversations.find(conv => conv.id === this.mutualLikeConversationId);
        if (conversation) {
          this.selectedConversation = conversation;
          this.activeTab = 'meet';
        }
      }
      this.closeMutualLikeModal();
    },
    
    getOtherUserInfo(conversation, field) {
      let otherUser;
      if (conversation.user1.username === this.username) {
        otherUser = conversation.user2;
      } else {
        otherUser = conversation.user1;
      }
      
      // 如果请求的是姓名字段且姓名存在，则返回姓名，否则返回用户名
      if (field === 'name') {
        return otherUser.name || otherUser.username;
      }
      // 返回用户名（兼容旧代码）
      return otherUser.username;
    },
    
    // 保留旧方法以兼容其他可能的调用
    getOtherUsername(conversation) {
      return this.getOtherUserInfo(conversation, 'username');
    },
    
    selectConversation(conversation) {
      this.selectedConversation = conversation;
    },
    
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
    }
  }
};
</script>

<style scoped>
</style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Dancing+Script:wght@600&display=swap');

.message-center {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: 'Montserrat', sans-serif;
  background-color: #fff;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(255, 182, 193, 0.05) 0%, transparent 20%),
    radial-gradient(circle at 90% 30%, rgba(147, 112, 219, 0.05) 0%, transparent 20%),
    radial-gradient(circle at 50% 80%, rgba(255, 105, 180, 0.05) 0%, transparent 20%);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(233, 30, 99, 0.1);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(233, 30, 99, 0.1);
}

.message-center::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #ff4b8b, #ff6b6b, #ffaa5b);
  box-shadow: 0 0 15px rgba(233, 30, 99, 0.3);
}

.title {
  text-align: center;
  color: #e91e63;
  margin-bottom: 30px;
  font-weight: 700;
  font-size: 32px;
  text-shadow: 2px 2px 4px rgba(233, 30, 99, 0.15);
  position: relative;
  font-family: 'Dancing Script', cursive, 'Montserrat', sans-serif;
  letter-spacing: 1px;
}

.title::before {
  content: '❤';
  position: absolute;
  left: 50%;
  top: -20px;
  transform: translateX(-50%) scale(0.6);
  color: rgba(233, 30, 99, 0.2);
  font-size: 24px;
}

.title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #ff4b8b, #ff6b6b);
  border-radius: 3px;
  box-shadow: 0 2px 5px rgba(233, 30, 99, 0.2);
}

.message-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
  border-bottom: 1px solid #eee;
  position: relative;
  z-index: 1;
}

.tab-btn {
  padding: 12px 25px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  position: relative;
  color: #666;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  margin: 0 5px;
}

.tab-btn::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #ff4b8b, #ff6b6b);
  transition: width 0.3s ease;
  border-radius: 3px;
}

.tab-btn:hover {
  color: #e91e63;
}

.tab-btn:hover::before {
  width: 40%;
}

.tab-btn.active {
  color: #e91e63;
  font-weight: bold;
}

.tab-btn.active::before {
  width: 80%;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(45deg, #ff4b8b, #ff6b6b);
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(233, 30, 99, 0.3);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 2px 5px rgba(233, 30, 99, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(233, 30, 99, 0.4);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 2px 5px rgba(233, 30, 99, 0.3);
  }
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.message-item {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.07);
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(233, 30, 99, 0.08);
  position: relative;
  overflow: hidden;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 1));
}

.message-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 0;
  background: linear-gradient(to bottom, #ff4b8b, #ff6b6b);
  transition: height 0.3s ease;
}

.message-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.message-item:hover::before {
  height: 100%;
}

.message-item.unread {
  border-left: none;
  background: linear-gradient(to right, rgba(255, 75, 139, 0.05), white 15%);
}

.message-item.unread::before {
  height: 100%;
}

.like-message, .normal-message {
  display: flex;
  gap: 15px;
}

.message-avatar, .conversation-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 5px 15px rgba(233, 30, 99, 0.15);
  border: 3px solid white;
  position: relative;
  background: linear-gradient(to right, #ff758c, #ff7eb3);
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff4b8b, #ff6b6b);
  color: white;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.avatar-placeholder::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  opacity: 0.5;
}

.message-content {
  flex: 1;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.sender-name {
  font-weight: bold;
  color: #333;
}

.message-time {
  color: #999;
  font-size: 12px;
}

.message-text {
  margin: 0 0 10px 0;
  color: #666;
}

.message-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
  z-index: 1;
  letter-spacing: 0.5px;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  z-index: -1;
}

.action-btn:hover::before {
  left: 0;
}

.view-profile {
  background: linear-gradient(to right, #7986cb, #3f51b5);
  color: white;
}

.like-back {
  background: linear-gradient(to right, #ff4b8b, #ff6b6b);
  color: white;
}

.skip {
  background: linear-gradient(to right, #b0bec5, #78909c);
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.meeting-list {
  margin-top: 10px;
  position: relative;
}

.conversation-item {
  display: flex;
  gap: 15px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.07);
  padding: 20px;
  margin-bottom: 18px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(121, 134, 203, 0.1);
  position: relative;
  overflow: hidden;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 1));
}

.conversation-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 0;
  background: linear-gradient(to bottom, #7986cb, #3f51b5);
  transition: height 0.3s ease;
}

.conversation-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.conversation-item:hover::before {
  height: 100%;
}

.conversation-content {
  flex: 1;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.other-name {
  font-weight: bold;
  color: #333;
}

.conversation-time {
  color: #999;
  font-size: 12px;
}

.conversation-text {
  margin: 0;
  color: #666;
}

.no-messages, .no-conversations {
  text-align: center;
  padding: 50px 20px;
  color: #999;
  background-color: rgba(233, 30, 99, 0.03);
  border-radius: 16px;
  margin: 25px 0;
  font-size: 16px;
  box-shadow: inset 0 0 15px rgba(233, 30, 99, 0.05);
  position: relative;
  overflow: hidden;
}

.no-messages::before, .no-conversations::before {
  content: '💕';
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  opacity: 0.2;
}

.no-messages p, .no-conversations p {
  position: relative;
  display: inline-block;
}

.no-messages p::before, .no-conversations p::before,
.no-messages p::after, .no-conversations p::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(233, 30, 99, 0.3));
}

.no-messages p::before, .no-conversations p::before {
  right: 100%;
  margin-right: 15px;
}

.no-messages p::after, .no-conversations p::after {
  left: 100%;
  margin-left: 15px;
}

/* 弹窗样式增强 */
.profile-modal, .mutual-like-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background-color: white;
  background-image: 
    radial-gradient(circle at 10% 10%, rgba(255, 182, 193, 0.1) 0%, transparent 30%),
    radial-gradient(circle at 90% 90%, rgba(147, 112, 219, 0.1) 0%, transparent 30%);
  border-radius: 20px;
  padding: 35px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.8);
  animation: modalSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
}

@keyframes modalSlideIn {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(233, 30, 99, 0.1);
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #e91e63;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(233, 30, 99, 0.2);
  transform: rotate(90deg);
}

.modal-title {
  text-align: center;
  color: #e91e63;
  margin-bottom: 20px;
  font-weight: 700;
  font-size: 24px;
  position: relative;
  font-family: 'Dancing Script', cursive, 'Montserrat', sans-serif;
}

.profile-avatar-container {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 20px;
}

.profile-info .profile-avatar {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  z-index: 2;
  position: relative;
}

.avatar-decoration {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff4b8b, #ff6b6b, #ffaa5b, #ff4b8b);
  background-size: 300% 300%;
  animation: gradientBG 3s ease infinite;
  z-index: 1;
  opacity: 0.7;
}

@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.profile-name {
  text-align: center;
  margin: 10px 0 20px;
  color: #333;
  font-size: 22px;
  font-weight: 600;
}

.profile-details {
  background: rgba(233, 30, 99, 0.03);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  box-shadow: inset 0 0 10px rgba(233, 30, 99, 0.05);
}

.detail-item {
  display: flex;
  flex-direction: column;
  padding: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.detail-item .label {
  font-size: 12px;
  color: #999;
  margin-bottom: 3px;
}

.detail-item .value {
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.detail-item.introduction {
  margin-top: 15px;
  flex-direction: column;
  grid-column: span 2;
}

.detail-item.introduction .label {
  margin-bottom: 8px;
  width: 100%;
}

.introduction-text {
  white-space: pre-wrap;
  line-height: 1.5;
  font-size: 14px;
  color: #555;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
  width: 100%;
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

.profile-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.btn-icon {
  margin-right: 5px;
  font-size: 16px;
}

.loading-profile {
  text-align: center;
  padding: 30px;
  color: #999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(233, 30, 99, 0.1);
  border-top-color: #e91e63;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 互相喜欢弹窗样式 */
.mutual-like-content {
  text-align: center;
  background-image: 
    radial-gradient(circle at 10% 10%, rgba(255, 182, 193, 0.15) 0%, transparent 30%),
    radial-gradient(circle at 90% 90%, rgba(147, 112, 219, 0.15) 0%, transparent 30%);
}

.hearts-decoration {
  position: relative;
  height: 40px;
  margin-bottom: 10px;
}

.heart {
  position: absolute;
  font-size: 30px;
  color: #e91e63;
  opacity: 0.8;
  animation: float 3s ease-in-out infinite;
}

.heart1 {
  left: 30%;
  top: 0;
  animation-delay: 0s;
  transform: scale(0.8);
}

.heart2 {
  left: 50%;
  top: -10px;
  animation-delay: 0.5s;
}

.heart3 {
  left: 70%;
  top: 5px;
  animation-delay: 1s;
  transform: scale(0.9);
}

@keyframes float {
  0% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.1); }
  100% { transform: translateY(0) scale(1); }
}

.congratulation {
  font-size: 28px;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #ff4b8b, #ff6b6b, #e91e63);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.mutual-like-subtitle {
  font-size: 18px;
  color: #666;
  margin-bottom: 15px;
}

.meeting-instruction {
  background: rgba(233, 30, 99, 0.05);
  padding: 15px;
  border-radius: 10px;
  margin: 20px 0;
  color: #666;
  line-height: 1.5;
  box-shadow: inset 0 0 10px rgba(233, 30, 99, 0.03);
  border: 1px dashed rgba(233, 30, 99, 0.2);
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 25px;
}

.primary {
  background: linear-gradient(to right, #ff4b8b, #ff6b6b);
  color: white;
  padding: 12px 25px;
  font-size: 16px;
}

.secondary {
  background: linear-gradient(to right, #b0bec5, #78909c);
  color: white;
  padding: 12px 25px;
  font-size: 16px;
}