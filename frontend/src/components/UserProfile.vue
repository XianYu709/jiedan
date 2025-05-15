<template>
  <Dialog
    v-model:show="dialogVisable"
    title="学历认证"
    show-cancel-button
    width="75%"
    @confirm="onConfirm"
  >
    <Form style="margin: 20px 0" ref="formRef">
      <CellGroup>
        <Field
          v-model="vcode"
          name="vcode"
          label="学信网报告验证码："
          label-align="top"
          placeholder="请输入学信网报告验证码"
          :rules="[{ required: true, message: '请输入学信网报告验证码' }]"
        />
      </CellGroup>
    </Form>
  </Dialog>
  <div class="profile-container">
    <div class="profile-card">
      <h2>个人信息管理</h2>
      <div class="avatar-section">
        <div class="avatar-container">
          <img
            v-if="imagePreview"
            :src="imagePreview"
            alt="用户头像"
            class="avatar-image"
          />
          <div v-else class="avatar-placeholder">
            <span>{{ username ? username.charAt(0).toUpperCase() : "?" }}</span>
          </div>
        </div>
        <div class="avatar-actions">
          <label for="photo-upload" class="upload-btn">上传头像</label>
          <label class="album-btn" @click="goToAlbum">我的相册</label>
          <label class="upload-btn" @click="goToCertified">实名认证</label>
        </div>
        <input
          type="file"
          id="photo-upload"
          accept="image/*"
          @change="handlePhotoUpload"
          style="display: none"
        />
      </div>

      <div class="form-container">
        <div class="form-group">
          <label for="name">姓名</label>
          <input
            type="text"
            id="name"
            v-model="userInfo.name"
            placeholder="请输入姓名"
          />
        </div>

        <div class="form-group">
          <label for="age">年龄</label>
          <input
            type="number"
            id="age"
            v-model="userInfo.age"
            placeholder="请输入年龄"
          />
        </div>

        <div class="form-group">
          <label for="education"
            >学历
            <span
              v-if="userInfo.education && userInfo.validate_ducation != '1'"
              style="font-size: 11px; color: #4698ec; margin-left: 8px"
              @click="goToCertified('education')"
              >点击认证
            </span>
            <span
              style="font-size: 11px; color: green; margin-left: 8px"
              v-if="userInfo.education && userInfo.validate_ducation == '1'"
              >验证通过</span
            >
          </label>
          <select
            id="education"
            v-model="userInfo.education"
            @change="educationChange"
          >
            <option value="">请选择学历</option>
            <option value="高中">高中</option>
            <option value="专科">专科</option>
            <option value="本科">本科</option>
            <option value="硕士">硕士</option>
            <option value="博士">博士</option>
          </select>
        </div>

        <div class="form-group">
          <label for="height">身高 (cm)</label>
          <input
            type="number"
            id="height"
            v-model="userInfo.height"
            placeholder="请输入身高"
          />
        </div>

        <div class="form-group">
          <label for="weight">体重 (kg)</label>
          <input
            type="number"
            id="weight"
            v-model="userInfo.weight"
            placeholder="请输入体重"
          />
        </div>

        <div class="form-group introduction-group">
          <label for="introduction">自我介绍</label>
          <div class="rich-editor-container">
            <div class="editor-toolbar">
              <button
                type="button"
                class="toolbar-btn"
                @click="applyFormat('bold')"
                title="加粗"
              >
                <span class="icon">B</span>
              </button>
              <button
                type="button"
                class="toolbar-btn"
                @click="applyFormat('italic')"
                title="斜体"
              >
                <span class="icon">I</span>
              </button>
              <button
                type="button"
                class="toolbar-btn"
                @click="applyFormat('underline')"
                title="下划线"
              >
                <span class="icon">U</span>
              </button>
              <div class="toolbar-divider"></div>
              <div class="emoji-picker">
                <button
                  type="button"
                  class="toolbar-btn emoji-btn"
                  @click="toggleEmojiPicker"
                  title="表情符号"
                >
                  <span class="icon">😊</span>
                </button>
                <div class="emoji-panel" v-if="showEmojiPicker">
                  <div class="emoji-list">
                    <span
                      v-for="emoji in emojiList"
                      :key="emoji"
                      class="emoji"
                      @click="insertEmoji(emoji)"
                      >{{ emoji }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <textarea
              id="introduction"
              v-model="userInfo.introduction"
              placeholder="介绍一下自己吧，让别人更了解你。可以分享你的兴趣爱好、性格特点、生活方式等，让对方更全面地了解你。"
              rows="8"
              maxlength="500"
              @keyup="updateCharCount"
              ref="introTextarea"
            ></textarea>
            <div
              class="char-counter"
              :class="{
                'limit-near': charCount > 400,
                'limit-reached': charCount >= 500,
              }"
            >
              {{ charCount }}/500
            </div>
          </div>
        </div>

        <div class="error-message" v-if="errorMessage">
          {{ errorMessage }}
        </div>

        <button class="save-btn" @click="saveUserInfo">保存信息</button>
      </div>

      <div class="divider"></div>

      <!-- 账号信息部分 -->
      <div class="account-section">
        <h3>账号信息</h3>
        <div class="account-info">
          <p><strong>用户名:</strong> {{ username }}</p>
        </div>

        <div class="password-management">
          <h4>密码管理</h4>
          <div class="form-group">
            <label for="oldPassword">当前密码</label>
            <input
              type="password"
              id="oldPassword"
              v-model="passwordForm.oldPassword"
              placeholder="请输入当前密码"
            />
          </div>

          <div class="form-group">
            <label for="newPassword">新密码</label>
            <input
              type="password"
              id="newPassword"
              v-model="passwordForm.newPassword"
              placeholder="请输入新密码"
              @input="checkPasswordStrength"
            />
            <div class="password-strength" v-if="passwordForm.newPassword">
              <div class="strength-bar">
                <div
                  class="strength-level"
                  :style="{ width: passwordStrength.percent + '%' }"
                  :class="passwordStrength.class"
                ></div>
              </div>
              <span :class="'strength-text ' + passwordStrength.class">{{
                passwordStrength.text
              }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">确认新密码</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="passwordForm.confirmPassword"
              placeholder="请再次输入新密码"
            />
          </div>

          <div class="password-tips">
            <p>密码要求：</p>
            <ul>
              <li>至少8个字符</li>
              <li>包含大小写字母</li>
              <li>包含数字</li>
              <li>包含特殊字符</li>
            </ul>
          </div>

          <div class="error-message" v-if="passwordError">
            {{ passwordError }}
          </div>

          <div class="success-message" v-if="passwordSuccess">
            {{ passwordSuccess }}
          </div>

          <button class="change-password-btn" @click="changePassword">
            修改密码
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { Dialog, Form, Field, CellGroup } from "vant";
import { showToast } from "vant";
export default {
  name: "UserProfile",
  shadow: true,
  components: {
    Dialog,
    Form,
    Field,
    CellGroup,
  },
  data() {
    return {
      username: "",
      vcode: "",
      dialogVisable: false,
      userInfo: {
        name: "",
        age: null,
        education: "",
        height: null,
        weight: null,
        photoUrl: "",
        introduction: "",
        validate_ducation: "",
      },
      imageFile: null,
      imagePreview: null,
      errorMessage: "",
      passwordForm: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      passwordError: "",
      passwordSuccess: "",
      passwordStrength: {
        percent: 0,
        class: "",
        text: "",
      },
      charCount: 0,
      showEmojiPicker: false,
      emojiList: [
        "😊",
        "😂",
        "❤️",
        "👍",
        "🎉",
        "🌟",
        "🏃",
        "🎸",
        "🎬",
        "📚",
        "✈️",
        "🍕",
        "☕",
        "🏠",
        "🐱",
        "🐶",
        "🌈",
        "🌺",
        "🌴",
        "🏞️",
        "🏆",
        "💼",
        "🎓",
        "🎭",
        "🎨",
        "🎧",
        "🏋️",
        "🧘",
        "🚴",
        "🏊",
      ],
    };
  },
  created() {
    // 获取当前登录用户名
    this.username = localStorage.getItem("username") || "";
    // 获取用户信息
    this.fetchUserInfo();
  },
  mounted() {
    // 初始化字符计数
    if (this.userInfo.introduction) {
      this.updateCharCount();
    }
    // 点击页面其他区域关闭表情选择器
    document.addEventListener("click", this.closeEmojiPicker);
  },
  beforeUnmount() {
    // 移除事件监听
    document.removeEventListener("click", this.closeEmojiPicker);
  },
  onConfirm() {
    console.log("onConfirm");

    const refs = this.$refs.formRef;
    console.log(refs);
  },
  methods: {
    async fetchUserInfo() {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/profile`,
          {
            headers: {
              Username: this.username,
            },
          }
        );

        if (response.data) {
          this.userInfo = response.data;
          if (this.userInfo.photoUrl) {
            this.imagePreview = `http://localhost:8080${this.userInfo.photoUrl}`;
          }
        }
      } catch (error) {
        console.error("获取用户信息失败", error);
        this.errorMessage = "获取用户信息失败，请稍后再试";
      }
    },
    handlePhotoUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // 验证文件类型
      if (!file.type.match("image.*")) {
        this.errorMessage = "请上传图片文件";
        return;
      }

      // 验证文件大小 (限制为 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = "图片大小不能超过 5MB";
        return;
      }

      this.imageFile = file;
      this.errorMessage = "";

      // 创建预览
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async saveUserInfo(showMessage = true) {
      try {
        // 创建表单数据
        const formData = new FormData();
        formData.append("name", this.userInfo.name || "");
        formData.append("age", this.userInfo.age || "");
        formData.append("education", this.userInfo.education || "");
        formData.append("height", this.userInfo.height || "");
        formData.append("weight", this.userInfo.weight || "");
        formData.append("introduction", this.userInfo.introduction || "");

        if (this.imageFile) {
          formData.append("photo", this.imageFile);
        }

        // 发送请求
        const response = await axios.post(
          `http://localhost:8080/api/users/profile`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Username: this.username,
            },
          }
        );

        if (response.data) {
          this.errorMessage = "";
          showMessage && alert("个人信息保存成功！");
          // 更新用户信息
          this.fetchUserInfo();
        }
      } catch (error) {
        console.error("保存用户信息失败", error);
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = "保存用户信息失败，请稍后再试";
        }
      }
    },

    async educationChange() {
      this.saveUserInfo(false);
      await axios.post(
        "http://localhost:8080/api/users/setValidateDucation",
        {
          value: 0,
        },
        {
          headers: {
            Username: this.username,
          },
        }
      );
      this.fetchUserInfo();
    },

    // 检查密码强度
    checkPasswordStrength() {
      const password = this.passwordForm.newPassword;
      let strength = 0;
      let feedback = "";

      // 重置错误信息
      this.passwordError = "";

      if (!password) {
        this.passwordStrength = {
          percent: 0,
          class: "",
          text: "",
        };
        return;
      }

      // 检查长度
      if (password.length >= 8) {
        strength += 25;
      } else {
        feedback = "密码太短";
      }

      // 检查是否包含大写字母
      if (/[A-Z]/.test(password)) {
        strength += 25;
      }

      // 检查是否包含小写字母
      if (/[a-z]/.test(password)) {
        strength += 25;
      }

      // 检查是否包含数字
      if (/[0-9]/.test(password)) {
        strength += 12.5;
      }

      // 检查是否包含特殊字符
      if (/[^A-Za-z0-9]/.test(password)) {
        strength += 12.5;
      }

      // 设置强度等级
      let strengthClass = "";
      let strengthText = "";

      if (strength < 25) {
        strengthClass = "very-weak";
        strengthText = feedback || "非常弱";
      } else if (strength < 50) {
        strengthClass = "weak";
        strengthText = "弱";
      } else if (strength < 75) {
        strengthClass = "medium";
        strengthText = "中等";
      } else if (strength < 100) {
        strengthClass = "strong";
        strengthText = "强";
      } else {
        strengthClass = "very-strong";
        strengthText = "非常强";
      }

      this.passwordStrength = {
        percent: strength,
        class: strengthClass,
        text: strengthText,
      };
    },

    // 修改密码
    async changePassword() {
      // 重置消息
      this.passwordError = "";
      this.passwordSuccess = "";

      // 验证表单
      if (!this.passwordForm.oldPassword) {
        this.passwordError = "请输入当前密码";
        return;
      }

      if (!this.passwordForm.newPassword) {
        this.passwordError = "请输入新密码";
        return;
      }

      if (this.passwordForm.newPassword.length < 8) {
        this.passwordError = "新密码长度至少为8个字符";
        return;
      }

      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.passwordError = "两次输入的新密码不一致";
        return;
      }

      // 检查密码强度
      if (this.passwordStrength.percent < 50) {
        this.passwordError = "密码强度太弱，请设置更复杂的密码";
        return;
      }

      try {
        await axios.post(
          "http://localhost:8080/api/users/change-password",
          {
            oldPassword: this.passwordForm.oldPassword,
            newPassword: this.passwordForm.newPassword,
          },
          {
            headers: {
              Username: this.username,
            },
          }
        );

        // 密码修改成功
        this.passwordSuccess = "密码修改成功！";

        // 清空表单
        this.passwordForm = {
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        };

        // 重置密码强度
        this.passwordStrength = {
          percent: 0,
          class: "",
          text: "",
        };
      } catch (error) {
        console.error("修改密码失败", error);
        if (error.response && error.response.data) {
          this.passwordError = error.response.data.message;
        } else {
          this.passwordError = "修改密码失败，请稍后再试";
        }
      }
    },
    // 验证学历
    async validateEducation() {
      const key = "1EBvQMhTV0O5JGrG0xlATXoXvfEY18";
      const vcode = "AB0LBJP66M626XVL";
      // const vcode = "123";
      const resp = await axios.get(
        `https://www.apimy.cn/api/xxw/bgcx?key=${key}&vcode=${vcode}&language=&base64=&html=`,
        {
          headers: {
            "Content-Type": `application/x-www-form-urlencoded;charset:utf-8;`,
          },
        }
      );
      const apiSuccess = resp.data.code == 200;
      let lavelSuccess = false;
      if (apiSuccess) {
        const lavel = resp.data.data["层次"];
        if (lavel == this.userInfo.education) {
          lavelSuccess = true;
        } else {
          lavelSuccess = false;
        }
      }
      showToast({
        message: !apiSuccess
          ? resp.data.msg
          : lavelSuccess
          ? "验证成功"
          : "所选学历与实际不符",
        type: apiSuccess && lavelSuccess ? "success" : "fail",
        duration: apiSuccess ? 1000 : 2000,
      });
      await axios.post(
        "http://localhost:8080/api/users/setValidateDucation",
        {
          value: apiSuccess && lavelSuccess ? 1 : 0,
        },
        {
          headers: {
            Username: this.username,
          },
        }
      );
      this.fetchUserInfo();
    },
    //验证身份证
    async validateIdCard() {},

    async goToCertified(type) {
      switch (type) {
        case "education":
          // this.dialogVisable = true;
          this.validateEducation();
          break;
        case "idcard":
          this.validateIdCard();
          break;
        default:
          break;
      }
    },
    // 跳转到相册页面
    goToAlbum() {
      this.$router.push("/album");
    },

    // 更新字符计数
    updateCharCount() {
      // 确保introduction存在
      if (!this.userInfo || !this.userInfo.introduction) {
        this.charCount = 0;
        return;
      }
      this.charCount = this.userInfo.introduction.length;
    },

    // 切换表情选择器显示状态
    // 可以添加 console.log 来调试
    toggleEmojiPicker(event) {
      console.log("切换表情选择器");
      event.stopPropagation();
      this.showEmojiPicker = !this.showEmojiPicker;
      console.log("showEmojiPicker 的值：", this.showEmojiPicker);
    },

    // 关闭表情选择器
    closeEmojiPicker(event) {
      // 如果点击的不是表情选择器内部元素，则关闭表情选择器
      const emojiPanel = document.querySelector(".emoji-panel");
      const emojiBtn = document.querySelector(".emoji-btn");
      if (
        emojiPanel &&
        !emojiPanel.contains(event.target) &&
        !emojiBtn.contains(event.target)
      ) {
        this.showEmojiPicker = false;
      }
    },

    // 插入表情符号
    insertEmoji(emoji) {
      const textarea = this.$refs.introTextarea;
      if (!textarea) {
        return;
      }

      // 确保introduction存在
      if (!this.userInfo.introduction) {
        this.userInfo.introduction = "";
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = this.userInfo.introduction;

      // 检查插入后是否超过字符限制
      if (text.length + emoji.length > 500) {
        return;
      }

      // 在光标位置插入表情
      this.userInfo.introduction =
        text.substring(0, start) + emoji + text.substring(end);

      // 更新字符计数
      this.updateCharCount();

      // 设置光标位置到插入的表情符号后面
      this.$nextTick(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
      });
    },

    // 应用格式
    applyFormat(format) {
      const textarea = this.$refs.introTextarea;
      if (!textarea) {
        return;
      }

      // 确保introduction存在
      if (!this.userInfo.introduction) {
        this.userInfo.introduction = "";
        return; // 没有文本可以格式化，直接返回
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = this.userInfo.introduction.substring(start, end);

      if (start === end) {
        return; // 没有选中文本
      }

      let formattedText = "";

      switch (format) {
        case "bold":
          formattedText = `**${selectedText}**`;
          break;
        case "italic":
          formattedText = `*${selectedText}*`;
          break;
        case "underline":
          formattedText = `_${selectedText}_`;
          break;
        default:
          return;
      }

      // 检查插入后是否超过字符限制
      const newLength =
        this.userInfo.introduction.length -
        selectedText.length +
        formattedText.length;
      if (newLength > 500) {
        return;
      }

      // 替换选中的文本
      this.userInfo.introduction =
        this.userInfo.introduction.substring(0, start) +
        formattedText +
        this.userInfo.introduction.substring(end);

      // 更新字符计数
      this.updateCharCount();

      // 设置光标位置
      this.$nextTick(() => {
        textarea.focus();
        textarea.selectionStart = start;
        textarea.selectionEnd = start + formattedText.length;
      });
    },
  },
};
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
}

.profile-card {
  width: 100%;
  max-width: 600px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

/* 账号信息部分样式 */
.account-section {
  margin-bottom: 20px;
}

.account-section h3 {
  color: #333;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.account-section h4 {
  color: #555;
  margin: 15px 0 10px;
}

.account-info {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
}

.password-management {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 5px;
}

.password-strength {
  margin-top: 5px;
}

.strength-bar {
  height: 5px;
  background-color: #eee;
  border-radius: 3px;
  margin-top: 5px;
  overflow: hidden;
}

.strength-level {
  height: 100%;
  transition: width 0.3s ease;
}

.strength-level.very-weak {
  background-color: #ff4d4d;
}

.strength-level.weak {
  background-color: #ffa64d;
}

.strength-level.medium {
  background-color: #ffff4d;
}

.strength-level.strong {
  background-color: #4dff4d;
}

.strength-level.very-strong {
  background-color: #4d4dff;
}

.strength-text {
  font-size: 12px;
  margin-top: 3px;
  display: inline-block;
}

.strength-text.very-weak,
.strength-text.weak {
  color: #ff4d4d;
}

.strength-text.medium {
  color: #ffa64d;
}

.strength-text.strong,
.strength-text.very-strong {
  color: #4dff4d;
}

.password-tips {
  margin-top: 15px;
  font-size: 12px;
  color: #666;
}

.password-tips ul {
  margin: 5px 0 0 20px;
  padding: 0;
}

.password-tips li {
  margin-bottom: 3px;
}

.change-password-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.3s;
}

.change-password-btn:hover {
  background-color: #45a049;
}

.success-message {
  color: #4caf50;
  margin: 10px 0;
  padding: 8px;
  background-color: #e8f5e9;
  border-radius: 4px;
}

.divider {
  height: 1px;
  background-color: #eee;
  margin: 20px 0;
}

h2 {
  text-align: center;
  color: #e91e63;
  margin-bottom: 30px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.avatar-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 15px;
  border: 3px solid #e91e63;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e91e63;
  color: white;
  font-size: 48px;
}

.avatar-actions {
  display: flex;
  gap: 10px;
}

.upload-btn {
  background-color: #e91e63;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.album-btn {
  background-color: #3f51b5;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload-btn:hover {
  background-color: #c2185b;
}

.album-btn:hover {
  background-color: #303f9f;
}

.form-container {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

input,
select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.save-btn {
  width: 100%;
  padding: 12px;
  background-color: #e91e63;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.save-btn:hover {
  background-color: #c2185b;
}

.error-message {
  color: #f44336;
  margin-bottom: 15px;
}

/* 自我介绍富文本编辑器样式 */
.introduction-group {
  margin-bottom: 30px;
}

.rich-editor-container {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  padding: 8px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.toolbar-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toolbar-btn:hover {
  background-color: #e0e0e0;
}

.toolbar-btn .icon {
  font-weight: bold;
  font-size: 14px;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background-color: #ddd;
  margin: 0 8px;
}

.emoji-picker {
  position: relative;
}

.emoji-btn {
  font-size: 16px;
}

.emoji-panel {
  position: absolute;
  top: 40px;
  left: 0;
  width: 250px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  padding: 10px;
}

.emoji-list {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 5px;
}

.emoji {
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.emoji:hover {
  background-color: #f0f0f0;
}

#introduction {
  width: 100%;
  padding: 12px;
  border: none;
  font-size: 16px;
  resize: vertical;
  min-height: 150px;
  font-family: "Montserrat", sans-serif;
  line-height: 1.5;
}

.char-counter {
  text-align: right;
  padding: 5px 10px;
  font-size: 12px;
  color: #666;
  background-color: #f9f9f9;
  border-top: 1px solid #eee;
}

.char-counter.limit-near {
  color: #ff9800;
}

.char-counter.limit-reached {
  color: #f44336;
  font-weight: bold;
}
</style>
