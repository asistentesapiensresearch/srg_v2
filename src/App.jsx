import './App.css'
import { RouterProvider } from './router'

import { Provider } from 'react-redux'
import store from './store'

function App() {
  return (
    <>
      <Provider store={store}>
        <RouterProvider />
      </Provider>
    </>
  )
}

export default App
