import React from 'react'
import SoundsListComponent from './modules/sounds/components/SoundsListComponent'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import getSounds from './modules/sounds/reducers/sounds'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { FullState, AnyAction } from './types'

const reducers = combineReducers({ getSounds })
const store = createStore<FullState, AnyAction, { dispatch: unknown }, unknown>(
  reducers,
  undefined,
  composeWithDevTools(applyMiddleware(thunk))
)

const App = () => (
  <div>
    <h1 className="code f5 fl w-100 pa2">talkboy-9000</h1>
    <Provider store={store}>
      <SoundsListComponent />
    </Provider>
  </div>
)

export default App
