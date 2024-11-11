import React from "react";
import tatacara from "~/data/tata-cara.json";
import Collapsible from "./collapsible";

export default function TataCaraList() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {tatacara.map((item, index) => (
        <Collapsible key={index} title={item.title} logotype={item.logoType}>
          {item.textContent}
        </Collapsible>
      ))}
    </div>
  );
}
