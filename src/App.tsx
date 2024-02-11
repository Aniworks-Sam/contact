import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import AllContacts from './pages/AllContacts';
import SignUp from './components/Auth/SignUp';
import SignIn from './components/Auth/SignIn';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<SignUp/> } />
        <Route path="/contacts" element={<AllContacts />} />
        <Route path="/signIn" element={<SignIn />} />
      </Routes>
    </Layout>
  );
};

export default App;
