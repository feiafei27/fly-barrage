import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Fly Barrage 官网",
  description: "弹幕库",
  srcDir: 'src',
  head: [['link', { rel: 'icon', href: '/assets/icons/head.png' }]],
  themeConfig: {
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/quick-start' },
            { text: '弹幕渲染器', link: '/guide/barrage-render-instance' },
            { text: '弹幕', link: '/guide/barrage' },
            { text: '字体描边及阴影', link: '/guide/barrage-stroke-shadow' },
            { text: '弹幕渲染图片', link: '/guide/barrage-image' },
            { text: '钩子函数', link: '/guide/render-hook.md' },
            { text: '蒙版（实现人像免遮挡）', link: '/guide/mask.md' },
            { text: '渲染配置', link: '/guide/render-config' },
            { text: '开发配置', link: '/guide/dev-config.md' },
            { text: 'Canvas && 渲染上下文', link: '/guide/canvas-ctx.md' },
          ]
        }
      ],
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/feiafei27/fly-barrage'
      },
      {
        icon: {
          svg: '<svg t="1706259994106" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4177" width="200" height="200"><path d="M512 512m-494.933333 0a494.933333 494.933333 0 1 0 989.866666 0 494.933333 494.933333 0 1 0-989.866666 0Z" fill="#C71D23" p-id="4178"></path><path d="M762.538667 457.045333h-281.088a24.4736 24.4736 0 0 0-24.439467 24.405334v61.098666c-0.034133 13.5168 10.922667 24.439467 24.405333 24.439467h171.1104c13.5168 0 24.439467 10.922667 24.439467 24.439467v12.219733a73.3184 73.3184 0 0 1-73.3184 73.3184h-232.209067a24.439467 24.439467 0 0 1-24.439466-24.439467v-232.174933a73.3184 73.3184 0 0 1 73.3184-73.3184h342.152533c13.482667 0 24.405333-10.922667 24.439467-24.439467l0.034133-61.098666a24.405333 24.405333 0 0 0-24.405333-24.439467H420.352a183.296 183.296 0 0 0-183.296 183.296V762.538667c0 13.482667 10.922667 24.439467 24.405333 24.439466h360.516267a164.9664 164.9664 0 0 0 165.000533-165.000533v-140.526933a24.439467 24.439467 0 0 0-24.439466-24.439467z" fill="#FFFFFF" p-id="4179"></path></svg>'
        },
        link: 'https://gitee.com/fei_fei27/fly-barrage'
      },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present fei'
    },

    search: {
      provider: 'local',
    },
  },
  markdown: {
    image: {
      // 默认禁用图片懒加载
      lazyLoading: true
    }
  }
})
