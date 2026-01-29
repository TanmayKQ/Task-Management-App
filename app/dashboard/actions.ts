"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from "@/types/task";

export async function getTasks(
    filterStatus?: TaskStatus | "all",
    sortOrder?: "asc" | "desc"
): Promise<{ tasks: Task[] | null; error: string | null }> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { tasks: null, error: "Not authenticated" };
        }

        let query = supabase
            .from("tasks")
            .select("*")
            .eq("user_id", user.id);

        if (filterStatus && filterStatus !== "all") {
            query = query.eq("status", filterStatus);
        }

        if (sortOrder) {
            query = query.order("due_date", { ascending: sortOrder === "asc" });
        } else {
            query = query.order("created_at", { ascending: false });
        }

        const { data, error } = await query;

        if (error) {
            return { tasks: null, error: error.message };
        }

        return { tasks: data, error: null };
    } catch (err) {
        return { tasks: null, error: "Failed to fetch tasks" };
    }
}

export async function createTask(
    input: CreateTaskInput
): Promise<{ task: Task | null; error: string | null }> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { task: null, error: "Not authenticated" };
        }

        const { data, error } = await supabase
            .from("tasks")
            .insert({
                user_id: user.id,
                title: input.title,
                description: input.description || null,
                due_date: input.due_date,
                status: input.status,
            })
            .select()
            .single();

        if (error) {
            return { task: null, error: error.message };
        }

        revalidatePath("/dashboard");
        return { task: data, error: null };
    } catch (err) {
        return { task: null, error: "Failed to create task" };
    }
}

export async function updateTask(
    id: string,
    input: UpdateTaskInput
): Promise<{ task: Task | null; error: string | null }> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { task: null, error: "Not authenticated" };
        }

        const { data, error } = await supabase
            .from("tasks")
            .update(input)
            .eq("id", id)
            .eq("user_id", user.id)
            .select()
            .single();

        if (error) {
            return { task: null, error: error.message };
        }

        revalidatePath("/dashboard");
        return { task: data, error: null };
    } catch (err) {
        return { task: null, error: "Failed to update task" };
    }
}

export async function deleteTask(
    id: string
): Promise<{ success: boolean; error: string | null }> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Not authenticated" };
        }

        const { error } = await supabase
            .from("tasks")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath("/dashboard");
        return { success: true, error: null };
    } catch (err) {
        return { success: false, error: "Failed to delete task" };
    }
}

export async function logout(): Promise<{ error: string | null }> {
    try {
        const supabase = await createClient();
        const { error } = await supabase.auth.signOut();

        if (error) {
            return { error: error.message };
        }

        return { error: null };
    } catch (err) {
        return { error: "Failed to logout" };
    }
}
