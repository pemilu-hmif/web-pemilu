import { MDXProvider } from "@mdx-js/react";

export default function MdxWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        prose prose-neutral dark:prose-invert
        prose-h1:text-2xl prose-h1:font-bold
        prose-h2:text-xl prose-h2:font-semibold
        prose-h3:text-lg prose-h3:font-semibold
        prose-li:marker:text-green-600 dark:prose-li:marker:text-green-400
        prose-a:text-green-600 dark:prose-a:text-green-400
        prose-strong:text-gray-900 dark:prose-strong:text-gray-200
        max-w-none
      "
    >
      {children}
    </div>
  );
}
