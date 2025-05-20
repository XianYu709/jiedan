import { isFunction } from 'lodash'

export default class Socket {
  static create(url, { onMessage, onOpen, onError, onClose }) {
    const socket = new Socket(url)
    socket.on('message', onMessage)
    socket.on('open', onOpen)
    socket.on('error', onError)
    socket.on('close', onClose)
    // socket.connect()
    return socket
  }

  constructor(url) {
    this._url = url
    this._listeners = {}
    this._socket = null
  }

  connect() {
    console.log('socket connect =', this._socket)
    this.close()
    window.WebSocket = window.WebSocket || window.MozWebSocket
    this._socket = new WebSocket(this.url)
    this._addListener()
  }

  close() {
    if (this._socket) {
      try {
        this._socket.close()
        this._socket = null
      } catch (e) {
        console.error(`已关闭：${e}`)
      }
    }
  }

  /**
   * 事件监听
   * @param type 事件类型
   * @param listener 监听
   */
  on(type, listener) {
    isFunction(listener) && (this._listeners[type] = listener)
  }

  _addListener() {
    // 已连接
    this.socket.onopen = () => {
      isFunction(this._listeners.open) && this._listeners.open()
      console.log('socket已连接')
    }

    // 已关闭
    this.socket.onclose = () => {
      this._socket = null
      isFunction(this._listeners.close) && this._listeners.close()
      console.log('socket已关闭')
    }

    // 连接出错
    this.socket.onerror = evt => {
      isFunction(this._listeners.error) && this._listeners.error(evt)
      console.error('socket连接出错', evt)
    }

    // 接收消息
    this.socket.onmessage = evt => {
      const data = JSON.parse(evt.data)
      // 传给外界
      isFunction(this._listeners.message) && this._listeners.message(data)
    }
  }

  get url() {
    return this._url
  }

  get socket() {
    return this._socket
  }
}
