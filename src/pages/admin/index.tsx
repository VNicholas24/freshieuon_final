import { FunctionComponent, useEffect } from "react";
import { motion, useViewportScroll, useTransform } from "framer-motion";
import { useSpring, animated } from "@react-spring/web";
import { css, Global } from "@emotion/react";

interface WelcomePageProps { }

const WelcomePage: FunctionComponent<WelcomePageProps> = () => {

  useEffect(() => {
    if (typeof window !== "undefined") { 
      const WebFont = require('webfontloader');
      WebFont.load({
        google: {
          families: ['Playfair Display:700', 'Roboto']
        }
      });
    }
  }, []);

  const { scrollYProgress } = useViewportScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const welcomeAnimationProps = useSpring({
    from: { opacity: 0, transform: "scale(0.5)" },
    to: { opacity: 1, transform: "scale(1)" },
    delay: 1000,
    config: { tension: 120, friction: 20 }, 
  });

  const messageAnimationProps = useSpring({
    from: { opacity: 0, marginTop: 50 },
    to: { opacity: 1, marginTop: 0 },
    delay: 2000, 
    config: { tension: 120, friction: 20 },
  });

  return (
    <>
      <Global
        styles={css`
          body {
            background: #EDF6FF;
            overflow-x: hidden;
            font-family: 'Roboto', sans-serif;
          }
          h1, h2 {
            font-family: 'Playfair Display', serif;
          }
        `}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 65px)", 
          overflow: "hidden",
        }}
      >
        <motion.div style={{ scale }}>
          <animated.h1 style={{ ...welcomeAnimationProps, fontSize: '4em', color: "#000000", textAlign: "center" }}>
            Welcome to Freshie <sup>UON</sup>
          </animated.h1>
          <animated.h2 style={{ ...messageAnimationProps, color: "#000000", textAlign: "center", maxWidth: '80%', margin: '0 auto' }}>
            Please select any categories in the sidebar to get started.
          </animated.h2>
        </motion.div>
      </div>
    </>
  );
};

export default WelcomePage;
