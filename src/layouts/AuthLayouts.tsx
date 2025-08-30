import React from "react";
import authBg from "../assets/authBg.jpg";
export default function AuthLayouts({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout">
      <div className="children-Layout">{children}</div>
      <div className="auth-bg-layout">
        <img src={authBg} alt="authBg" />
      </div>
    </div>
  );
}
