import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import Profile from './pages/Profile'
import About from './pages/About'
import SignUp from './pages/Signup'
import SignIn from './pages/Signin'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'
 
 const App = () => {
   return (
     <BrowserRouter>
        <Header/>
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/sign-in' element={<SignIn/>} />
            <Route path='/sign-up' element={<SignUp/>} />
            <Route path='/about' element={<About/>} />
        
            /*PRIVATE ROUTES */
            <Route  element={<PrivateRoute/>}>
              <Route path='/profile' element={<Profile/>} />
              <Route path='/create-listing' element={<CreateListing/>} />
            </Route>

        </Routes>
     </BrowserRouter>
   )
 }
 
 export default App