import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './component/Navbar/navbar'
import MenuDetail from './component/Menu/menudetail'
import Login from './component/auth/login'
import Home from './component/page/home'
import OrderList from './component/Menu/orderlist' 

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path= "/menu" element={<MenuDetail />} />
        <Route path= "/order" element={<OrderList />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App