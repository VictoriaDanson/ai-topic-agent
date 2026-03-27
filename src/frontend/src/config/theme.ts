/**
 * 主题配置文件
 * 统一管理应用的颜色、间距等主题变量
 */

export const theme = {
  // 主色调
  colors: {
    // 主色 - Ant Design 蓝
    primary: '#1890ff',
    primaryLight: '#40a9ff',
    primaryDark: '#096dd9',
    primaryBg: 'rgba(24, 144, 255, 0.1)',
    primaryShadow: 'rgba(24, 144, 255, 0.2)',

    // 辅助色
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#1890ff',

    // 中性色
    text: '#333333',
    textSecondary: '#666666',
    textDisabled: '#999999',
    border: '#d9d9d9',
    divider: '#e8e8e8',
    background: '#ffffff',
    backgroundLight: '#fafafa',
    backgroundDark: '#f5f5f5',

    // 渐变色
    gradient: {
      primary: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
      secondary: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'
    }
  },

  // 间距
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },

  // 圆角
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    round: '50%'
  },

  // 阴影
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.05)',
    md: '0 4px 12px rgba(0, 0, 0, 0.1)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.15)',
    primary: '0 4px 12px rgba(24, 144, 255, 0.25)'
  },

  // 过渡动画
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
    cubic: '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },

  // 字体
  fonts: {
    base: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
    code: `'Menlo', 'Monaco', 'Courier New', monospace`
  },

  // 字号
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px'
  },

  // 断点
  breakpoints: {
    xs: '480px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1600px'
  }
}

export default theme
