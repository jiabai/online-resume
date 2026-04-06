import React, { useState, useEffect } from 'react'

const resumeData = {
  name: '毕崇兴',
  englishName: 'Aaron',
  title: 'CTO / 技术合伙人 / 数据技术专家',
  contact: {
    phone: '13810926381',
    email: 'ghostposix@gmail.com',
    wechat: 'WeChat'
  },
  summary: '19年+ 技术研发经验（2017年起管理岗位），曾管理近50人团队，涵盖大数据架构、AI Agent、医疗大模型、CDP/数据中台等领域。曾任职于阿里巴巴、暴风影音、明略科技（腾讯战投）、智谱AI战投企业等，具备从0到1搭建技术团队与产品体系的完整经验。',
  experiences: [
    {
      company: '开源项目',
      role: '技术合伙人',
      location: '北京',
      period: '2024.10 - 至今',
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
          desc: '面向自媒体创作者的AI Agent内容研究工具。核心创新：基于Massive Genre-Audience方法从热门内容生成深度话题，结合Scira extreme search方法联网检索并扩展为可发表文章；参考字节跳动Seed团队论文《Reformulation for Pretraining Data Augmentation》',
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
    {
      school: '清华大学',
      degree: '硕士学位',
      major: '工商管理（MBA）'
    },
    {
      school: '哈尔滨工业大学',
      degree: '学士学位',
      major: '自动化专业'
    }
  ]
}

const Icon = ({ name, size = 20, className = '' }) => {
  const icons = {
    phone: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    email: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
    briefcase: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
    mapPin: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    calendar: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    code: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    cpu: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>
      </svg>
    ),
    database: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
    users: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    brain: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.94 10.5c-.068.2-.17.39-.3.57"/><path d="M8 18a4.5 4.5 0 0 1-1.5-3.5"/><path d="M16 18a4.5 4.5 0 0 0 1.5-3.5"/>
      </svg>
    ),
    externalLink: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    )
  }
  return icons[name] || null
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl glass-card p-8 md:p-12 mb-8 animate-fade-in">
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-100/40 to-indigo-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-slate-100/50 to-gray-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
          <div className="flex items-start gap-5">
            {/* Monogram — visual anchor */}
            <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center shadow-lg shadow-blue-200/50 shrink-0 mt-0.5">
              <span className="text-white font-heading font-bold text-2xl tracking-tight">B</span>
            </div>
            
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-2">
                {resumeData.name}
                <span className="text-accent ml-3 font-light text-2xl md:text-3xl">{resumeData.englishName}</span>
              </h1>
              <p className="text-xl text-text-secondary font-body font-medium mt-3">{resumeData.title}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center shrink-0">
            <a href={`tel:${resumeData.contact.phone}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 hover:bg-white/90 border border-gray-200/60 transition-all duration-200 cursor-pointer group">
              <Icon name="phone" size={16} className="text-accent" />
              <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary">{resumeData.contact.phone}</span>
            </a>
            <a href={`mailto:${resumeData.contact.email}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 hover:bg-white/90 border border-gray-200/60 transition-all duration-200 cursor-pointer group">
              <Icon name="email" size={16} className="text-accent" />
              <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary truncate max-w-[180px]">{resumeData.contact.email}</span>
            </a>
          </div>
        </div>

        <p className="text-base leading-relaxed text-text-secondary max-w-3xl font-body">{resumeData.summary}</p>
      </div>
    </section>
  )
}

function ExperienceCard({ exp, index }) {
  return (
    <div 
      className="relative pl-8 pb-10 last:pb-0 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="timeline-line" />
      
      <div className={`absolute left-0 top-0 w-4 h-4 rounded-full border-2 ${exp.type === 'open-source' ? 'bg-green-500 border-green-400' : 'bg-accent border-blue-300'} shadow-lg ${exp.type === 'open-source' ? 'shadow-green-200' : 'shadow-blue-200'}`} />

      <div className="glass-card rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-default">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
          <div>
            <h3 className="font-heading text-lg font-semibold text-text-primary flex items-center gap-2">
              {exp.company}
              {exp.type === 'open-source' && (
                <span className="px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">开源</span>
              )}
            </h3>
            <p className="text-accent font-medium mt-0.5">{exp.role}</p>
          </div>
          <div className="flex flex-col sm:items-end gap-1 text-sm text-text-muted shrink-0">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Icon name="calendar" size={14} />
              {exp.period}
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Icon name="mapPin" size={14} />
              {exp.location}
            </span>
            {exp.reportsTo && (
              <span className="text-xs text-text-muted italic">Reports to: {exp.reportsTo}</span>
            )}
          </div>
        </div>

        {exp.highlights && (
          <ul className="space-y-2.5 mt-4">
            {exp.highlights.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-text-secondary">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/50 shrink-0 mt-2" />
                {typeof item === 'string' ? (
                  <span>{item}</span>
                ) : (
                  <span>
                    <strong className="text-text-primary font-medium">{item.project}</strong>：{item.desc}
                    {item.link && (
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 ml-1.5 text-accent hover:text-blue-700 transition-colors cursor-pointer"
                      >
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
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">核心技术栈</p>
            <div className="flex flex-wrap gap-1.5">
              {exp.techStack.map((tech) => (
                <span key={tech} className="skill-tag px-2.5 py-1 rounded-lg text-xs font-medium text-text-secondary">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SkillSection({ icon, title, skills, colorClass, textColor }) {
  const iconMap = {
    brain: <Icon name="brain" size={22} />,
    database: <Icon name="database" size={22} />,
    code: <Icon name="code" size={22} />,
    users: <Icon name="users" size={22} />
  }

  return (
    <div className="glass-card rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-default h-full group">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
          <span className={textColor}>{iconMap[icon]}</span>
        </div>
        <h3 className="font-heading font-semibold text-text-primary text-lg">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span key={skill} className="skill-tag px-3 py-1.5 rounded-lg text-sm font-medium text-text-secondary">
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

function App() {
  const [visibleExperiences, setVisibleExperiences] = useState(3)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1'
            entry.target.style.transform = 'translateY(0)'
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(20px)'
      el.style.transition = 'all 0.6s ease-out'
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <Hero />

        {/* Education — moved before experience for immediate credibility */}
        <section className="mb-10 animate-on-scroll">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg shadow-cyan-200">
              <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <h2 className="font-heading text-2xl font-bold text-text-primary">教育背景</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent ml-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resumeData.education.map((edu, index) => (
              <div key={index} className={`glass-card rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-default relative overflow-hidden group`}>
                {index === 0 && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-50/60 to-transparent rounded-bl-3xl pointer-events-none" />
                )}
                <div className="relative z-10">
                  <h3 className="font-heading font-semibold text-lg text-text-primary">
                    {edu.school}
                  </h3>
                  <p className="text-accent font-medium mt-1">{edu.degree}</p>
                  <p className="text-sm text-text-secondary mt-1">{edu.major}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 animate-on-scroll">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <Icon name="briefcase" size={20} className="text-white" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-text-primary">工作经历</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent ml-4" />
          </div>

          <div className="relative">
            {resumeData.experiences.slice(0, visibleExperiences).map((exp, index) => (
              <ExperienceCard key={`${exp.company}-${index}`} exp={exp} index={index} />
            ))}
          </div>

          {visibleExperiences < resumeData.experiences.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setVisibleExperiences(resumeData.experiences.length)}
                className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/70 hover:bg-white border border-gray-200/60 hover:border-accent/30 text-sm font-medium text-text-secondary hover:text-accent transition-all duration-200 cursor-pointer"
              >
                展开更多经历
                <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
              </button>
            </div>
          )}
        </section>

        <section className="animate-on-scroll">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200">
              <Icon name="cpu" size={20} className="text-white" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-text-primary">专业技能</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent ml-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkillSection icon="brain" title="AI / 大模型" skills={resumeData.skills.ai} colorClass="bg-blue-50" textColor="text-blue-600" />
            <SkillSection icon="database" title="数据工程" skills={resumeData.skills.data} colorClass="bg-emerald-50" textColor="text-emerald-600" />
            <SkillSection icon="code" title="软件工程" skills={resumeData.skills.engineering} colorClass="bg-orange-50" textColor="text-orange-600" />
            <SkillSection icon="users" title="管理与协作" skills={resumeData.skills.management} colorClass="bg-pink-50" textColor="text-pink-600" />
          </div>
        </section>

        <footer className="mt-12 pt-8 border-t border-gray-200/60 text-center">
          <p className="text-sm text-text-muted">
            最后更新：2024年 · 使用 React + Tailwind CSS 构建
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
