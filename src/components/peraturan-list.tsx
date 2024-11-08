import React from "react";
import peraturan from "~/data/peraturan.json";
import Collapsible from "./collapsible";

export default function PeraturanList() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {peraturan.map((item, index) => (
        <Collapsible key={index} title={item.title} logotype={item.logoType}>
          {item.textContent}
        </Collapsible>
      ))}
    </div>
  );
}
