<template>
  <div class="meeting-arrangement">
    <h3 class="title">约见安排</h3>
    
    <div v-if="arrangement" class="arrangement-info">
      <div class="info-card">
        <h4>系统已为你们安排了约见</h4>
        <div class="meeting-details">
          <p v-if="partnerName"><strong>约见对象：</strong>{{ partnerName }}</p>
          <p><strong>约见时间：</strong>{{ formatDateTime(arrangement.meetingTime) }}</p>
          <p><strong>约见地点：</strong>{{ arrangement.meetingPlace.name }}</p>
          <p v-if="arrangement.meetingPlace.address"><strong>地址：</strong>{{ arrangement.meetingPlace.address }}</p>
          <p v-if="arrangement.meetingPlace.description"><strong>备注：</strong>{{ arrangement.meetingPlace.description }}</p>
        </div>
        <div class="status-badge" :class="{ 'confirmed': arrangement.confirmed }">
          {{ arrangement.confirmed ? '已确认' : '待确认' }}
        </div>
        <div class="action-buttons" v-if="!arrangement.confirmed">
          <button class="confirm-btn" @click="confirmArrangement">确认约见</button>
          <button class="cancel-btn" @click="cancelArrangement">取消约见</button>
        </div>
      </div>
    </div>
    
    <div v-else class="time-selection">
      <div class="instruction">
        <p>请选择你有空的时间段，系统将自动匹配双方都有空的时间并安排在万达广场见面。在约见安排中，双方无法聊天，只能通过选择自己有空的时间段来安排约见。系统会自动计算双方共同有空的时间。</p>
      </div>
      
      <div class="timeslots-container">
        <h4>已提交的时间段</h4>
        <div v-if="userTimeSlots.length > 0" class="timeslot-list">
          <div v-for="slot in userTimeSlots" :key="slot.id" class="timeslot-item">
            <span>{{ formatDateTime(slot.startTime) }} - {{ formatTime(slot.endTime) }}</span>
            <button class="delete-btn" @click="deleteTimeSlot(slot.id)">删除</button>
          </div>
          <div class="timeslot-actions">
            <button class="clear-all-btn" @click="clearAllTimeSlots">清除所有时间段</button>
          </div>
        </div>
        <div v-else class="no-timeslots">
          <p>你还没有提交任何时间段</p>
        </div>
      </div>
      
      <div class="add-timeslot">
        <h4>添加新的时间段</h4>
        <div class="datetime-inputs">
          <div class="input-group">
            <label>开始时间</label>
            <input type="datetime-local" v-model="newTimeSlot.startTime" />
          </div>
          <div class="input-group">
            <label>结束时间</label>
            <input type="datetime-local" v-model="newTimeSlot.endTime" />
          </div>
        </div>
        <div class="timeslot-buttons">
          <button class="submit-btn" @click="submitTimeSlot" :disabled="!isValidTimeSlot">提交时间段</button>
          <button class="reset-btn" @click="resetTimeSlotForm">重置</button>
        </div>
      </div>
      
      <div class="overlapping-timeslots" v-if="overlappingSlots.length > 0">
        <h4>双方都有空的时间段</h4>
        <div class="timeslot-list">
          <div v-for="slot in overlappingSlots" :key="slot.id" class="timeslot-item overlapping">
            <span>{{ formatDateTime(slot.startTime) }} - {{ formatTime(slot.endTime) }}</span>
          </div>
        </div>
        <button class="arrange-btn" @click="autoArrangeMeeting">自动安排约见</button>
      </div>
      
      <!-- 移除了显示对方时间段的部分 -->
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MeetingArrangement',
  props: {
    conversationId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      username: '',
      arrangement: null,
      userTimeSlots: [],
      overlappingSlots: [],
      newTimeSlot: {
        startTime: '',
        endTime: ''
      },
      refreshInterval: null,
      partnerName: ''
    };
  },
  computed: {
    isValidTimeSlot() {
      return this.newTimeSlot.startTime && 
             this.newTimeSlot.endTime && 
             new Date(this.newTimeSlot.startTime) < new Date(this.newTimeSlot.endTime);
    }
  },
  created() {
    this.username = localStorage.getItem('username') || '';
    this.fetchData();
    
    // 设置定时刷新
    this.refreshInterval = setInterval(() => {
      this.fetchData();
    }, 30000); // 每30秒刷新一次
  },
  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
  methods: {
    async fetchData() {
      await this.fetchArrangement();
      if (!this.arrangement) {
        await this.fetchUserTimeSlots();
        await this.fetchOverlappingTimeSlots();
        // 不再获取对方的时间段，只关注自己的时间段和重叠的时间段
      }
    },
    
    async fetchPartnerName() {
      try {
        const response = await axios.get(`http://localhost:8080/api/messages/conversations/${this.conversationId}`, {
          headers: {
            'Username': this.username
          }
        });
        
        const conversation = response.data;
        // 获取对话伙伴的姓名（优先）或用户名
        if (conversation.user1.username === this.username) {
          this.partnerName = conversation.user2.name || conversation.user2.username;
        } else {
          this.partnerName = conversation.user1.name || conversation.user1.username;
        }
      } catch (error) {
        console.error('获取对话伙伴信息失败', error);
        this.partnerName = '';
      }
    },
    async fetchArrangement() {
      try {
        const response = await axios.get(`http://localhost:8080/api/meetings/conversations/${this.conversationId}/arrangement`, {
          headers: {
            'Username': this.username
          }
        });
        this.arrangement = response.data;
        // 获取对话信息以显示对方姓名
        await this.fetchPartnerName();
      } catch (error) {
        // 只有在明确返回400且消息是"没有找到约见安排"时才设置为null
        // 其他错误（如网络问题、服务器错误）保留之前的状态
        if (error.response && error.response.status === 400 && 
            error.response.data && error.response.data.message === "没有找到约见安排") {
          console.log('没有约见安排');
          this.arrangement = null;
        } else {
          console.error('获取约见安排失败', error);
          // 不改变arrangement的状态，保留之前的数据
        }
      }
    },
    async fetchUserTimeSlots() {
      try {
        const response = await axios.get(`http://localhost:8080/api/meetings/conversations/${this.conversationId}/timeslots`, {
          headers: {
            'Username': this.username
          }
        });
        this.userTimeSlots = response.data;
      } catch (error) {
        console.error('获取时间段失败', error);
      }
    },
    
    // 移除了获取对方时间段的方法
    async fetchOverlappingTimeSlots() {
      try {
        const response = await axios.get(`http://localhost:8080/api/meetings/conversations/${this.conversationId}/overlapping-timeslots`, {
          headers: {
            'Username': this.username
          }
        });
        this.overlappingSlots = response.data;
      } catch (error) {
        console.error('获取重叠时间段失败', error);
      }
    },
    async submitTimeSlot() {
      if (!this.isValidTimeSlot) return;
      
      try {
        const startTime = new Date(this.newTimeSlot.startTime).getTime();
        const endTime = new Date(this.newTimeSlot.endTime).getTime();
        
        await axios.post(`http://localhost:8080/api/meetings/conversations/${this.conversationId}/timeslots`, {
          startTime: startTime.toString(),
          endTime: endTime.toString()
        }, {
          headers: {
            'Username': this.username
          }
        });
        
        // 重置表单
        this.resetTimeSlotForm();
        
        // 刷新数据
        await this.fetchUserTimeSlots();
        await this.fetchOverlappingTimeSlots();
      } catch (error) {
        console.error('提交时间段失败', error);
        alert('提交时间段失败: ' + (error.response && error.response.data && error.response.data.message || '未知错误'));
      }
    },
    
    resetTimeSlotForm() {
      this.newTimeSlot.startTime = '';
      this.newTimeSlot.endTime = '';
    },
    async deleteTimeSlot(timeSlotId) {
      try {
        await axios.delete(`http://localhost:8080/api/meetings/timeslots/${timeSlotId}`, {
          headers: {
            'Username': this.username
          }
        });
        
        // 刷新数据
        await this.fetchUserTimeSlots();
        await this.fetchOverlappingTimeSlots();
      } catch (error) {
        console.error('删除时间段失败', error);
        alert('删除时间段失败: ' + (error.response && error.response.data && error.response.data.message || '未知错误'));
      }
    },
    
    async clearAllTimeSlots() {
      if (!confirm('确定要清除所有时间段吗？')) return;
      
      try {
        await axios.delete(`http://localhost:8080/api/meetings/conversations/${this.conversationId}/timeslots/all`, {
          headers: {
            'Username': this.username
          }
        });
        
        // 刷新数据
        await this.fetchUserTimeSlots();
        await this.fetchOverlappingTimeSlots();
        alert('已清除所有时间段');
      } catch (error) {
        console.error('清除所有时间段失败', error);
        alert('清除所有时间段失败: ' + (error.response && error.response.data && error.response.data.message || '未知错误'));
      }
    },
    async autoArrangeMeeting() {
      try {
        const response = await axios.post(`http://localhost:8080/api/meetings/conversations/${this.conversationId}/auto-arrange`, {}, {
          headers: {
            'Username': this.username
          }
        });
        
        this.arrangement = response.data;
        alert('约见已自动安排在万达广场，请查看详情');
      } catch (error) {
        console.error('自动安排约见失败', error);
        alert('自动安排约见失败: ' + (error.response && error.response.data && error.response.data.message || '未知错误'));
      }
    },
    async confirmArrangement() {
      try {
        await axios.post(`http://localhost:8080/api/meetings/arrangements/${this.arrangement.id}/confirm`, {}, {
          headers: {
            'Username': this.username
          }
        });
        
        // 刷新约见安排
        await this.fetchArrangement();
        alert('约见已确认');
      } catch (error) {
        console.error('确认约见失败', error);
        alert('确认约见失败: ' + (error.response && error.response.data && error.response.data.message || '未知错误'));
      }
    },
    async cancelArrangement() {
      try {
        await axios.delete(`http://localhost:8080/api/meetings/arrangements/${this.arrangement.id}`, {
          headers: {
            'Username': this.username
          }
        });
        
        this.arrangement = null;
        // 刷新数据
        await this.fetchUserTimeSlots();
        await this.fetchOverlappingTimeSlots();
        alert('约见已取消');
      } catch (error) {
        console.error('取消约见失败', error);
        alert('取消约见失败: ' + (error.response && error.response.data && error.response.data.message || '未知错误'));
      }
    },
    formatDateTime(dateStr) {
      if (!dateStr) return '';
      
      const date = new Date(dateStr);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    formatTime(dateStr) {
      if (!dateStr) return '';
      
      const date = new Date(dateStr);
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
.meeting-arrangement {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
  color: #e91e63;
  margin-bottom: 20px;
}

.arrangement-info {
  margin-bottom: 30px;
}

.info-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.meeting-details {
  margin: 15px 0;
}

.status-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 5px 10px;
  border-radius: 4px;
  background-color: #ff9800;
  color: white;
  font-size: 14px;
}

.status-badge.confirmed {
  background-color: #4caf50;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.confirm-btn, .cancel-btn, .submit-btn, .arrange-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.confirm-btn, .submit-btn, .arrange-btn {
  background-color: #e91e63;
  color: white;
}

.cancel-btn {
  background-color: #9e9e9e;
  color: white;
}

.time-selection {
  margin-top: 20px;
}

.instruction {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.timeslots-container, .add-timeslot, .overlapping-timeslots {
  margin-bottom: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.timeslot-list {
  margin-top: 15px;
}

.timeslot-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.timeslot-item:last-child {
  border-bottom: none;
}

.timeslot-item.overlapping {
  background-color: #e8f5e9;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
}

.no-timeslots {
  text-align: center;
  color: #9e9e9e;
  padding: 20px 0;
}

.datetime-inputs {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.input-group {
  flex: 1;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.input-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.submit-btn:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

.timeslot-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

.clear-all-btn {
  background-color: #ff5722;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: bold;
}

.timeslot-buttons {
  display: flex;
  gap: 10px;
}

.reset-btn {
  background-color: #9e9e9e;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: bold;
}
</style>