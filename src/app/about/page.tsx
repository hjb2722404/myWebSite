'use client'

import { motion } from 'framer-motion'

const skills = [
  {
    category: '前端开发',
    items: ['React', 'Vue', 'TypeScript', 'Next.js', 'Webpack', 'Tailwind CSS']
  },
  {
    category: '技术管理',
    items: ['团队管理', '技术规划', '敏捷开发', '代码审查', '性能优化']
  },
  {
    category: '工程实践',
    items: ['CI/CD', '自动化测试', '微前端架构', '组件库开发', '前端工程化']
  }
]

const experiences = [
  {
    title: '前端开发 Leader',
    company: '当前公司',
    period: '2020 - 至今',
    description: [
      '领导10+人的前端开发团队，负责公司核心产品的前端架构和开发',
      '推动前端工程化建设，提升团队开发效率30%',
      '设计和实现企业级组件库，提高开发效率和产品一致性',
      '主导微前端架构的落地，实现多团队协作开发'
    ]
  },
  {
    title: '高级前端开发工程师',
    company: '前公司',
    period: '2018 - 2020',
    description: [
      '负责公司电商平台的前端开发和优化',
      '实现了首屏加载时间减少50%的性能优化目标',
      '设计并实现了多个复杂的交互功能'
    ]
  }
]

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            关于我
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            作为一名前端开发 Leader，我专注于打造高性能、可扩展的 Web 应用，
            同时致力于团队建设和技术创新。我相信技术不仅要解决问题，更要创造价值。
          </p>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12"
          >
            技术栈 & 专业技能
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {skills.map((skillGroup, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {skillGroup.category}
                </h3>
                <ul className="space-y-2">
                  {skillGroup.items.map((skill, skillIndex) => (
                    <li
                      key={skillIndex}
                      className="text-gray-600 dark:text-gray-300 flex items-center"
                    >
                      <span className="mr-2">•</span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12"
          >
            工作经历
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {experiences.map((experience, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {experience.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {experience.company}
                    </p>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
                    {experience.period}
                  </p>
                </div>
                <ul className="space-y-2">
                  {experience.description.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="text-gray-600 dark:text-gray-300 flex items-start"
                    >
                      <span className="mr-2 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-6"
          >
            与我联系
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8"
          >
            如果您对我的经历感兴趣，或者想要探讨技术相关的话题，欢迎随时与我联系。
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex justify-center space-x-4"
          >
            <a
              href="mailto:your.email@example.com"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              发送邮件
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
