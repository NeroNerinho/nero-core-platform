export type ActionState<T> =
    | { success: true; data: T }
    | { success: false; error: string }

export async function createSafeAction<Input, Output>(
    schema: any, // Zod schema
    action: (data: Input) => Promise<Output>,
    input: Input
): Promise<ActionState<Output>> {
    const result = schema.safeParse(input)

    if (!result.success) {
        return {
            success: false,
            error: result.error.errors[0].message,
        }
    }

    try {
        const data = await action(result.data)
        return { success: true, data }
    } catch (error) {
        console.error("Action Error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Erro desconhecido no servidor",
        }
    }
}
