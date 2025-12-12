import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './component/Navbar/navbar'
import MenuDetail from './component/Menu/menudetail'
import Login from './component/auth/login'
import Home from './component/page/home'
import OrderList from './component/Menu/orderlist'
import RevenueChart from './component/management/revenueChart'
import SettingsPage from './component/management/restaurant'
import SettingMenu from './component/management/menu'
import SearchPage from './component/search/searchPage'
import SettingOrder from './component/order/orderPage'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        
        <Route
          path="/:table_number"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />

        <Route
          path="/:table_number/menu/:id"
          element={
            <>
              <Navbar />
              <MenuDetail />
            </>
          }
        />

        <Route
          path="/:table_number/order"
          element={
            <>
              <Navbar />
              <OrderList />
            </>
          }
        />

        <Route
          path="/:table_number/search"
          element={
            <>
              <Navbar />
              <SearchPage />
            </>
          }
        />

        <Route
          path="/:table_number/login/"
          element={
            <>
              <Navbar />
              <Login />
            </>
          }
        />

        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <RevenueChart />
            </>
          }
        />

        <Route
          path="/settingPage"
          element={
            <>
              <Navbar />
              <SettingsPage />
            </>
          }
        />

        <Route
          path="/settingMenu"
          element={
            <>
              <Navbar />
              <SettingMenu />
            </>
          }
        />

        <Route
          path="/settingOrder"
          element={
            <>
              <Navbar />
              <SettingOrder />
            </>
          }
        />
      </Routes>
    </BrowserRouter>

  )
}

export default App