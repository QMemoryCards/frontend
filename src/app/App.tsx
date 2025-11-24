import { ConfigProvider, App as AntdApp } from 'antd';
import { AppRouter } from './routes';
import { antdTheme } from '@shared/config';
import './styles/index.css';

/**
 * Главный компонент приложения
 * Инициализирует провайдеры и роутинг
 */
function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <AntdApp>
        <AppRouter />
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
