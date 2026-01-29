interface SkeletonProps {
    className?: string;
    variant?: "text" | "circular" | "rectangular";
}

export default function Skeleton({
    className = "",
    variant = "rectangular",
}: SkeletonProps) {
    const variants = {
        text: "h-4 w-full",
        circular: "rounded-full",
        rectangular: "rounded-lg",
    };

    return (
        <div
            className={`animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] ${variants[variant]} ${className}`}
        />
    );
}

export function TaskCardSkeleton() {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
            <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton variant="circular" className="h-6 w-20" />
            </div>
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-2/3" />
            <div className="flex gap-2 pt-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
            </div>
        </div>
    );
}

export function TaskListSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <TaskCardSkeleton key={i} />
            ))}
        </div>
    );
}
