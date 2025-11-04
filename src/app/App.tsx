import { ConfigProvider } from 'antd';
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
      <AppRouter />
    </ConfigProvider>
  );
}

export default App;
