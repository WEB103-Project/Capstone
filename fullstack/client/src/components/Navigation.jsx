import React from "react";
import { Button, Navbar, NavbarBrand, NavbarContent, Link, NavbarItem } from "@nextui-org/react";

const Navigation = () => {
  return (
    <Navbar shouldHideOnScroll isBordered className="bg-[#f0b324]">
    <NavbarBrand>
      <p className="font-bold text-inherit text-3xl">The Car Encyclopedia</p>
    </NavbarBrand>
    <NavbarContent className="hidden sm:flex gap-4" justify="center">
      <NavbarItem>
        <Link color="foreground" href="#">
          Find Cars
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Link color="foreground" href="#">
          Compare Cars
        </Link>
      </NavbarItem>
    </NavbarContent>
    <NavbarContent justify="end">
      <NavbarItem>
        <Button as={Link} radius="sm" className="border-[#191A23] text-[#191A23]" href="#" variant="bordered">
          Sign Up
        </Button>
      </NavbarItem>
    </NavbarContent>
  </Navbar>
  );
};


export default Navigation;
