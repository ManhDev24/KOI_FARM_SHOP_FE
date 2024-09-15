import './App.css';
import { Route, Routes } from 'react-router-dom';
import { publicRoutes } from './routes/routes';
import React from 'react'; 
import DefaultLayout from './layouts/DefautLayout/DefaultLayout'; 

function App() {
  return (
    <div className="">
      <Routes>
        {publicRoutes.map((route, index) => {
          const Layout = route.layout || React.Fragment; 
          const Component = route.component;
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Component />
                </Layout>
              }
            />
          );
        })}
      </Routes>
    </div>
  );
}

export default App;
