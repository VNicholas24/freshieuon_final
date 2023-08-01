import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import classes from "./topNavBar.module.css";
import PersonIcon from "@mui/icons-material/Person";
import { useRouter } from "next/router";
import { Menu } from "@mui/icons-material";

interface TopNavBarProps {
  children: React.ReactNode;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ children }) => {
  const [activeLink, setActiveLink] = useState("");
  const router = useRouter();
  const link = router.asPath;
  console.log(link, "hi");

  const handleMouseEnter = (link: string) => {
    if (link.startsWith("about")) {
      setActiveLink("about");
    } else if (link.startsWith("academic")) {
      setActiveLink("academic");
    } else if (link.startsWith("getting-around")) {
      setActiveLink("getting-around");
    } else if (link.startsWith("studentlife")) {
      setActiveLink("studentlife");
    } else if (link.startsWith("support")) {
      setActiveLink("support");
    } else if (link.startsWith("testimonial")) {
      setActiveLink("testimonial");
    } else if (link.startsWith("faq")) {
      setActiveLink("faq");
    } else {
      setActiveLink("home");
    }
  };

  const handleMouseLeave = () => {
    setActiveLink("");
  };

  return (
    <main className={classes.container}>
      <div className={classes.navbarcontainer}>
        <h3 className={classes.title}>
          Freshie <sup className={classes.titleSup}>UON</sup>
        </h3>
        <div className={`navbar ${classes.mobile}`}>
          <div
            className={classes.hamburgerMenu}
            onClick={() =>
              setActiveLink(activeLink === "hamburger" ? "" : "hamburger")
            }
          >
            <Menu
              className={`${classes.hamburgerIcon} ${
                activeLink === "hamburger" ? classes.active : ""
              }`}
            />
            <span
              className={`${classes.hamburgerLabel} ${
                activeLink === "hamburger" ? classes.active : ""
              }`}
            >
              Menu
            </span>
          </div>
          {activeLink === "hamburger" && (
            <div className={classes.mobileMenu}>
              <a href="/">Home</a>
              <a href="/aboutus">About Us</a>
              <a href="/aboutSchool">About School</a>
              <a href="/courses">Courses</a>
              <a href="/tips">Tips & Tricks</a>
              <a href="/preparation-guide">Preparation Guide</a>
              <a href="/getting-around-sg">Getting Around SG</a>
              <a href="/getting-around-campus">Getting Around Campus</a>
              <a href="/accommodation">Accommodation</a>
              <a href="/studentclub">Student Club</a>
              <a href="/studentstories">Student Stories</a>
              <a href="/support">Support</a>
              <a href="/faq">Faq</a>
              <a href="/testimonial">Testimonials</a>
            </div>
          )}
        </div>
        <div className={classes.navbar}>
          <div
            className={`${classes.linkContainer} ${
              activeLink === "home" ? classes.active : ""
            }`}
            onMouseEnter={() => handleMouseEnter("home")}
            onMouseLeave={handleMouseLeave}
          >
            <a className={classes.link} href="/">
              Home
            </a>
          </div>
          <div
            className={`${classes.linkContainer} ${
              activeLink === "about" ? classes.active : ""
            }`}
            onMouseEnter={() => handleMouseEnter("about")}
            onMouseLeave={handleMouseLeave}
          >
            <a className={classes.link} href="/aboutus">
              About
            </a>
            {activeLink === "about" && (
              <div className={classes.subNav}>
                <a className={classes.subLink} href="/aboutus">
                  About Us
                </a>
                <a className={classes.subLink} href="/aboutSchool">
                  About School
                </a>
              </div>
            )}
          </div>
          <div
            className={`${classes.linkContainer} ${
              activeLink === "academic" ? classes.active : ""
            }`}
            onMouseEnter={() => handleMouseEnter("academic")}
            onMouseLeave={handleMouseLeave}
          >
            <a className={classes.link} href="/courses">
              Academic
            </a>
            {activeLink === "academic" && (
              <div className={classes.subNav}>
                <a className={classes.subLink} href="/courses">
                  Courses
                </a>
                <a className={classes.subLink} href="/tips">
                  Tips & Tricks
                </a>
                <a className={classes.subLink} href="/preparation-guide">
                  Preparation Guide
                </a>
              </div>
            )}
          </div>
          <div
            className={`${classes.linkContainer} ${
              activeLink === "getting-around" ? classes.active : ""
            }`}
            onMouseEnter={() => handleMouseEnter("getting-around")}
            onMouseLeave={handleMouseLeave}
          >
            <a className={classes.link} href="/getting-around-sg">
              Getting Around
            </a>
            {activeLink === "getting-around" && (
              <div className={classes.subNav}>
                <a className={classes.subLink} href="/getting-around-sg">
                  Getting Around SG
                </a>
                <a className={classes.subLink} href="/getting-around-campus">
                  Getting Around Campus
                </a>
              </div>
            )}
          </div>
          <div
            className={`${classes.linkContainer} ${
              activeLink === "studentlife" ? classes.active : ""
            }`}
            onMouseEnter={() => handleMouseEnter("studentlife")}
            onMouseLeave={handleMouseLeave}
          >
            <a className={classes.link} href="/studentclub">
              Student Life
            </a>
            {activeLink === "studentlife" && (
              <div className={classes.subNav}>
                <a className={classes.subLink} href="/accommodation">
                  Accommodation
                </a>
                <a className={classes.subLink} href="/studentclub">
                  Student Club
                </a>
                <a className={classes.subLink} href="/studentstories">
                  Student Stories
                </a>
              </div>
            )}
          </div>
          <div
            className={`${classes.linkContainer} ${
              activeLink === "support" ? classes.active : ""
            }`}
            onMouseEnter={() => handleMouseEnter("support")}
            onMouseLeave={handleMouseLeave}
          >
            <a className={classes.link} href="/support">
              Support
            </a>
          </div>
          <div
            className={`${classes.linkContainer} ${
              activeLink === "faq" ? classes.active : ""
            }`}
            onMouseEnter={() => handleMouseEnter("faq")}
            onMouseLeave={handleMouseLeave}
          >
            <a className={classes.link} href="/faq">
              Faq
            </a>
          </div>
          <div
            className={`${classes.linkContainer} ${
              activeLink === "testimonial" ? classes.active : ""
            }`}
            onMouseEnter={() => handleMouseEnter("testimonial")}
            onMouseLeave={handleMouseLeave}
          >
            <a className={classes.link} href="/testimonial">
              Testimonials
            </a>
          </div>
        </div>
        <div></div>
      </div>
      <div style={{ width: "100%" }}>{children}</div>
    </main>
  );
};

export default TopNavBar;
