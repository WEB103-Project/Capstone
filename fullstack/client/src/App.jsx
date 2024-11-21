import { useState } from "react";
import { useRoutes } from "react-router-dom";
import Navigation from "./components/Navigation";
import ViewCars from "./pages/ViewCars";
import EditCar from "./pages/EditCar";
import CarDetails from "./pages/CarDetails";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import CarSearch from "./pages/CarSearch";
import Home from "./pages/Home";
import CompareCars from "./pages/CompareCars";

function App() {
  let element = useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/cardetails/:id",
      element: <CarDetails />,
    },
    {
      path: "/:make",
      element: <CarSearch />,
    },
    {
      path: "/viewcars",
      element: <ViewCars />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/comparecars",
      element: <CompareCars />,
    }

  ]);

  return (
    <>
      <div className="flex flex-wrap gap-4 items-center">
        <Navigation />
        <div className="w-full">{element}</div>
      </div>
    </>
  );
}

export default App;
