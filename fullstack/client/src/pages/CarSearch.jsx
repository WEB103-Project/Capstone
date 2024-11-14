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
  NavbarItem
} from "@nextui-org/react";
import CarInfoCardContainer from "../components/CarInfoCardContainer"

function CarSearch() {
  return (
    <div className="mx-4 ">
      <div >
        <Breadcrumbs>
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem>Make</BreadcrumbItem>
        </Breadcrumbs>
      </div>
        <Divider className="my-4"/>
        <div>
            <Navbar
            classNames={{
                item: [
                  "flex",
                  "relative",
                  "h-full",
                  "items-center",
                  "data-[active=true]:after:content-['']",
                  "data-[active=true]:after:absolute",
                  "data-[active=true]:after:bottom-0",
                  "data-[active=true]:after:left-0",
                  "data-[active=true]:after:right-0",
                  "data-[active=true]:after:h-1",
                  "data-[active=true]:after:rounded-[2px]",
                  "data-[active=true]:after:bg-[#f0b324]",
                ],
              }}>
                <NavbarItem isActive>All (21)</NavbarItem>
                <button>Cars (10)</button>
                <button>SUVs (9)</button>
                <button>Hatchbacks (2)</button>
            </Navbar>
            <div className="my-4">
            <CarInfoCardContainer/>
              
            </div>
        </div>
    </div>
  );
}

export default CarSearch;
