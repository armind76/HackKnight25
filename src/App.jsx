import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DailyTasks from './components/DailyTasks';
import PlanGenerator from './components/PlanGenerator'
import Home from './components/Home'
const ProfileComponent = () => (
  <div className="p-8 text-center">
    <h1 className="text-3xl font-bold text-gray-100">Your Profile</h1>
  </div>
);


function App() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<PlanGenerator/>} />
          <Route path="/challenges" element={<DailyTasks />} />
          <Route path="/profile" element={<Home/>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
