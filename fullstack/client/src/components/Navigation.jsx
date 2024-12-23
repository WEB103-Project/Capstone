import React from "react";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  Link as NextUILink,
  NavbarItem,
} from "@nextui-org/react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <Navbar shouldHideOnScroll isBordered className="bg-[#f0b324]">
      <NavbarBrand>
        <p className="font-bold text-inherit text-3xl">The Car Encyclopedia</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link to="/" className="text-foreground">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/viewcars" className="text-foreground">
            Find Cars
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/comparecars" className="text-foreground">
            Compare Cars
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={NextUILink}
            radius="sm"
            className="border-[#191A23] text-[#191A23]"
            href="/signup" // Navigate to Signup
            variant="bordered"
          >
            Sign Up
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={NextUILink}
            radius="sm"
            className="border-[#191A23] text-[#191A23]"
            href="/login" // Navigate to Login
            variant="bordered"
          >
            Login
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Navigation;
