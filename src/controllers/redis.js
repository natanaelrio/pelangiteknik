'use server'
import redis from '@/lib/redis';
import { revalidatePath } from 'next/cache';

export const GetSearchRedis = async (id) => {
    try {
        const ListSearchtry = await redis.zrevrange("search:index", 0, 6);
        return ListSearchtry
    }
    catch (err) {
        console.log(err);
    }
    revalidatePath('/')
}