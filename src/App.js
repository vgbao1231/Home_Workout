import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes';
import { useSelector } from 'react-redux';
import Toast from './components/ui/Toast/Toast';
import SidebarLayout from './layout/SidebarLayout/SidebarLayout';

function App() {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { toasts } = useSelector((state) => state.toast);
    // return <TestPage />;
    // return (
    //     <Router>
    //         <div className="toast-container">
    //             {toasts.map((toast) => {
    //                 return <Toast key={toast.id} toast={toast} />;
    //             })}
    //         </div>
    //         <RegisterPage />
    //     </Router>
    // );
    return (
        <Router>
            <div className="App">
                <div className="toast-container">
                    {toasts.map((toast) => {
                        return <Toast key={toast.id} toast={toast} />;
                    })}
                </div>
                <Routes>
                    {isAuthenticated
                        ? privateRoutes.map((route, index) => {
                              const Page = route.component;
                              const Layout = SidebarLayout;
                              return (
                                  <Route
                                      key={index}
                                      path={route.path}
                                      element={
                                          <Layout>
                                              <Page />
                                          </Layout>
                                      }
                                  />
                              );
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
