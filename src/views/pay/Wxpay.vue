<template>
  <div class="body">
    <h1 class="mod-title">
      <span class="ico-wechat"></span>
      <span class="text">微信支付</span>
    </h1>
    <div class="mod-ct">
      <div class="order"></div>
      <div class="amount">￥ {{ buyForm.price }}</div>
      <div class="qr-image" id="qrcode" title="打开支付宝扫一扫"></div>
      <div :class="isClass ? 'detail detail-open' : 'detail'" id="orderDetail">
        <dl class="detail-ct" v-show="isClass">
          <dt>购买商品</dt>
          <dd id="productName">{{ buyForm.name }}</dd>
          <dt>商户订单号</dt>
          <dd id="billId">{{ buyForm.trade_no }}</dd>
          <dt>创建时间</dt>
          <dd id="createTime">{{ buyForm.create_time | date }}</dd>
        </dl>
        <a href="javascript:void(0)" class="arrow" @click="detail"><i class="ico-arrow"></i></a>
      </div>
      <div class="tip">
        <span class="dec dec-left"></span>
        <span class="dec dec-right"></span>
        <div class="ico-scan"></div>
        <div class="tip-text">
          <p>请使用支付宝扫一扫</p>
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
import QRCode from 'qrcodejs2';
export default {
  data() {
    return {
      // 商品表单
      buyForm: {
        price: '',
        name: '',
        trade_no: '',
        create_time: '',
        code_url: ''
      },
      // 控制订单详情显示与隐藏
      isClass: false,
      // 定时器
      timer: null
    };
  },
  created() {
    this.getParams();
  },
  methods: {
    /**
     *回调地址
     */
    async wxpayReturn() {
      const { data: res } = await this.$http.get(this.buyForm.notify_url);
      if (res.code !== 201) {
        this.timer = setTimeout(this.wxpayReturn, 2000);
      } else {
        this.$message.success(res.msg);
        this.$router.push('/authorization/list');
      }
    },

    /**
     * 接收传过来的参数
     */
    getParams() {
      if (this.$route.params.data !== '' && this.$route.params.data !== undefined && this.$route.params.data !== null) {
        this.buyForm = this.$route.params.data;
      } else {
        this.$message.error('订单丢失，请重新下单！');
      }
    },

    /**
     * 二维码生成
     */
    qrcode() {
      const qrcode = new QRCode('qrcode', {
        width: 230,
        height: 230,
        text: this.buyForm.code_url, // 二维码地址
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });
    },

    /**
     * 点击订单详情监听
     */
    detail() {
      this.isClass = !this.isClass;
    }
  },
  mounted() {
    this.qrcode();
    this.wxpayReturn();
    this.$once('hook:beforeDestroy', () => {
      // 清除定时器
      clearInterval(this.timer);
    });
  },
  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    $route: 'getParams'
  }
};
</script>
<style lang="less" scoped></style>
