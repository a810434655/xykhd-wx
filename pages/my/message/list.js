// pages/my/message/list.js
var _user = require('../../../service/user.js')
var _util = require('../../../utils/util.js')
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    platform: '',
    type: 0,
    messageList: [],
    page: 1,
    size: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.data.type = options.type
    that.data.platform = wx.getSystemInfoSync().platform
  },
  onShow: function () {
    that.data.page = 1
    that.getData()
  },
  getData: function () {
    _user.getUserMessage({ page: that.data.page, size: that.data.size, type: that.data.type }).then(data => {
      if (that.data.page == 1) {
        that.data.messageList.splice(0, that.data.messageList.length)
      }
      data.records.forEach(c => {
          let Y, M, D, h, m,time
          time = new Date(c.ctime)
          Y = time.getFullYear() + '/';
          M = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '/';
          D = time.getDate() + ' ';
          h = (time.getHours() < 10 ? '0' + time.getHours() : time.getHours()) + ':';
          m = (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes());
          c.ctime = Y + M + D + h + m
          if(c.jsonData){
            c.jsonData = JSON.parse(c.jsonData)
          }
      })

      that.setData({
        messageList: that.data.messageList.concat(data.records)
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    }).catch(e => {
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  },
  onPullDownRefresh: function () {
    that.data.page = 1
    that.getData()
  },
  onReachBottom: function () {
    that.data.page++
    that.getData()
  }
})