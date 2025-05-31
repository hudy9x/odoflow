import { ReactNode } from "react";

export default function RouteLayout({
    children,
  }: Readonly<{
    children: ReactNode;
  }>) {
    return (
      <main>{children}</main>
    );
  }