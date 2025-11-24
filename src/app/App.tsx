import { ConfigProvider, App as AntdApp } from 'antd';
import { AppRouter } from './routes';
import { antdTheme } from '@shared/config';
import { ErrorBoundary } from './providers';
import './styles/index.css';

/**
 * Главный компонент приложения
 * Инициализирует провайдеры и роутинг
 */
function App() {
  return (
    <ErrorBoundary>
      <ConfigProvider theme={antdTheme}>
        <AntdApp>
          <AppRouter />
        </AntdApp>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

export default App;
