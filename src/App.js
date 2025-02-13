import logo from './logo.svg';
import './App.css';
import { Routes, Route } from "react-router-dom";
import Header from "../src/view/components/Header/AdminHeader";

function App() {
  return (
    <>
    <Routes>
    <Route path="/" element={<Header />} />
    </Routes>
  
  
     </>
  );
}

export default App;
