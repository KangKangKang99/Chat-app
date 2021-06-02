import './App.scss';
import {Switch,Route,BrowserRouter as Router} from 'react-router-dom'
/*pages*/
import Chatbox from "./Pages/ChatBox/Chatbox";
import LoginPage from "./Pages/Login/LoginPage";
/*end pages*/
function App() {
  return (
    <div className="App">
        <Router>
          <Switch>
              <Route exact path='/'>
                  <Chatbox/>
              </Route>
              <Route path='/login'>
                  <LoginPage/>
              </Route>
          </Switch>
        </Router>
    </div>
  );
}

export default App;
