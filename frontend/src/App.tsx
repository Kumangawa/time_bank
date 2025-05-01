import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RegisterPage from './components/RegisterPage';
import UserPage from './components/UserPage';
import ServicesPage from './components/ServicesPage';
import RequestsPage from './components/RequestsPage';
import TransactionsPage from './components/TransactionsPage';
import './style.css';


function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Register</Link> | 
          <Link to="/user">User</Link> | 
          <Link to="/services">Services</Link> | 
          <Link to="/requests">Requests</Link> | 
          <Link to="/transactions">Transactions</Link>
        </nav>
        <Routes>
          <Route path="/" element={<RegisterPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
