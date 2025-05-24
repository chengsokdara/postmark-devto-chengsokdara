import type { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div id="wrapper" className="flex flex-col h-full xl:max-w-7xl xl:mx-auto">
      {children}
    </div>
  );
}
