import type { ThemeConfig } from 'antd';

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',

    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',

    borderRadius: 6,

    colorBgContainer: '#ffffff',
    colorBgLayout: '#f0f2f5',
  },
  components: {
    Button: {
      controlHeight: 40,
      fontWeight: 500,
    },
    Input: {
      controlHeight: 40,
    },
    Modal: {
      borderRadiusLG: 8,
    },
  },
};
