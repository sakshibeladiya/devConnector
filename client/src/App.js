
import './App.css';
import { Fragment } from 'react';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//redux
import { Provider } from 'react-redux';
import store from './store.js';
import Alert from './components/layout/alert';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import Dashboard from './components/dashboard/dashboard';
import EditProfile from './components/profile-forms/edit-profile';
import CreateProfile from './components/profile-forms/CreateProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import PrivateRoute from './components/routing/privateRouting';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <section className='container'>
            <Alert />
            <Routes>
              <Route path='/' element={<Landing />} />
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />
              <Route path='/profiles' element={<Profiles />} />
              <Route path='/dashboard' element={<PrivateRoute component={Dashboard} />} />
              <Route path='/create-profile' element={<PrivateRoute component={CreateProfile} />} />
              <Route path='/edit-Profile' element={<PrivateRoute component={EditProfile} />} />
              <Route path='/add-experience' element={<PrivateRoute component={AddExperience} />} />
              <Route path='/add-education' element={<PrivateRoute component={AddEducation} />} />

            </Routes>
          </section>
        </Fragment>
      </Router>
    </Provider>
  )
};



export default App;
