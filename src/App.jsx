import './App.css'
import { Route, Routes } from 'react-router-dom'
import { publicRoutes } from './routes/routes'
import DefaultLayout from './layouts/DefautLayout/DefaultLayout'

function App() {
  return (
    <div className="">
      <Routes>
        {publicRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <DefaultLayout>
                <route.component />
              </DefaultLayout>
            }
          />
        ))}
      </Routes>
    </div>
  )
}

export default App
