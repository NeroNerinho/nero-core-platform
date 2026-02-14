export const API_URL = 'https://Core API.nero27.com.br/webhook/CheckingCentral'

export async function apiRequest(action: string, payload: any = {}) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action,
            ...payload
        })
    })

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
}
