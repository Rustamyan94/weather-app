import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { store } from "./store/store";
import Home from "./screens/Home";
import NotFound from "./screens/NotFound";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const Layout = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        theme="light"
        icon={false}
        style={{ fontSize: "15px" }}
        progressStyle={{
          backgroundColor: "#d10000",
          zIndex: 999999999999999,
        }}
      />
      <Header />
      <Outlet />
    </>
  );
};

function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },

        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ]);

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
