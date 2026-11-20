import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import AppRoutes from './routes/AppRoutes';
import './assets/styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>,
);
