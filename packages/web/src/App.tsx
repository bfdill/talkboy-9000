import React from 'react'
import logo from './logo.svg'
import './App.css'
import SoundsListComponent from './modules/sounds/components/SoundsListComponent'
import { createStore, applyMiddleware } from 'redux'
import reducer from './modules/sounds/reducers/sounds'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

const store = createStore<any, any, any, any>(
  reducer,
  {
    sounds: []
  },
  composeWithDevTools(applyMiddleware(thunk))
)

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Provider store={store}>
          <SoundsListComponent />
        </Provider>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
