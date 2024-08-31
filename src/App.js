import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes';
import { useAuth } from './hooks/useAuth';

function App() {
    const { isAuthenticated } = useAuth();
    console.log(isAuthenticated);

    return (
        <Router>
            <div className="App">
                <Routes>
                    {isAuthenticated
                        ? privateRoutes.map((route, index) => {
                              const Page = route.component;
                              return <Route key={index} path={route.path} element={<Page />} />;
                          })
                        : publicRoutes.map((route, index) => {
                              const Page = route.component;
                              return <Route key={index} path={route.path} element={<Page />} />;
                          })}

                    <Route path="*" element={isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
