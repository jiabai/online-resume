import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const resumeData = {
  name: '毕崇兴',
  englishName: 'Aaron',
  title: 'CTO · 技术合伙人 · 数据技术专家',
  contact: {
    phone: '13810926381',
    email: 'ghostposix@gmail.com',
  },
  summary: '19年+ 技术研发经验（2017年起管理岗位），曾管理近50人团队，涵盖大数据架构、AI Agent、医疗大模型、CDP/数据中台等领域。曾任职于阿里巴巴、暴风影音、明略科技（腾讯战投）、智谱AI战投企业等，具备从0到1搭建技术团队与产品体系的完整经验。',
  experiences: [
    {
      company: '开源项目',
      role: '技术合伙人',
      location: '北京',
      period: '2024.10 — 至今',
      type: 'open-source',
      highlights: [
        {
          project: 'open-skillhub',
          desc: '针对企业部署AI Agent时业务技能隐私无法上云的痛点，设计并实现企业级私有云Agent Skills管理系统，支持Skills以MCP协议在服务端运行，敏感信息安全隔离',
          link: 'https://github.com/jiabai/open-skillhub'
        },
        {
          project: 'GEO生成式引擎优化监测系统（已商业化）',
          desc: '面向SEO/AIGC从业者和企业客户的生成式搜索引擎排名监测工具，整合品牌展示面板、数据分析引擎、浏览器自动化三大模块，已产生收入'
        },
        {
          project: 'Awesome-skills',
          desc: '面向AI应用者的Skill创建与管理工具链，覆盖技能定义、测试、发布全生命周期',
          link: 'https://github.com/jiabai/awesome-skills'
        },
        {
          project: 'InsightFlow',
          desc: '面向自媒体创作者的AI Agent内容研究工具。核心创新：基于Massive Genre-Audience方法从热门内容生成深度话题，结合Scira extreme search方法联网检索并扩展为可发表文章',
          link: 'https://github.com/jiabai/InsightFlow'
        }
      ]
    },
    {
      company: '智览医疗（智谱AI战投企业）',
      role: 'CTO / 产研负责人',
      reportsTo: 'CEO & 董事会',
      location: '北京',
      period: '2023.08 – 2024.10',
      highlights: [
        '主导制定"高质量医学数据"战略方向，完成技术定位与核心功能设计；推动公司成功获得北京市科委医疗大模型课题立项并完成课题撰写',
        '通过医院临床洞察与系统化布局思维，主导制定to B（AI数字人/预问诊分诊）、to C（健康助手小程序）两套产品体系',
        '从0到1设计并实现基于AI Agent的技术架构，完成Agent底座代码开发与核心系统搭建，支持业务快速启动（3个月内上线MVP）',
        '组建并领导团队（产品3人，技术9人）推动研发与落地，建立高效协作流程',
        '主导腾讯云、华为云服务器资源的供应商洽谈并获得优惠定价；推动院外场景落地，与纳通医疗达成合作',
        '完成"医疗大模型微调算法"备案，建立公司在医疗AI领域的技术影响力与合规基础',
        '上线AI数字人、预问诊分诊系统、健康助手小程序三款产品；基座平台覆盖语音采集、多模态数据处理、RAG Agent引擎、Qwen微调、API服务五大模块'
      ]
    },
    {
      company: 'QuickCEP（百度 & 神策数据 战投）',
      role: 'CDO / 数据负责人',
      reportsTo: 'CEO',
      location: '北京',
      period: '2022.12 – 2023.08',
      highlights: [
        '作为CDP专家加入，核心使命是将LLM智能客服的对话数据进行体系化沉淀，构建CDP应用基础，打通"客服数据沉淀→CDP→LLM智能客服→营销自动化"完整价值链',
        '完成CDP与AI大模型框架及MA相结合的技术架构设计，主导客服数据采集、清洗、标签化全流程落地',
        '构建客户LTV管理、标签规则引擎、人群包圈选、即席分析、LLM data ingesting等核心模块，完成产品验证与成本核算',
        '配合公司融资战略调整，完成CDP模块的战略引入方案设计',
        '为团队建立协作机制与敏捷开发流程，推行使用先进的效能管理工具'
      ]
    },
    {
      company: '明略科技 - 秒针系统（腾讯战投）',
      role: '技术总监',
      reportsTo: '技术合伙人',
      location: '北京',
      period: '2017.03 – 2022.09',
      highlights: [
        '完整经历公司体量增长10倍的过程（400到4000人），主导了三家企业合并时的产研体系整合，实现数十名员工平稳过渡（零核心人才流失），获公司"团队稳定保障奖"',
        '统管媒介产品系列（43人团队），主导研发营销智能决策系统（媒介计划/效果评估/私域运营/用户画像4大核心数据系统），支撑公司1/3营收（业务团队创收超4亿）',
        '设计全域ID融合解决方案，覆盖15+媒体平台数据打通，TA浓度提升32%',
        '重构效果评估指标体系，建立广告风控模型，推动宝洁、MRC等国际标准审计认证（业内仅5%企业通过）',
        '建立研发效能管理体系，主导老旧系统重构，人力成本年增长率压控0新增',
        '整合需求管理、代码托管、持续集成、测试管理、持续部署等核心功能，形成端到端自动化流水线',
        '采用硬件资源动态调度方案，在业务量持续增长背景下，实现服务器0新增成本'
      ],
      techStack: ['Java', 'Scala', 'Python', 'C++', 'Flume', 'Kafka', 'Flink CDC', 'HDFS', 'Iceberg', 'Hive', 'Spark', 'Flink', 'Atlas', 'PyTorch', 'ClickHouse', 'Doris']
    },
    {
      company: '暴风影音 - 大数据技术部',
      role: '大数据架构师',
      reportsTo: '产品VP',
      location: '北京',
      period: '2012.11 – 2017.02',
      highlights: [
        '主导大数据产品线与组织架构升级，包括Ad-Hoc Query、OLAP Analysis、Data Visualization、Data Interfaces、Reports等产品线',
        '制定全链路资源使用规范，实现资源使用可视化监控，通过技术方案迭代降低服务器资源消耗30%+',
        '规划大数据平台技术演进路线，成功完成Hadoop集群升级2.0版本，主导Ad-Hoc查询、智能分析等核心模块重构',
        '设计流批一体化架构，推动数据可视化平台日均调用量提升；构建特征工程框架，支撑多个业务线模型开发效率提升',
        '构建BI产品，支撑98%的日常数据需求自助化处理',
        '主导暴风推荐引擎从0到1的完整技术设计，采用"协同过滤+内容分析+热度加权"混合策略，基于近邻模型和TF-IDF算法',
        '建立产品研发规范体系，新功能上线周期缩短至2周迭代'
      ]
    },
    {
      company: '阿里巴巴 – 商家业务事业部',
      role: '数据技术专家',
      reportsTo: '高级技术专家',
      location: '北京',
      period: '2010.09 – 2012.10',
      highlights: [
        '负责量子恒道店铺经（原雅虎统计）实时计算系统的研发与性能调优工作，确保实时计算能力满足千亿级数据处理需求',
        '设计端到端数据处理流水线，将原始数据到可用指标的计算延迟压缩至1s内',
        '重构分布式计算框架核心模块，在同等硬件资源下大幅提升吞吐量',
        '自研基于T-tree的C++ STL Container，建构自主知识产权计算框架，相较开源方案资源消耗降低55%',
        '支撑超2000家商家实现数据驱动经营；商家每日登录频次提升3.2次',
        '构建指标体系可视化映射系统，客户关键决策响应时效从小时级压缩至分钟级'
      ]
    },
    {
      company: '中企动力 - 企业邮箱研发部',
      role: '高级研发工程师',
      reportsTo: '技术经理',
      location: '北京',
      period: '2007.09 – 2010.09',
      highlights: [
        '作为核心成员参与高性能服务器电邮系统的开发与维护，包括系统协议层开发和存储层开发等，shared nothing架构，可做到轻松水平扩展和高并发服务',
        '全程参与电邮系统整体研发，积累了高性能服务器技术研发经验'
      ]
    },
    {
      company: '华硕电脑集团 - 华鼎科技',
      role: '驱动研发工程师',
      reportsTo: '技术经理',
      location: '苏州',
      period: '2006.07 – 2007.08',
      highlights: [
        '作为驱动研发工程师，为主板系统开发可用的驱动程序，并以此程序测试生产阶段的服务器主板功能的健康状态'
      ]
    }
  ],
  skills: {
    ai: ['AI Agent', 'RAG Engine', 'LLM微调 (LoRA/Qwen)', 'Harness Engineering', 'MCP Protocol', 'FunASR'],
    data: ['大数据架构', '实时计算 (Flink/Spark)', '湖仓一体 (Hadoop/Iceberg)', 'ClickHouse/Doris', 'CDP/标签体系', '全域ID融合'],
    engineering: ['Java/Scala/Python/C++', 'React/Vue', '系统架构设计', 'DevOps/CI-CD', '性能优化', '成本管控'],
    management: ['技术团队建设', '产研流程搭建', '敏捷开发', '跨部门协作', '企业并购整合', '供应商谈判', '融资支持']
  },
  education: [
    { school: '清华大学', degree: '硕士学位', major: '工商管理（MBA）' },
    { school: '哈尔滨工业大学', degree: '学士学位', major: '自动化专业' }
  ]
}

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return false
  }

  const storedTheme = localStorage.getItem('theme')
  if (storedTheme === 'dark') return true
  if (storedTheme === 'light') return false

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const Icon = ({ name, size = 18, className }) => {
  const icons = {
    phone: (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    email: (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
    mapPin: (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    calendar: (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    externalLink: (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    ),
    briefcase: (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
    cpu: (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>
      </svg>
    ),
    brain: (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
      </svg>
    ),
    database: (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
    code: (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    users: (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    graduation: (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    )
  }
  return icons[name] || null
}

/* ═══════════ THEME TOGGLE ═════════ */
function ThemeToggle() {
  const [dark, setDark] = useState(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', dark)

    if (dark) {
      localStorage.setItem('theme', 'dark')
    } else {
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <button
      onClick={() => setDark(d => !d)}
      className="theme-toggle"
      aria-label={dark ? '切换到浅色模式' : '切换到深色模式'}
      title={dark ? '切换到浅色模式' : '切换到深色模式'}
    >
      {dark ? (
        /* Sun icon — light mode trigger */
        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        /* Moon icon — dark mode trigger */
        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  )
}

/* ═══════════ HERO SECTION ═══════════════════ */
function Hero() {
  return (
    <section className="animate-fade-in mb-12">
      {/* Decorative top accent bar */}
      <div className="h-1 w-full max-w-[120px] rounded-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accent))]/70 mb-8" />

      <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-12">
        {/* Left: Name + Monogram + Title */}
        <div className="flex-1">
          {/* Monogram */}
          <div className="mb-5 flex items-center gap-4">
            <span className="monogram text-5xl md:text-6xl leading-none">B</span>
            <Separator orientation="vertical" className="h-10" />
            <span className="text-sm font-mono tracking-widest text-[hsl(var(--muted-foreground))] uppercase">19+ Years in Tech</span>
          </div>

          {/* Name — dramatic serif typography */}
          <h1 className="hero-name text-5xl md:text-6xl lg:text-7xl font-bold text-[hsl(var(--foreground))] mb-3">
            {resumeData.name}
            <span className="block text-2xl md:text-3xl font-normal mt-2 text-[hsl(var(--muted-foreground))] tracking-wide font-body">
              {resumeData.englishName}
            </span>
          </h1>

          {/* Role title */}
          <p className="hero-title text-lg md:text-xl text-[hsl(var(--accent))] mt-4 mb-6">
            {resumeData.title}
          </p>

          {/* Summary */}
          <p className="text-base leading-relaxed text-[hsl(var(--muted-foreground))] max-w-2xl font-light">
            {resumeData.summary}
          </p>
        </div>

        {/* Right: Contact info */}
        <div className="md:flex-shrink-0 md:w-auto flex flex-col gap-3">
          <a href={`tel:${resumeData.contact.phone}`} className="contact-btn">
            <Icon name="phone" size={15} />
            <span>{resumeData.contact.phone}</span>
          </a>
          <a href={`mailto:${resumeData.contact.email}`} className="contact-btn">
            <Icon name="email" size={15} />
            <span className="truncate">{resumeData.contact.email}</span>
          </a>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════ EXPERIENCE CARD ═══════════════════ */
function ExperienceCard({ exp, index }) {
  return (
    <div
      className="timeline-item animate-slide-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className={`timeline-dot ${exp.type === 'open-source' ? 'timeline-dot-open-source' : ''}`} />

      <Card size="sm" className="experience-card">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <CardTitle className="text-lg font-semibold text-[hsl(var(--foreground))] flex items-center gap-2.5 flex-wrap">
                {exp.company}
                {exp.type === 'open-source' && (
                  <Badge variant="secondary" className="badge-open-source text-xs">开源</Badge>
                )}
              </CardTitle>
              <p className="text-[hsl(var(--accent))] font-medium mt-1 text-sm">{exp.role}</p>
              {exp.reportsTo && (
                <p className="text-xs text-[hsl(var(--muted-foreground))] italic mt-0.5">Reports to: {exp.reportsTo}</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0 text-xs text-[hsl(var(--muted-foreground))]">
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <Icon name="calendar" size={13} />
                {exp.period}
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <Icon name="mapPin" size={13} />
                {exp.location}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {exp.highlights && (
            <ul className="space-y-2.5 mt-1">
              {exp.highlights.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                  <span className="mt-2 w-1 h-1 rounded-full bg-[hsl(var(--accent))] opacity-60 shrink-0" />
                  {typeof item === 'string' ? (
                    <span>{item}</span>
                  ) : (
                    <span>
                      <strong className="font-medium text-[hsl(var(--foreground))]">{item.project}</strong>：{item.desc}
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 ml-1.5 text-[hsl(var(--accent))] hover:underline transition-colors">
                          <Icon name="externalLink" size={12} />
                        </a>
                      )}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}

          {exp.techStack && (
            <>
              <Separator className="my-4" />
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-2.5">Tech Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {exp.techStack.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs font-mono normal-case">{tech}</Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/* ═══════════════════ SKILL SECTION ═══════════════════ */
function SkillSection({ icon, title, skills, iconBgClass }) {
  return (
    <Card className="group skill-card h-full animate-scale-in">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`${iconBgClass} w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
            {icon}
          </div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/* ═══════════════════ SECTION HEADER ═══════════════════ */
function SectionHeader({ icon, title }) {
  return (
    <div className="section-header flex items-center gap-3 mb-8 animate-on-scroll">
      <div className="w-10 h-10 rounded-xl bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--accent-foreground))] shadow-md shadow-[hsl(var(--accent))/20]">
        {icon}
      </div>
      <h2 className="font-heading text-2xl font-semibold text-[hsl(var(--foreground))]">{title}</h2>
    </div>
  )
}

/* ═══════════════════ MAIN APP ═══════════════════ */
function App() {
  const [visibleExperiences, setVisibleExperiences] = useState(3)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', getInitialTheme())
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen py-10 px-5 md:px-8 lg:px-16 xl:px-24">
      <ThemeToggle />
      <div className="resume-container max-w-4xl mx-auto">
        
        {/* ══ Hero ══ */}
        <Hero />

        <Separator className="my-10 opacity-40" />

        {/* ══ Education ══ */}
        <section className="mb-10">
          <SectionHeader icon={<Icon name="graduation" size={20} />} title="教育背景" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-on-scroll">
            {resumeData.education.map((edu, index) => (
              <Card key={index} className={`experience-card ${index === 0 ? 'edu-card-featured' : ''}`}>
                <CardContent className="pt-5 pb-5">
                  <h3 className="font-heading text-lg font-semibold text-[hsl(var(--foreground))]">
                    {edu.school}
                    {index === 0 && (
                      <Badge variant="outline" className="ml-2 text-xs badge-top-edu">最高学历</Badge>
                    )}
                  </h3>
                  <p className="text-[hsl(var(--accent))] font-medium mt-1 text-sm">{edu.degree}</p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">{edu.major}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ══ Experience ══ */}
        <section className="mb-10">
          <SectionHeader icon={<Icon name="briefcase" size={20} />} title="工作经历" />

          <div className="space-y-6">
            {resumeData.experiences.slice(0, visibleExperiences).map((exp, index) => (
              <ExperienceCard key={`${exp.company}-${index}`} exp={exp} index={index} />
            ))}
          </div>

          {visibleExperiences < resumeData.experiences.length && (
            <div className="flex justify-center mt-8 animate-fade-in">
              <button
                onClick={() => setVisibleExperiences(resumeData.experiences.length)}
                className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[hsl(var(--card))] hover:bg-[hsl(var(--accent))] border border-[hsl(var(--border))] hover:border-[hsl(var(--accent))] text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent-foreground))] transition-all duration-300 cursor-pointer"
              >
                展开更多经历
                <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
              </button>
            </div>
          )}
        </section>

        <Separator className="my-10 opacity-40" />

        {/* ══ Skills ══ */}
        <section className="animate-on-scroll mb-12">
          <SectionHeader icon={<Icon name="cpu" size={20} />} title="专业技能" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkillSection
              icon={<Icon name="brain" size={20} className="skill-icon skill-icon-blue" />}
              title="AI / 大模型"
              skills={resumeData.skills.ai}
              iconBgClass="skill-bg skill-bg-blue"
            />
            <SkillSection
              icon={<Icon name="database" size={20} className="skill-icon skill-icon-emerald" />}
              title="数据工程"
              skills={resumeData.skills.data}
              iconBgClass="skill-bg skill-bg-emerald"
            />
            <SkillSection
              icon={<Icon name="code" size={20} className="skill-icon skill-icon-orange" />}
              title="软件工程"
              skills={resumeData.skills.engineering}
              iconBgClass="skill-bg skill-bg-orange"
            />
            <SkillSection
              icon={<Icon name="users" size={20} className="skill-icon skill-icon-purple" />}
              title="管理与协作"
              skills={resumeData.skills.management}
              iconBgClass="skill-bg skill-bg-purple"
            />
          </div>
        </section>

        {/* ══ Footer ══ */}
        <footer className="pt-8 border-t border-[hsl(var(--border))] text-center animate-on-scroll">
          <p className="text-sm text-[hsl(var(--muted-foreground))] font-light">
            最后更新：2025年 · 使用 React + Tailwind CSS + shadcn/ui 构建
          </p>
        </footer>

      </div>
    </div>
  )
}

export default App
