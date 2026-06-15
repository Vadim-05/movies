interface NotFoundProps {
    title?: string;
    description?: string;
}
  
export function NotFound({
    title = "Not found",
    description = "The requested resource does not exist.",
}: NotFoundProps) {
    return (
      <div className="grid min-h-[300px] place-items-center text-center">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            {title}
          </h2>
  
          <p className="mt-2 text-sm text-neutral-400">
            {description}
          </p>
        </div>
      </div>
    );
  }