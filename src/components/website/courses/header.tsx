import classes from "./header.module.css";
import "tailwindcss/tailwind.css";

interface HeaderProps {
  title: string;
  description: string;
  imageUrl: string;
  height: string;
}

const Header: React.FC<HeaderProps> = ({ title, description, imageUrl }) => {
  return (
    <div
      className={classes.container}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <h1 className={classes.headerTitle}>{title}</h1>
      <p className={classes.headerDescription}>{description}</p>
    </div>
  );
};

export default Header;
