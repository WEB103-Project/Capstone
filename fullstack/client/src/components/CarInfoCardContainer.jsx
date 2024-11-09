import React from "react";
import {
  Button,
  Pagination,
  Checkbox,
  Input,
  Spacer,
  CardBody,
  CardFooter,
  CardHeader,
  CheckboxGroup,
  BreadcrumbItem,
  Card,
  Breadcrumbs,
  Divider,
  Image,
  Navbar,
  NavbarItem,
} from "@nextui-org/react";
import CarInfoCard from "../components/CarInfoCard";

const CarInfoCardContainer = () => {
  return (
    <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
      <CarInfoCard />
    </div>
  );
};


export default CarInfoCardContainer