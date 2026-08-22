import { ApiResponse } from "@/types/api-response.types";
import { AppError } from "../errors/AppError";

export async function handleApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let result: ApiResponse<T>;
    
    try {
        result = await response.json();
    } catch (error) {
        throw AppError.InternalError("Failed to parse server response.");
    }

    if (!response.ok || !result.success) {
        // Utilizar mensagem da API caso exista
        const errorMessage = result.error?.message || "An unexpected error occurred.";

        // Formatar e detalhar erros Zod caso existam
        const errorDetails = result.error?.details ? `\nDetails: ${result.error.details.join(", ")}` : "";

        throw new AppError(`${errorMessage}${errorDetails}`);
    }

    return result;
}