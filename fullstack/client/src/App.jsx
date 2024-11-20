import { useState } from "react";
import { useRoutes } from "react-router-dom";
import Navigation from "./components/Navigation";
import ViewCars from "./pages/ViewCars";
import EditCar from "./pages/EditCar";
import CarDetails from "./pages/CarDetails";
import CarSearch from "./pages/CarSearch";
import Home from "./pages/Home";

function App() {
  let element = useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/cardetails/id",
      element: <CarDetails />,
    },
    // {
    //   path: "/edit/:id",
    //   element: <EditCar title="BOLT BUCKET | Edit" />,
    // },
    // {
    //   path: "/:make",
    //   element: <CarSearch />,
    // },
    { //navbar FindCars
      path: "/viewcars",
      element: <ViewCars />,
    },

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
