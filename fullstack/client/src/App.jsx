import { useState } from "react";
import { useRoutes } from "react-router-dom";
import Navigation from "./components/Navigation";
import ViewCars from "./pages/ViewCars";
import EditCar from "./pages/EditCar";
import CreateCar from "./pages/CreateCar";
import CarDetails from "./pages/CarDetails";
import CarSearch from "./pages/CarSearch";
function App() {
  let element = useRoutes([
    {
      path: "/",
      element: <CreateCar title="BOLT BUCKET | Customize" />,
    },
    {
      path: "/customcars",
      element: <ViewCars title="BOLT BUCKET | Custom Cars" />,
    },
    {
      path: "/customcars/:id",
      element: <CarDetails title="BOLT BUCKET | View" />,
    },
    {
      path: "/edit/:id",
      element: <EditCar title="BOLT BUCKET | Edit" />,
    },
    {
      path: "/:make",
      element: <CarSearch />
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
