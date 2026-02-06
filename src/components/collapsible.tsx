import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import CollapsibleIcon from "./collapsible-icon";

interface CollapsibleProps {
  title: string;
  logotype?: string;
  children: React.ReactNode;
}

export default function Collapsible({
  title,
  logotype,
  children,
}: CollapsibleProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full max-w-7xl rounded-3xl bg-white px-8 py-2 font-satoshi text-[#3F3F3F]"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="flex items-center justify-between">
          <div className="relative flex items-center gap-4">
            <CollapsibleIcon
              logotype={logotype}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#156E3C] p-2"
            />
            <span className="text-left text-xl font-bold">{title}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="prose whitespace-pre-wrap text-sm md:text-lg">
            {children}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
