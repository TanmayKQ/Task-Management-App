"use client";

import { useState } from "react";
import { updateTask, deleteTask } from "@/app/dashboard/actions";
import type { Task, TaskStatus } from "@/types/task";
import { motion } from "framer-motion";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Modal from "./ui/Modal";

interface TaskCardProps {
    task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || "");
    const [dueDate, setDueDate] = useState(task.due_date);
    const [status, setStatus] = useState<TaskStatus>(task.status);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await updateTask(task.id, {
                title,
                description,
                due_date: dueDate,
                status,
            });

            if (result.error) {
                setError(result.error);
            } else {
                setIsEditing(false);
            }
        } catch (err) {
            setError("Failed to update task");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const result = await deleteTask(task.id);
            if (result.error) {
                setError(result.error);
                setLoading(false);
                setShowDeleteModal(false);
            }
        } catch (err) {
            setError("Failed to delete task");
            setLoading(false);
            setShowDeleteModal(false);
        }
    };

    const getDaysUntilDue = () => {
        const due = new Date(task.due_date);
        const today = new Date();
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
        if (diffDays === 0) return "Due today";
        if (diffDays === 1) return "Due tomorrow";
        return `${diffDays} days left`;
    };

    if (isEditing) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
            >
                <form onSubmit={handleUpdate} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <Input
                        label="Title"
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        />
                    </div>

                    <Input
                        label="Due Date"
                        type="date"
                        required
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as TaskStatus)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button type="submit" isLoading={loading} className="flex-1">
                            Save
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsEditing(false)}
                            disabled={loading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </motion.div>
        );
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                transition={{ duration: 0.2 }}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-blue-200 transition-all duration-200 group"
            >
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                        {error}
                    </div>
                )}

                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {task.title}
                    </h3>
                    <Badge status={task.status} />
                </div>

                {task.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>{new Date(task.due_date).toLocaleDateString()}</span>
                    <span className="text-gray-400">•</span>
                    <span className={`font-medium ${getDaysUntilDue().includes("overdue")
                            ? "text-red-600"
                            : getDaysUntilDue().includes("today")
                                ? "text-amber-600"
                                : "text-gray-600"
                        }`}>
                        {getDaysUntilDue()}
                    </span>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={() => setIsEditing(true)}
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        leftIcon={
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        }
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => setShowDeleteModal(true)}
                        variant="danger"
                        size="sm"
                        className="flex-1"
                        leftIcon={
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        }
                    >
                        Delete
                    </Button>
                </div>
            </motion.div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Task"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Are you sure you want to delete &quot;{task.title}&quot;? This action cannot be
                        undone.
                    </p>
                    <div className="flex gap-3">
                        <Button
                            onClick={handleDelete}
                            variant="danger"
                            isLoading={loading}
                            className="flex-1"
                        >
                            Delete
                        </Button>
                        <Button
                            onClick={() => setShowDeleteModal(false)}
                            variant="secondary"
                            disabled={loading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
