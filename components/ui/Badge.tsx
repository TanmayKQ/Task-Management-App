import type { TaskStatus } from "@/types/task";

interface BadgeProps {
    status: TaskStatus;
    withIcon?: boolean;
}

export default function Badge({ status, withIcon = true }: BadgeProps) {
    const config = {
        todo: {
            label: "To Do",
            className: "bg-gray-100 text-gray-800",
            icon: (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
        },
        in_progress: {
            label: "In Progress",
            className: "bg-blue-100 text-blue-800",
            icon: (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
        },
        done: {
            label: "Done",
            className: "bg-green-100 text-green-800",
            icon: (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
        },
    };

    const { label, className, icon } = config[status];

    return (
        <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${className}`}
        >
            {withIcon && icon}
            {label}
        </span>
    );
}
