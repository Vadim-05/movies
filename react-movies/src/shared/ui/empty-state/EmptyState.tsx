interface EmptyStateProps {
    message: string;
}
  
export function EmptyState({ message}: EmptyStateProps) {
    return (
        <div className="py-8 text-center text-neutral-400">
            {message}
        </div>
    );
}