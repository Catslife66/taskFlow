import z from "zod";

export const registerSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[A-Z]/, "Password must contain at least one uppderrcase letter.")
    .regex(/\d/, "Password must contain at least one number.")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character.",
    ),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password cannot be empty.")
    .max(100, "Max length is 100 characters."),
});

export const taskCreateSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty.")
    .max(100, "Max length is 100 characters."),
  status: z.enum(["TODO", "DONE"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  due_datetime: z.string().nullable(),
});

export const taskUpdateSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty.")
    .max(100, "Max length is 100 characters.")
    .optional(),
  status: z.enum(["TODO", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  due_datetime: z.string().nullable(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type TaskCreateFormInput = z.input<typeof taskCreateSchema>;
export type TaskCreateInput = z.output<typeof taskCreateSchema>;
export type TaskUpdateFormInput = z.input<typeof taskUpdateSchema>;
export type TaskUpdateInput = z.output<typeof taskUpdateSchema>;
