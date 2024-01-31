import React from "react";
import { cn } from "src/utils";

interface Props {
  children?: React.ReactNode;
  className?: string;
}

const Layout = (props: Props) => {
  const { children, className } = props;
  return <div className={cn(className, "flex flex-row")}>{children}</div>;
};

export default Layout;

// flexbox, grid
