export class Api {
    static baseUrl = `${import.meta.env.VITE_API_BASE_URL}/api`;

    static async get<T>(url: string, options: RequestInit = {}): Promise<any> {
        const response = await fetch(`${Api.baseUrl}${url}`, {
            method: "GET",
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
        });
        const dataResponse = await response.json();
        return {
            statusCode: response.status,
            data: dataResponse,
        };
    }

    static async post<T>(url: string, data: any, options: RequestInit = {}): Promise<any> {
        const response = await fetch(`${Api.baseUrl}${url}`, {
            method: "POST",
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
            body: JSON.stringify(data),
        });
        const dataResponse = await response.json();
        return {
            statusCode: response.status,
            data: dataResponse,
        };
    }

    static async put<T>(url: string, data: any, options: RequestInit = {}): Promise<any> {
        const response = await fetch(`${Api.baseUrl}${url}`, {
            method: "PUT",
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
            body: JSON.stringify(data),
        });
        const dataResponse = await response.json();
        return {
            statusCode: response.status,
            data: dataResponse,
        };
    }

    static async patch<T>(url: string, data: any, options: RequestInit = {}): Promise<any> {
        const response = await fetch(`${Api.baseUrl}${url}`, {
            method: "PATCH",
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
            body: JSON.stringify(data),
        });
        const dataResponse = await response.json();
        return {
            statusCode: response.status,
            data: dataResponse,
        };
    }

    static async delete<T>(url: string, options: RequestInit = {}): Promise<any> {
        const response = await fetch(`${Api.baseUrl}${url}`, {
            method: "DELETE",
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
        });
        const dataResponse = await response.json();
        return {
            statusCode: response.status,
            data: dataResponse,
        };
    }
}