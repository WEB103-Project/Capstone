import React from "react";
import {
  Button,
  CardBody,
  CardFooter,
  CardHeader,
  Card,
  Divider,
  Image,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const CarInfoCard = () => {
  return (
    <Card className="max-w-[340px]">
      <CardBody>
        <p>Body Type</p>
        <p>Year Make Model</p>
        <Image
          src="https://file.kelleybluebookimages.com/kbb/base/evox/CP/54083/2024-Dodge-Durango-front_54083_032_1847x841_PCQ_cropped.png?downsize=300:*"
          alt="Car Image"
        />
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
        <p>
          The Dodge Durango is a value-packed choice among SUVs, offering ample
          storage, a premium interior, a lively turbocharged engine, and plenty
          of tech features for the modern family.
        </p>
      </CardBody>
      <CardFooter>
        <Link to="/cardetails/2">
          <Button>More Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CarInfoCard;
