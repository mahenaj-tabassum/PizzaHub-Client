import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface DescriptionRendererProps {
  description: string;
}

export default function DescriptionRenderer({
  description,
}: DescriptionRendererProps) {
  return (
    <div
      className="prose prose-neutral max-w-none
        prose-p:my-4
        prose-p:leading-7
        prose-strong:font-bold
        prose-strong:text-gray-900
        prose-p:text-gray-600
        prose-first:mt-0
        prose-last:mb-0"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {description || ""}
      </ReactMarkdown>
    </div>
  );
}
