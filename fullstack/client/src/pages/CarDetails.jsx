import React from "react";
import { Button, Image, Card, Divider, Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const CarDetails = () => {
  return (
    <div className="flex flex-col max-w-4xl mx-auto p-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs className="mb-8">
        <BreadcrumbItem><a href="/">Home</a></BreadcrumbItem>
        <BreadcrumbItem isActive>Car Details</BreadcrumbItem>
      </Breadcrumbs>

      {/* Hero Section with Car Image */}
      <div className="flex justify-center mb-8">
        <Image
          src="https://file.kelleybluebookimages.com/kbb/base/evox/CP/54083/2024-Dodge-Durango-front_54083_032_1847x841_PCQ_cropped.png?downsize=800:*"
          alt="Car Image"
          objectFit="cover"
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* Car Information Section */}
      <Card className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">2024 Dodge Durango</h2>
            <div className="flex items-center text-yellow-500">
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <span className="ml-2">5.0</span>
            </div>
          </div>
          <Divider />

          {/* Specifications */}
          <div className="flex flex-col gap-2">
            <p><strong>Body Type:</strong> SUV</p>
            <p><strong>Year Make Model:</strong> 2024 Dodge Durango</p>
            <p><strong>Fuel Economy:</strong> 45 MPG Combined</p>
          </div>
          <Divider />

          {/* Description */}
          <p className="leading-relaxed mt-4">
            The Dodge Durango is a versatile choice in the SUV category, offering ample storage for its size.
            It features a premium interior, a powerful turbocharged engine, and a host of modern tech
            features, making it perfect for families seeking both comfort and performance.
          </p>
        </div>

        {/* Call to Action */}
        <div className="flex justify-between mt-8">
          <Button color="primary">Schedule a Test Drive</Button>
          <Button variant="flat">Get Financing</Button>
        </div>
      </Card>
    </div>
  );
};

export default CarDetails;
