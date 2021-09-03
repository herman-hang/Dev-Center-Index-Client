<template>
  <div class="body">
    <h1 class="mod-title">
      <span class="ico-wechat"></span>
      <span class="text">微信支付</span>
    </h1>
    <div class="mod-ct">
      <div class="order"></div>
      <div class="amount">￥ {{ buyForm.price }}</div>
      <div class="qr-image" id="qrcode"></div>

      <div class="detail" id="orderDetail">
        <dl class="detail-ct" style="display: none;">
          <dt>购买商品</dt>
          <dd id="productName">{{ buyForm.name }}</dd>
          <dt>商户订单号</dt>
          <dd id="billId">{{ buyForm.trade_no }}</dd>
          <dt>创建时间</dt>
          <dd id="createTime">{{ buyForm.create_time }}</dd>
        </dl>
        <a href="javascript:void(0)" class="arrow"><i class="ico-arrow"></i></a>
      </div>
      <div class="tip">
        <span class="dec dec-left"></span>
        <span class="dec dec-right"></span>
        <div class="ico-scan"></div>
        <div class="tip-text">
          <p>请使用微信扫一扫</p>
          <p>扫描二维码完成支付</p>
        </div>
      </div>
      <div class="tip-text"></div>
    </div>
    <div class="foot">
      <div class="inner">
        <p>手机用户可保存上方二维码到手机中</p>
        <p>在微信扫一扫中选择“相册”即可</p>
      </div>
    </div>
  </div>
</template>

<script>
import '../../assets/css/wechat_pay.css';
import '../../assets/js/qrcode.min.js';
import '../../assets/js/qcloud_util.js';
export default {
  data() {
    return {
      // 商品表单
      buyForm: {
        price: '',
        name: '',
        trade_no: '',
        create_time: '',
        code_url: '',
        return_url: ''
      }
    };
  },
  created() {
    this.getParams();
  },
  methods: {
    /**
     * 接收传过来的参数
     */
    getParams() {
      this.buyForm = this.$route.params.data;
    }
  },
  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    $route: 'getParams'
  }
};
</script>
<script>
var self = this;
var qrcode = new QRCode('qrcode', {
  text: self.buyForm.code_url,
  width: 230,
  height: 230,
  colorDark: '#000000',
  colorLight: '#ffffff',
  correctLevel: QRCode.CorrectLevel.H
});
// 订单详情
$('#orderDetail .arrow').click(function(event) {
  if ($('#orderDetail').hasClass('detail-open')) {
    $('#orderDetail .detail-ct').slideUp(500, function() {
      $('#orderDetail').removeClass('detail-open');
    });
  } else {
    $('#orderDetail .detail-ct').slideDown(500, function() {
      $('#orderDetail').addClass('detail-open');
    });
  }
});
// 检查是否支付完成
function loadmsg() {
  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: self.buyForm.return_url,
    timeout: 10000, //ajax请求超时时间10s
    data: { type: 'wxpay', trade_no: self.buyForm.trade_no }, //post数据
    success: function(data, textStatus) {
      //从服务器得到数据，显示数据并继续查询
      if (data.code == 200) {
        self.$meeage.success('支付成功，正在跳转中...');
        self.$router.push('/authorization/list');
      } else {
        setTimeout('loadmsg()', 4000);
      }
    },
    //Ajax请求超时，继续查询
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      if (textStatus == 'timeout') {
        setTimeout('loadmsg()', 1000);
      } else {
        //异常
        setTimeout('loadmsg()', 4000);
      }
    }
  });
}
window.onload = loadmsg();
</script>
<style lang="less" scoped></style>
