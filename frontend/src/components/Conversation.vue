<template>
  <div class="conversation-container">
    <div class="conversation-header">
      <button class="back-btn" @click="goBack">&lt; 返回</button>
      <h2 class="title">{{ partnerName }}</h2>
    </div>
    
    <!-- 约见类型的对话显示约见安排组件 -->
    <div v-if="isMeetConversation" class="meeting-section">
      <div class="meet-instruction">
        <p>约见功能中无法聊天，请添加您有空的时间段，系统将自动匹配双方都有空的时间安排见面。</p>
      </div>
      <MeetingArrangement :conversationId="conversationId" />
    </div>
    
    <!-- 普通对话显示消息列表 -->
    <div v-else>
      <div class="messages-container" ref="messagesContainer">
        <div v-if="messages.length > 0" class="messages-list">
          <div 
            v-for="message in messages" 
            :key="message.id"
            class="message-item"
            :class="{ 'sent': isSentByMe(message), 'received': !isSentByMe(message) }"
          >
            <div class="message-content">
              <p>{{ message.content }}</p>
              <span class="message-time">{{ formatTime(message.createdAt) }}</span>
            </div>
          </div>
        </div>
        <div v-else class="no-messages">
          <p>开始和{{ partnerName }}聊天吧！</p>
        </div>
      </div>
      
      <div class="message-input">
        <input 
          type="text" 
          v-model="newMessage" 
          placeholder="输入消息..." 
          @keyup.enter="sendMessage"
        />
        <button class="send-btn" @click="sendMessage" :disabled="!newMessage.trim()">
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import MeetingArrangement from './MeetingArrangement.vue';

export default {
  name: 'Conversation',
  components: {
    MeetingArrangement
  },
  data() {
    return {
      conversationId: null,
      messages: [],
      newMessage: '',
      username: '',
      partnerName: '对方',
      loading: false,
      error: null,
      conversationType: ''
    };
  },
  created() {
    this.username = localStorage.getItem('username') || '';
    this.conversationId = this.$route.params.id;
    this.fetchConversationInfo();
    this.fetchMessages();
    
    // 设置定时刷新消息
    this.messageInterval = setInterval(() => {
      this.fetchMessages(false);
    }, 5000);
  },
  beforeUnmount() {
    // 清除定时器
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
    }
  },
  computed: {
    isMeetConversation() {
      return this.conversationType === 'MEET';
    }
  },
  methods: {
    async fetchConversationInfo() {
      if (!this.conversationId) return;
      
      try {
        const response = await axios.get(`http://localhost:8080/api/messages/conversations/${this.conversationId}`, {
          headers: {
            'Username': this.username
          }
        });
        
        const conversation = response.data;
        this.conversationType = conversation.conversationType;
        
        // 获取对话伙伴的姓名（优先）或用户名
        if (conversation.user1.username === this.username) {
          this.partnerName = conversation.user2.name || conversation.user2.username;
        } else {
          this.partnerName = conversation.user1.name || conversation.user1.username;
        }
      } catch (error) {
        console.error('获取对话信息失败', error);
      }
    },
    
    async fetchMessages(scrollToBottom = true) {
      if (!this.conversationId) return;
      
      try {
        const response = await axios.get(`http://localhost:8080/api/messages/conversations/${this.conversationId}/messages`, {
          headers: {
            'Username': this.username
          }
        });
        
        this.messages = response.data;
        
        // 获取对话伙伴的名字
        if (this.messages.length > 0) {
          const firstMessage = this.messages[0];
          const sender = firstMessage.sender;
          if (sender.username !== this.username) {
            this.partnerName = sender.name || sender.username;
          } else if (this.messages.length > 1) {
            const secondMessage = this.messages[1];
            if (secondMessage.sender.username !== this.username) {
              this.partnerName = secondMessage.sender.name || secondMessage.sender.username;
            }
          }
        }
        
        // 标记对话为已读
        this.markConversationAsRead();
        
        // 滚动到底部
        if (scrollToBottom) {
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        }
      } catch (error) {
        console.error('获取消息失败', error);
        this.error = '获取消息失败，请稍后再试';
      }
    },
    async sendMessage() {
      if (!this.newMessage.trim() || !this.conversationId) return;
      
      try {
        await axios.post(`http://localhost:8080/api/messages/conversations/${this.conversationId}/messages`, {
          content: this.newMessage
        }, {
          headers: {
            'Username': this.username
          }
        });
        
        // 清空输入框
        this.newMessage = '';
        
        // 重新获取消息
        this.fetchMessages();
      } catch (error) {
        console.error('发送消息失败', error);
      }
    },
    async markConversationAsRead() {
      try {
        await axios.post(`http://localhost:8080/api/messages/conversations/${this.conversationId}/read`, {}, {
          headers: {
            'Username': this.username
          }
        });
      } catch (error) {
        console.error('标记对话已读失败', error);
      }
    },
    isSentByMe(message) {
      return message.sender.username === this.username;
    },
    formatTime(timestamp) {
      if (!timestamp) return '';
      
      const date = new Date(timestamp);
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    goBack() {
      this.$router.push('/messages');
    }
  }
};
</script>

<style scoped>
.conversation-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px);
  max-width: 800px;
  margin: 0 auto;
  background-color: #f9f9f9;
}

.conversation-header {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.back-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #666;
  margin-right: 15px;
}

.title {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.meet-instruction {
  background-color: #f5f5f5;
  padding: 15px;
  margin: 15px;
  border-radius: 8px;
  border-left: 4px solid #e91e63;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.meet-instruction p {
  margin: 0;
  color: #555;
  font-size: 15px;
  line-height: 1.5;
}

.meeting-section {
  flex: 1;
  overflow-y: auto;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message-item {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 18px;
  position: relative;
}

.sent {
  align-self: flex-end;
  background-color: #e91e63;
  color: white;
  border-bottom-right-radius: 4px;
}

.received {
  align-self: flex-start;
  background-color: white;
  color: #333;
  border-bottom-left-radius: 4px;
}

.message-content p {
  margin: 0 0 5px 0;
  word-break: break-word;
}

.message-time {
  font-size: 12px;
  opacity: 0.7;
  display: block;
  text-align: right;
}

.no-messages {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #999;
}

.message-input {
  display: flex;
  padding: 15px;
  background-color: white;
  border-top: 1px solid #eee;
}

.message-input input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  font-size: 16px;
}

.message-input input:focus {
  border-color: #e91e63;
}

.send-btn {
  background-color: #e91e63;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0 20px;
  margin-left: 10px;
  cursor: pointer;
  font-size: 16px;
}

.send-btn:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}
</style>