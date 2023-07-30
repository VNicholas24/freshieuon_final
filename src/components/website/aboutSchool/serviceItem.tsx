import { useState } from "react";
import Link from "next/link";
import classes from "./serviceItem.module.css";
import { serviceList } from "./serviceList";

interface Service {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  pageUrl: string;
  imageURL: string;
  pageURL: string;
}

interface ServiceItemProps {
  service: serviceList;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ service }) => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  if(!service.pageURL){
    service.pageURL = ""
  }
  return (
    <Link href={service.pageURL} passHref>
      <div
        className={`${classes.serviceContainer} ${
          hovered ? classes.hovered : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={classes.contentContainer}>
          <img className={classes.image} src={service.iconurl} alt="Image" />
          <h2 className={classes.title}>{service.title}</h2>
          <div
            className={`${classes.descriptionContainer} ${
              hovered ? classes.hovered : ""
            }`}
          >
            <p className={classes.description}>{service.description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceItem;
