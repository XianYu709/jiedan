<template>
  <div class="album-container">
    <h2>我的相册</h2>
    
    <!-- 上传照片区域 -->
    <div class="upload-section">
      <label for="photo-upload" class="upload-btn">
        <i class="upload-icon">+</i>
        <span>上传照片</span>
      </label>
      <input 
        type="file" 
        id="photo-upload" 
        accept="image/*" 
        @change="handlePhotoUpload" 
        style="display: none;"
        multiple
      />
      <div class="upload-tip" v-if="uploadStatus">
        {{ uploadStatus }}
      </div>
    </div>
    
    <!-- 照片列表 -->
    <div class="photos-container" v-if="photos.length > 0">
      <div 
        v-for="photo in photos" 
        :key="photo.id"
        class="photo-item"
      >
        <div class="photo-wrapper">
          <img :src="albumApi.defaults.baseURL + photo.photoUrl" alt="相册照片" @click="previewPhotoById(photo.id)" />
          <div class="photo-actions">
            <button class="action-btn delete" @click="deletePhoto(photo.id)">
              <i class="delete-icon">×</i>
            </button>
            <button class="action-btn edit" @click="editPhotoDescription(photo)">
              <i class="edit-icon">✎</i>
            </button>
          </div>
        </div>
        <div class="photo-description" v-if="photo.description">
          {{ photo.description }}
        </div>
      </div>
    </div>
    
    <!-- 无照片提示 -->
    <div class="no-photos" v-else>
      <p>还没有上传照片，点击上方按钮添加照片</p>
    </div>
    
    <!-- 照片预览弹窗 -->
    <div class="photo-preview-modal" v-if="previewPhoto">
      <div class="modal-content">
        <button class="close-btn" @click="closePreview">&times;</button>
        <img :src="albumApi.defaults.baseURL + previewPhoto.photoUrl" alt="照片预览" />
        <div class="preview-description" v-if="previewPhoto.description">
          {{ previewPhoto.description }}
        </div>
      </div>
    </div>
    
    <!-- 照片描述编辑弹窗 -->
    <div class="photo-edit-modal" v-if="editingPhoto">
      <div class="modal-content">
        <button class="close-btn" @click="closeEdit">&times;</button>
        <h3>编辑照片描述</h3>
        <textarea 
          v-model="editingPhotoDescription" 
          placeholder="请输入照片描述..."
          rows="4"
          class="description-textarea"
        ></textarea>
        <div class="edit-actions">
          <button class="cancel-btn" @click="closeEdit">取消</button>
          <button class="save-btn" @click="savePhotoDescription">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

// 创建一个axios实例，用于所有相册相关请求
const albumApi = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 180000, // 增加超时时间到180秒
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Connection': 'keep-alive', // 使用持久连接
    'Cache-Control': 'no-cache' // 避免缓存问题
  },
  maxContentLength: 10485760, // 减小到10MB，避免传输问题
  maxBodyLength: 10485760, // 减小到10MB，避免传输问题
  decompress: false, // 禁用响应体解压缩，避免chunked encoding问题
  maxRedirects: 5,
  // 禁用请求体压缩，避免chunked encoding问题
  transformRequest: [(data, headers) => {
    // 如果是FormData类型，不做处理
    if (data instanceof FormData) {
      return data;
    }
    // 其他类型按默认处理
    if (data && headers['Content-Type'] === 'application/json') {
      return JSON.stringify(data);
    }
    return data;
  }]
});

// 请求拦截器
albumApi.interceptors.request.use(config => {
  // 添加用户名到每个请求
  const username = localStorage.getItem('username');
  if (username) {
    config.headers['Username'] = username;
  }
  return config;
}, error => {
  console.error('请求拦截器错误:', error);
  return Promise.reject(error);
});

// 响应拦截器
albumApi.interceptors.response.use(response => {
  return response;
}, error => {
  // 处理常见错误
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    console.error('请求超时:', error);
    error.friendlyMessage = '请求超时，请检查网络连接或稍后重试';
  } else if (!error.response) {
    console.error('网络错误:', error);
    // 特别处理chunked encoding错误
    if (error.message && error.message.includes('ERR_INCOMPLETE_CHUNKED_ENCODING')) {
      error.friendlyMessage = '网络传输中断，可能是文件过大或网络不稳定，请尝试以下解决方案：\n1. 压缩照片后再上传\n2. 使用更稳定的网络连接\n3. 稍后再试\n4. 如果问题持续存在，请联系管理员';
      // 记录详细错误信息以便调试
      console.warn('检测到chunked encoding错误，详细信息:', error);
    } else if (error.message && error.message.includes('Network Error')) {
      error.friendlyMessage = '网络连接错误，请检查网络设置或服务器状态。如果您正在上传照片，请尝试压缩后再上传。';
    } else {
      error.friendlyMessage = '网络连接错误，请检查网络设置或服务器状态';
    }
  } else {
    console.error(`服务器错误 (${error.response.status}):`, error);
    error.friendlyMessage = `服务器错误 (${error.response.status}): ${(error.response.data && error.response.data.message) || '未知服务器错误'}`;
  }
  return Promise.reject(error);
});

export default {
  name: 'UserAlbum',
  data() {
    return {
      username: '',
      albumId: null,
      photos: [],
      uploadStatus: '',
      previewPhoto: null,
      isUploading: false,
      editingPhoto: null,
      editingPhotoDescription: ''
    };
  },
  created() {
    // 获取当前登录用户名
    this.username = localStorage.getItem('username') || '';
    // 获取用户相册
    this.fetchUserAlbum();
  },
  methods: {
    // 添加图片压缩方法
    async compressImage(file, quality = 0.7) {
      return new Promise((resolve, reject) => {
        try {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              // 创建canvas用于压缩
              const canvas = document.createElement('canvas');
              // 限制最大尺寸为1200px
              let width = img.width;
              let height = img.height;
              const maxDimension = 1200;
              
              if (width > maxDimension || height > maxDimension) {
                if (width > height) {
                  height = Math.round((height * maxDimension) / width);
                  width = maxDimension;
                } else {
                  width = Math.round((width * maxDimension) / height);
                  height = maxDimension;
                }
              }
              
              canvas.width = width;
              canvas.height = height;
              
              // 绘制图片到canvas
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);
              
              // 转换为blob
              canvas.toBlob((blob) => {
                if (!blob) {
                  reject(new Error('Canvas转换失败'));
                  return;
                }
                
                // 创建新的File对象
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: file.lastModified
                });
                
                resolve(compressedFile);
              }, file.type, quality);
            };
            
            img.onerror = () => {
              reject(new Error('图片加载失败'));
            };
            
            img.src = event.target.result;
          };
          
          reader.onerror = () => {
            reject(new Error('文件读取失败'));
          };
          
          reader.readAsDataURL(file);
        } catch (error) {
          reject(error);
        }
      });
    },
    
    // 处理chunked encoding错误的方法
    handleChunkedEncodingError(error) {
      // 检查是否为chunked encoding错误
      if (error.message && (error.message.includes('ERR_INCOMPLETE_CHUNKED_ENCODING') || 
          error.message.includes('network error') || 
          error.message.includes('Network Error'))) {
        console.warn('检测到网络传输错误，尝试使用备用方法上传');
        return true;
      }
      // 检查其他可能的网络错误
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        console.warn('检测到连接超时错误，尝试使用备用方法上传');
        return true;
      }
      return false;
    },
    
    // 添加分块上传功能
    async uploadInChunks(file, url, chunkSize = 1024 * 512) {
      // 如果文件小于分块大小，直接上传
      if (file.size <= chunkSize) {
        const formData = new FormData();
        formData.append('photo', file);
        const response = await albumApi.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-Requested-With': 'XMLHttpRequest',
            'Connection': 'keep-alive'
          }
        });
        return response;
      }
      
      return new Promise((resolve, reject) => {
        try {

          // 分块上传
          const chunks = Math.ceil(file.size / chunkSize);
          this.uploadStatus = `准备分块上传，共${chunks}块...`;
          
          // 创建临时文件ID
          const fileId = Date.now().toString();
          
          // 使用递归函数处理分块上传
          const uploadChunk = (index) => {
            if (index >= chunks) {
              // 所有块上传完成，通知服务器合并
              this.uploadStatus = '所有分块上传完成，正在合并文件...';
              const mergeFormData = new FormData();
              mergeFormData.append('fileId', fileId);
              mergeFormData.append('fileName', file.name);
              mergeFormData.append('totalChunks', chunks.toString());
              
              albumApi.post(`${url}/merge`, mergeFormData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                },
                timeout: 120000 // 合并可能需要更长时间
              })
              .then(response => {
                resolve(response);
              })
              .catch(error => {
                reject(error);
              });
              return;
            }
            
            const start = index * chunkSize;
            const end = Math.min(file.size, start + chunkSize);
            const chunk = file.slice(start, end);
            
            const formData = new FormData();
            formData.append('chunk', chunk);
            formData.append('fileId', fileId);
            formData.append('chunkIndex', index.toString());
            formData.append('totalChunks', chunks.toString());
            formData.append('fileName', file.name);
            
            let retries = 0;
            const maxRetries = 3;
            
            const attemptUpload = () => {
              this.uploadStatus = `正在上传第${index+1}/${chunks}块...`;
              albumApi.post(`${url}/chunk`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'X-Requested-With': 'XMLHttpRequest'
                },
                timeout: 60000 // 每块60秒超时
              })
              .then(() => {
                // 成功上传当前块，继续上传下一块
                uploadChunk(index + 1);
              })
              .catch(error => {
                retries++;
                if (retries >= maxRetries) {
                  reject(error);
                  return;
                }
                this.uploadStatus = `块${index+1}上传失败，正在重试(${retries}/${maxRetries})...`;
                // 延迟后重试
                setTimeout(attemptUpload, 1000 * retries);
              });
            };
            
            attemptUpload();
          };
          
          // 开始上传第一个块
          uploadChunk(0);
        } catch (error) {
          reject(error);
        }
      });
    },
    
    async fetchUserAlbum() {
      this.uploadStatus = '正在加载相册信息...';
      let retryCount = 0;
      const maxRetries = 5; // 增加重试次数
      
      // 检查网络连接
      if (!navigator.onLine) {
        this.uploadStatus = '网络连接已断开，请检查网络设置后刷新页面';
        return;
      }
      
      const tryFetchAlbum = async () => {
        try {
          // 检查用户名是否存在
          if (!this.username) {
            this.uploadStatus = '用户未登录，请先登录';
            this.$router.push('/login');
            return;
          }
          
          console.log('正在请求相册信息，用户名:', this.username);
          // 使用albumApi实例发送请求
          const response = await albumApi.get('/api/albums/user', {
            params: {
              page: 0,  // 默认获取第一页
              size: 20  // 每页20条数据
            },
            // 针对这个请求特别设置
            timeout: 30000, // 减少超时时间
            decompress: false, // 禁用解压缩
            maxContentLength: 1048576, // 限制为1MB
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          });
          
          console.log('相册信息响应:', response.data);
          
          this.uploadStatus = '';
          if (response.data && response.data.length > 0) {
            // 获取第一个相册的ID
            this.albumId = response.data[0].id;
            // 获取相册中的照片
            this.fetchAlbumPhotos();
          } else {
            // 如果没有相册，创建一个默认相册
            this.createDefaultAlbum();
          }
        } catch (error) {
          console.error(`获取用户相册失败 (尝试 ${retryCount + 1}/${maxRetries})`, error);
          
          if (retryCount < maxRetries - 1) {
            retryCount++;
            this.uploadStatus = `加载相册信息失败，正在重试 (${retryCount}/${maxRetries})...`;
            // 指数退避重试，等待时间随重试次数增加，但设置上限
            const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 10000); // 最大等待10秒
            console.log(`等待${delay}毫秒后重试...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return tryFetchAlbum();
          } else {
            this.uploadStatus = error.friendlyMessage || '获取相册信息失败，请检查网络连接后刷新页面重试';
            // 尝试创建默认相册
            this.createDefaultAlbum();
          }
        }
      };
      
      await tryFetchAlbum();
    },
    
    // 创建默认相册
    async createDefaultAlbum() {
      try {
        this.uploadStatus = '正在创建默认相册...';
        const response = await albumApi.post('/api/albums/create', {});
        
        if (response.data && response.data.id) {
          this.albumId = response.data.id;
          this.uploadStatus = '默认相册创建成功';
          this.photos = [];
        } else {
          this.uploadStatus = '创建相册失败，请稍后再试';
        }
      } catch (error) {
        console.error('创建默认相册失败', error);
        this.uploadStatus = error.friendlyMessage || '创建相册失败，请稍后再试';
      }
    },
    
    async fetchAlbumPhotos() {
      if (!this.albumId) return;
      
      this.uploadStatus = '正在加载照片...';
      let retryCount = 0;
      const maxRetries = 3;
      
      const tryFetchPhotos = async () => {
        try {
          const response = await albumApi.get(`/api/albums/${this.albumId}/photos`, {
            params: {
              page: 0,  // 默认获取第一页
              size: 50  // 每页50条数据
            }
          });
          
          this.photos = response.data;
          this.uploadStatus = '';
        } catch (error) {
          console.error(`获取相册照片失败 (尝试 ${retryCount + 1}/${maxRetries})`, error);
          
          if (retryCount < maxRetries - 1) {
            retryCount++;
            this.uploadStatus = `加载照片失败，正在重试 (${retryCount}/${maxRetries})...`;
            // 指数退避重试，等待时间随重试次数增加
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
            return tryFetchPhotos();
          } else {
            this.uploadStatus = error.friendlyMessage || '获取照片失败，请检查网络连接后刷新页面重试';
          }
        }
      };
      
      await tryFetchPhotos();
    },
    
    async checkServerStatus() {
      try {
        // 尝试发送一个简单的请求来检查服务器状态
        const response = await albumApi.get('/api/health', {
          timeout: 8000, // 健康检查使用较短的超时时间
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        console.log('服务器状态检查响应:', response.data);
        return true; // 返回服务器状态正常
      } catch (error) {
        console.error('服务器状态检查失败:', error);
        // 提供更详细的错误信息和解决方案
        let errorMessage = '服务器可能未启动，请按以下步骤操作：\n1. 确认后端服务是否正常运行\n2. 检查后端服务是否在8080端口启动\n3. 如果后端服务已启动，请检查网络连接\n4. 如需帮助，请联系管理员';
        
        // 根据错误类型提供更具体的信息
        if (error.code === 'ECONNREFUSED') {
          errorMessage = '无法连接到服务器，服务器可能未启动或端口不正确';
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = '服务器连接超时，请检查网络连接或服务器负载';
        }
        
        this.uploadStatus = errorMessage;
        return false; // 返回服务器状态异常
      }
    },
    
    async handlePhotoUpload(event) {
      const files = event.target.files;
      if (!files || files.length === 0) return;
      
      // 检查网络连接状态
      if (!navigator.onLine) {
        this.uploadStatus = '网络连接已断开，请检查网络设置后重试';
        return;
      }
      
      // 先检查服务器状态
      const serverIsRunning = await this.checkServerStatus();
      if (!serverIsRunning) {
        // 如果服务器未运行，显示详细的错误信息，checkServerStatus已经设置了uploadStatus
        return;
      }
      
      // 如果还没有相册ID，先获取相册
      if (!this.albumId) {
        await this.fetchUserAlbum();
      }
      
      // 如果仍然没有相册ID，显示错误
      if (!this.albumId) {
        this.uploadStatus = '无法上传照片，请稍后再试';
        return;
      }
      
      // 防止重复上传
      if (this.isUploading) {
        this.uploadStatus = '正在上传中，请稍候...';
        return;
      }
      
      this.isUploading = true;
      this.uploadStatus = '正在上传照片...';
      
      // 逐个上传照片
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 验证文件类型
        if (!file.type.match('image.*')) {
          this.uploadStatus = '请上传图片文件';
          this.isUploading = false;
          return;
        }
        
        // 验证文件大小 (限制为 2MB，减小文件大小以避免传输问题)
        if (file.size > 2 * 1024 * 1024) {
          this.uploadStatus = '图片大小不能超过 2MB，请压缩后再上传';
          this.isUploading = false;
          return;
        }
        
        // 如果文件大于1MB，尝试压缩图片
        let processedFile = file;
        if (file.size > 1 * 1024 * 1024 && file.type.startsWith('image/')) {
          try {
            processedFile = await this.compressImage(file, 0.7); // 压缩到原质量的70%
            console.log(`图片已压缩: ${file.size} -> ${processedFile.size}`);
          } catch (err) {
            console.error('图片压缩失败，使用原图:', err);
            // 继续使用原图
          }
        }
        
        // 再次检查网络连接状态
        if (!navigator.onLine) {
          this.uploadStatus = '网络连接已断开，请检查网络设置后重试';
          this.isUploading = false;
          return;
        }
        
        // 添加重试机制
        let uploadRetryCount = 0;
        const maxUploadRetries = 3; // 增加最大重试次数到3次
        
        const tryUploadPhoto = async () => {
          try {
            // 创建表单数据
            const formData = new FormData();
            formData.append('photo', processedFile);
            
            // 如果是单张照片上传，可以提示用户输入描述
            // 将description定义在更外层作用域，以便在catch块中也能访问
            let description = '';
            if (files.length === 1 && uploadRetryCount === 0) { // 只在第一次尝试时提示
              description = prompt('请输入照片描述（可选）：', '');
            }
            
            if (description) {
              formData.append('description', description);
            }
            
            // 检查网络连接状态
            if (!navigator.onLine) {
              throw new Error('网络连接已断开');
            }
            
            // 再次检查服务器状态
            if (uploadRetryCount > 0) {
              const serverIsStillRunning = await this.checkServerStatus();
              if (!serverIsStillRunning) {
                throw new Error('服务器连接失败');
              }
            }
            
            // 尝试使用分块上传
            try {
              // 检查服务器是否支持分块上传
              if (processedFile.size > 1024 * 512) { // 如果文件大于512KB，尝试分块上传
                try {
                  await this.uploadInChunks(processedFile, `/api/albums/${this.albumId}/photos/upload`);
                  this.uploadStatus = `已上传 ${i + 1}/${files.length} 张照片`;
                  return true; // 上传成功
                } catch (chunkError) {
                  console.warn('分块上传失败，尝试常规上传方式:', chunkError);
                  // 如果分块上传失败，回退到常规上传
                }
              }
            } catch (e) {
              console.warn('分块上传初始化失败，使用常规上传:', e);
            }
            
            // 常规上传请求
            await albumApi.post(`/api/albums/${this.albumId}/photos/upload`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'X-Requested-With': 'XMLHttpRequest', // 添加AJAX标识
                'Connection': 'keep-alive',
                'Cache-Control': 'no-cache'
              },
              // 增加超时时间，大文件上传需要更长时间
              timeout: 180000, // 3分钟超时
              maxContentLength: 5242880, // 限制为5MB，避免过大响应
              maxBodyLength: 5242880, // 限制为5MB，避免过大请求
              // 禁用响应体压缩，避免chunked encoding问题
              decompress: false,
              // 允许重定向
              maxRedirects: 5,
              onUploadProgress: (progressEvent) => {
                // 显示上传进度
                if (progressEvent.total) {
                  const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                  this.uploadStatus = `正在上传第 ${i + 1}/${files.length} 张照片: ${percentCompleted}%`;
                }
              }
            });
            
            this.uploadStatus = `已上传 ${i + 1}/${files.length} 张照片`;
            return true; // 上传成功
          } catch (error) {
            console.error(`上传照片失败 (尝试 ${uploadRetryCount + 1}/${maxUploadRetries + 1})`, error);
            
            // 检查是否为chunked encoding错误
            if (this.handleChunkedEncodingError(error)) {
              // 如果是chunked encoding错误，尝试进一步压缩图片再上传
              try {
                if (processedFile.size > 500 * 1024) { // 如果文件仍然大于500KB
                  this.uploadStatus = '正在尝试进一步压缩图片...';
                  processedFile = await this.compressImage(processedFile, 0.5); // 更高压缩率
                  console.log(`图片已进一步压缩: ${file.size} -> ${processedFile.size}`);
                  // 重新创建表单数据
                  const newFormData = new FormData();
                  newFormData.append('photo', processedFile);
                  
                  // 在这个作用域中重新声明描述变量
                  let currentDescription = '';
                  if (files.length === 1) {
                    currentDescription = prompt('请输入照片描述（可选）：', '');
                  }
                  if (currentDescription) {
                    newFormData.append('description', currentDescription);
                  }
                  // 重新尝试上传
                  await albumApi.post(`/api/albums/${this.albumId}/photos/upload`, newFormData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                      'X-Requested-With': 'XMLHttpRequest',
                      'Connection': 'keep-alive',
                      'Cache-Control': 'no-cache'
                    },
                    timeout: 180000,
                    maxContentLength: 2097152, // 进一步减小到2MB
                    maxBodyLength: 2097152,
                    decompress: false,
                    // 使用更保守的上传设置
                    maxChunkRetries: 5
                  });
                  
                  this.uploadStatus = `已上传 ${i + 1}/${files.length} 张照片`;
                  return true; // 上传成功
                }
              } catch (compressError) {
                console.error('进一步压缩图片失败:', compressError);
                // 继续处理原始错误
              }
            }
            
            // 检查网络连接状态
            if (!navigator.onLine) {
              this.uploadStatus = '网络连接已断开，请检查网络设置后重试';
              return false;
            }
            
            if (uploadRetryCount < maxUploadRetries) {
              uploadRetryCount++;
              this.uploadStatus = `上传第 ${i + 1} 张照片失败，正在重试 (${uploadRetryCount}/${maxUploadRetries})...`;
              // 等待一段时间后重试，使用指数退避策略
              const retryDelay = 2000 * Math.pow(2, uploadRetryCount - 1);
              await new Promise(resolve => setTimeout(resolve, retryDelay));
              
              // 在重试前检查网络和服务器状态
              if (!navigator.onLine) {
                this.uploadStatus = '网络连接已断开，请检查网络设置后重试';
                return false;
              }
              
              // 如果多次重试，检查服务器状态
              if (uploadRetryCount > 1) {
                const serverIsStillRunning = await this.checkServerStatus();
                if (!serverIsStillRunning) {
                  // 服务器状态检查失败，使用checkServerStatus设置的错误信息
                  return false;
                }
              }
              
              return tryUploadPhoto(); // 递归重试
            } else {
              // 使用拦截器中设置的友好错误信息
              let errorMessage = error.friendlyMessage || '未知错误';
              
              // 根据错误类型提供更具体的建议
              if (error.response && error.response.status === 413) {
                errorMessage = '照片文件太大，服务器拒绝接收，请尝试压缩后再上传';
              } else if (error.response && error.response.status === 403) {
                errorMessage = '没有权限上传照片，请重新登录后再试';
              } else if (error.response && error.response.status === 500) {
                errorMessage = '服务器内部错误，请稍后再试或联系管理员';
              } else if (error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout'))) {
                errorMessage = '上传超时，可能是网络不稳定或照片太大，请稍后再试';
                // 尝试检测服务器状态
                const serverStatus = await this.checkServerStatus();
                if (!serverStatus) {
                  // 服务器状态检查失败，使用checkServerStatus设置的错误信息
                  return false;
                }
              }
              
              this.uploadStatus = `上传第 ${i + 1} 张照片失败: ${errorMessage}`;
              return false; // 上传失败
            }
          }
        };
        
        // 执行上传尝试
        const uploadSuccess = await tryUploadPhoto();
        if (!uploadSuccess) {
          this.isUploading = false;
          return; // 如果上传失败，中断整个上传过程
        }
      }
      
      // 上传完成后刷新照片列表
      this.fetchAlbumPhotos();
      this.uploadStatus = `成功上传 ${files.length} 张照片`;
      this.isUploading = false;
      
      // 清空文件输入框，允许重复选择相同文件
      event.target.value = '';
    },
    
    async deletePhoto(photoId) {
      if (!confirm('确定要删除这张照片吗？')) {
        return;
      }
      
      try {
        await albumApi.delete(`/api/albums/photos/${photoId}`);
        
        // 从列表中移除已删除的照片
        this.photos = this.photos.filter(photo => photo.id !== photoId);
        this.uploadStatus = '照片已成功删除';
        // 3秒后清除状态消息
        setTimeout(() => {
          if (this.uploadStatus === '照片已成功删除') {
            this.uploadStatus = '';
          }
        }, 3000);
      } catch (error) {
        console.error('删除照片失败', error);
        alert('删除照片失败: ' + (error.friendlyMessage || '未知错误'));
      }
    },
    
    previewPhotoById(photoId) {
      const photo = this.photos.find(p => p.id === photoId);
      if (photo) {
        this.previewPhoto = photo;
      }
    },
    
    closePreview() {
      this.previewPhoto = null;
    },
    
    editPhotoDescription(photo) {
      this.editingPhoto = photo;
      this.editingPhotoDescription = photo.description || '';
    },
    
    closeEdit() {
      this.editingPhoto = null;
      this.editingPhotoDescription = '';
    },
    
    async savePhotoDescription() {
      if (!this.editingPhoto) return;
      
      try {
        this.uploadStatus = '正在保存照片描述...';
        await albumApi.put(
          `/api/albums/photos/${this.editingPhoto.id}/description`, 
          null,
          {
            params: {
              description: this.editingPhotoDescription
            }
          }
        );
        
        // 更新本地照片描述
        const photoIndex = this.photos.findIndex(p => p.id === this.editingPhoto.id);
        if (photoIndex !== -1) {
          this.photos[photoIndex].description = this.editingPhotoDescription;
        }
        
        // 如果正在预览的是当前编辑的照片，也更新预览中的描述
        if (this.previewPhoto && this.previewPhoto.id === this.editingPhoto.id) {
          this.previewPhoto.description = this.editingPhotoDescription;
        }
        
        this.uploadStatus = '照片描述已更新';
        // 3秒后清除状态消息
        setTimeout(() => {
          if (this.uploadStatus === '照片描述已更新') {
            this.uploadStatus = '';
          }
        }, 3000);
        
        this.closeEdit();
      } catch (error) {
        console.error('更新照片描述失败', error);
        this.uploadStatus = '';
        alert('更新照片描述失败: ' + (error.friendlyMessage || '未知错误'));
      }
    },
  }
}
</script>

<style scoped>
.album-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  color: #e91e63;
  margin-bottom: 30px;
}

.upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.upload-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  border: 2px dashed #e91e63;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fff;
}

.upload-btn:hover {
  background-color: #fce4ec;
}

.upload-icon {
  font-size: 40px;
  color: #e91e63;
  margin-bottom: 10px;
}

.upload-tip {
  margin-top: 10px;
  color: #666;
  white-space: pre-line;
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 4px;
  border-left: 3px solid #e91e63;
  max-width: 400px;
  text-align: left;
}

.photos-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.photo-item {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.photo-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.photo-wrapper {
  position: relative;
  width: 100%;
  padding-top: 100%; /* 1:1 宽高比 */
  overflow: hidden;
}

.photo-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

.photo-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: none;
}

.photo-wrapper:hover .photo-actions {
  display: block;
}

.action-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete {
  background-color: rgba(255, 0, 0, 0.7);
  color: white;
}

.delete:hover {
  background-color: rgba(255, 0, 0, 0.9);
}

.delete-icon {
  font-size: 18px;
}

.photo-description {
  padding: 10px;
  font-size: 14px;
  color: #666;
  background-color: white;
}

.no-photos {
  text-align: center;
  padding: 50px 0;
  color: #999;
}

/* 照片预览弹窗 */
.photo-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.modal-content img {
  max-width: 100%;
  max-height: 80vh;
  display: block;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
}

.preview-description {
  padding: 15px;
  background-color: white;
  color: #333;
}

/* 照片编辑弹窗 */
.photo-edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.description-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 15px 0;
  font-family: inherit;
  resize: vertical;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn, .save-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #333;
}

.save-btn {
  background-color: #e91e63;
  color: white;
}

.edit {
  background-color: rgba(33, 150, 243, 0.7);
  color: white;
  margin-top: 5px;
}

.edit:hover {
  background-color: rgba(33, 150, 243, 0.9);
}

.edit-icon {
  font-size: 16px;
}
</style>