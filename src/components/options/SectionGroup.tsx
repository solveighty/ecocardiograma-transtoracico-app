import React from "react";

interface SectionGroupProps {
  title: string;
  children: React.ReactNode;
}

const SectionGroup: React.FC<SectionGroupProps> = ({ title, children }) => (
  <div className="mb-4">
    <h3 className="font-semibold mb-2">{title}</h3>
    {children}
  </div>
);

export default SectionGroup;
