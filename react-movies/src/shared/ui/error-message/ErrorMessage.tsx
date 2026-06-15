interface ErrorMessageProps {
    message?: string;
}
  
export function ErrorMessage({message = "Something went wrong" }: ErrorMessageProps) {
    return (
        <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">
            {message}
        </div>
    );
}