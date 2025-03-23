// This is a temporary mock for framer-motion
export const motion = {
    div: (props: any) => <div {...props} />,
    section: (props: any) => <section {...props} />,
    span: (props: any) => <span {...props} />,
    p: (props: any) => <p {...props} />,
    h1: (props: any) => <h1 {...props} />,
    h2: (props: any) => <h2 {...props} />,
    h3: (props: any) => <h3 {...props} />,
    ul: (props: any) => <ul {...props} />,
    li: (props: any) => <li {...props} />,
    a: (props: any) => <a {...props} />,
    button: (props: any) => <button {...props} />,
    img: (props: any) => <img {...props} />,
  };
  
  export const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;
  
  export const useAnimation = () => ({
    start: () => Promise.resolve(),
    stop: () => {},
  });
  
  export const useInView = () => [null, false];
  
  export const useScroll = () => ({
    scrollYProgress: { current: 0 },
  });
  
  export const useTransform = () => 0;