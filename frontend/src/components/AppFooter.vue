<template>
  <footer class="app-footer">
    <div class="hm-container footer-inner">
      <div class="brand">
        <span class="name">惠商城 · HyperMall</span>
        <span class="desc">基于 Spring Cloud 的微服务电商演示项目</span>
      </div>
      <div class="links">
        <span>商品搜索</span>
        <span>购物车</span>
        <span>下单结算</span>
        <span>余额支付</span>
      </div>
      <div class="copyright">仅供学习演示使用 · 数据以实际后端返回为准</div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: 40px;
  background: #1f2329;
  color: #9aa1ab;
  padding: 28px 0;
}
.footer-inner {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.brand {
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.name {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}
.desc {
  font-size: 13px;
}
.links {
  display: flex;
  gap: 24px;
  font-size: 13px;
}
.copyright {
  font-size: 12px;
  color: #6b7280;
}
</style>
