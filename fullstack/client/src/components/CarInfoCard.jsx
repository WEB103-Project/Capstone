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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const CarInfoCard = () => {
  return (
    <Card className="max-w-[340px]">
      <CardBody>
        <p>Body Typw</p>
        <p>Year Make Model</p>
        <Image src="https://file.kelleybluebookimages.com/kbb/base/evox/CP/54083/2024-Dodge-Durango-front_54083_032_1847x841_PCQ_cropped.png?downsize=300:*"/>
        <Divider />
        <CardHeader>
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <p>5.0</p>
        </CardHeader>
        <Divider />
        <div className="flex">
            <p>45 MPG</p>
            <p>Combined Fuel Economy</p>
        </div>
        <p>The Make Model is avalue of choice in Bodytype SUVs packing a lot of storage for a small size. It has a premium interior, a lively turbocharged engine and tons of standard tech features for the modern family</p>
        
      </CardBody>
      <CardFooter>
        <Button>More Details</Button>
      </CardFooter>
    </Card>
  );
};

export default CarInfoCard;
