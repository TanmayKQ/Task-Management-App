"use client";

import { motion } from "framer-motion";
import TaskCard from "./TaskCard";
import EmptyState from "./EmptyState";
import type { Task } from "@/types/task";

interface TaskListProps {
    tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
    if (tasks.length === 0) {
        return (
            <EmptyState
                title="No tasks found"
                description="Get started by creating your first task. Stay organized and boost your productivity!"
            />
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    transition: {
                        staggerChildren: 0.05,
                    },
                },
            }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
            {tasks.map((task, index) => (
                <motion.div
                    key={task.id}
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <TaskCard task={task} />
                </motion.div>
            ))}
        </motion.div>
    );
}
