import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskForm from './components/TaskForm';
import FormDisplay from './components/FormDisplay';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskForm />} />
        <Route path="/FormDisplay" element={<FormDisplay />} />
      </Routes>
    </Router>
  );
}

export default App;
