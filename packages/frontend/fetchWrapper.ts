const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001'
interface Options extends Omit<RequestInit, 'body'> {
    body?:any
}
export async function fetchApi<T>(path: string, { method = 'GET', body, headers = {} }: Options = {}): Promise<T> {
    const URL = `${BASE_URL}/users${path}`
    const hasBody = body !== null && body !== undefined
    const token = localStorage.getItem('token')
    const res = await fetch(URL, {
        method,
        headers: { ...(hasBody && { 'Content-Type': 'application/json' }), ...(token && {'Authorization': `Bearer ${token}`}),...headers },
        ...(hasBody && { body: JSON.stringify(body) })
    })
    const json = await res.json()

    if (!res.ok) {
        const message = json?.message || 'Request failed.'
        const error = new Error(message) as any
        error.statusCode = res.status
        throw error
    }
    return json as T
}