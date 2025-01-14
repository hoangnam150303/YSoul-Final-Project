
import { Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/GeneralPages/LoginPage'
import { MovieHomePage } from './pages/MoviePages/MovieHomePage'
import { SignUpPage } from './pages/GeneralPages/SignUpPage'
import { ApproveAccount } from './pages/GeneralPages/ApproveAccount'


function App() {
  return (
   <Routes>
    <Route path="/" element={<MovieHomePage />}></Route>
    <Route path="/login" element={<LoginPage/>}></Route>
    <Route path="/signup" element={<SignUpPage />}></Route>
    <Route path='/approve' element={<ApproveAccount />}></Route>
   </Routes>
  )
}

export default App
