/**
 * 首页/Home 共用数据（步骤 3 去重）
 * testimonials 中 metrics 不含 icon，由组件渲染时注入 TrendingUp。
 */
export const landingTestimonials = [
  {
    id: 1,
    image: "/images/business-woman.jpg",
    avatar: "/images/profile.png",
    company: "电子产品公司",
    title: "销售额飙升300%",
    description:
      "通过GrowthEngine的智能推荐系统，我们精准定位了潜在客户，并优化了广告投放策略。我们的产品销售额在短短三个月内实现了飙升。",
    metrics: [
      { label: "ROI", value: "320%", color: "text-emerald-600" },
      { label: "新客户", value: "5.2K", color: "text-blue-600" },
      { label: "播放量", value: "12.8K", color: "text-purple-600" },
    ],
    quote: "GrowthEngine是推动我们业务增长的关键，效果显著。",
    author: "张经理",
  },
  {
    id: 2,
    image: "/images/colorful-laptop.jpg",
    avatar: "/images/profile.png",
    company: "SaaS平台",
    title: "用户活跃度提升120%",
    description:
      "GrowthEngine帮助我们重新设计了用户引导流程，并实施了个性化内容推送。这使得我们的平台用户活跃度大幅提升。",
    metrics: [
      { label: "ROI", value: "280%", color: "text-emerald-600" },
      { label: "新客户", value: "3.8K", color: "text-blue-600" },
      { label: "播放量", value: "9.5K", color: "text-purple-600" },
    ],
    quote: "我们非常满意GrowthEngine带来的改变，它真正理解了用户的需求。",
    author: "李产品经理",
  },
  {
    id: 3,
    image: "/images/education-woman.jpg",
    avatar: "/images/profile.png",
    company: "教育机构",
    title: "报名转化率翻倍",
    description:
      "利用GrowthEngine的数据分析工具，我们精确识别了转化瓶颈，并进行了优化。最终，我们的课程报名转化率实现了翻倍。",
    metrics: [
      { label: "ROI", value: "410%", color: "text-emerald-600" },
      { label: "新客户", value: "6.1K", color: "text-blue-600" },
      { label: "播放量", value: "15.3K", color: "text-purple-600" },
    ],
    quote: "GrowthEngine的策略设计非常专业，是教育行业增长的得力助手。",
    author: "王校长",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
    avatar: "/images/profile.png",
    company: "电商平台",
    title: "订单量增长240%",
    description: "通过精准的用户画像和智能推荐算法，我们的电商平台订单量在两个月内增长了240%，客户满意度也显著提升。",
    metrics: [
      { label: "ROI", value: "350%", color: "text-emerald-600" },
      { label: "新客户", value: "7.3K", color: "text-blue-600" },
      { label: "播放量", value: "18.6K", color: "text-purple-600" },
    ],
    quote: "数据驱动的增长策略让我们的业务实现了质的飞跃。",
    author: "刘总监",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    avatar: "/images/profile.png",
    company: "金融科技",
    title: "用户留存率提升180%",
    description: "借助GrowthEngine的用户行为分析和精准营销工具，我们成功将用户留存率提升了180%，大幅降低了获客成本。",
    metrics: [
      { label: "ROI", value: "390%", color: "text-emerald-600" },
      { label: "新客户", value: "4.9K", color: "text-blue-600" },
      { label: "播放量", value: "11.2K", color: "text-purple-600" },
    ],
    quote: "精准的数据洞察帮助我们做出了正确的产品决策。",
    author: "陈副总",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
    avatar: "/images/profile.png",
    company: "健康医疗",
    title: "预约量增长310%",
    description: "通过GrowthEngine的多渠道营销自动化，我们的在线预约量在一个季度内增长了310%，极大提升了服务效率。",
    metrics: [
      { label: "ROI", value: "425%", color: "text-emerald-600" },
      { label: "新客户", value: "8.7K", color: "text-blue-600" },
      { label: "播放量", value: "21.4K", color: "text-purple-600" },
    ],
    quote: "自动化营销让我们能够专注于提供更好的医疗服务。",
    author: "赵院长",
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
    avatar: "/images/profile.png",
    company: "旅游服务",
    title: "预订转化率提升290%",
    description: "利用GrowthEngine的智能推荐和个性化营销，我们的旅游产品预订转化率提升了290%，复购率也大幅增加。",
    metrics: [
      { label: "ROI", value: "365%", color: "text-emerald-600" },
      { label: "新客户", value: "5.6K", color: "text-blue-600" },
      { label: "播放量", value: "14.1K", color: "text-purple-600" },
    ],
    quote: "个性化推荐让每位客户都能找到心仪的旅行方案。",
    author: "孙经理",
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
    avatar: "/images/profile.png",
    company: "企业服务",
    title: "签约率增长260%",
    description:
      "通过GrowthEngine的销售漏斗优化和智能线索分配，我们的企业服务签约率在半年内增长了260%，销售效率显著提升。",
    metrics: [
      { label: "ROI", value: "440%", color: "text-emerald-600" },
      { label: "新客户", value: "6.8K", color: "text-blue-600" },
      { label: "播放量", value: "16.9K", color: "text-purple-600" },
    ],
    quote: "数据驱动的销售策略让我们的业绩实现了突破性增长。",
    author: "周总经理",
  },
]
