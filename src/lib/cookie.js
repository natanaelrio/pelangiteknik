'use server'

import { cookies } from 'next/headers'

export async function setCookie(data) {
    cookies().set('url', data)
}
export async function GetCookie() {
    const cookieStore = cookies()
    const theme = cookieStore.get('url')
    return theme
}

