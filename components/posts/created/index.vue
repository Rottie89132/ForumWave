<template>
    <div>
        <div class="flex items-center justify-between gap-1">
            <h1 class="text-[0.9rem] opacity-60">{{ useTimeAgo(posts?.data?.CreatedAt).value }}</h1>
            <div class="cursor-default text-[#376A7A] text-[0.90rem] items-center flex gap-1">
                <div class="flex rounded-lg gap-1 items-center">
                    <Icon v-if="posts?.data?.liked" name="solar:heart-bold" size="1em"
                        class="text-green-500 scale-125 transition-all duration-150"> </Icon>
                    <Icon v-else name="solar:heart-bold" size="1em" class=""> </Icon>
                    <span class=""> {{ useCompact(posts?.data?.meta?.Likes || 0) }}</span>
                </div>
                <span class=""> | </span>
                <div class="flex rounded-lg gap-1 items-center">
                    <Icon name="solar:eye-bold" size="1em" class=""> </Icon>
                    <span class="">{{ useCompact(posts?.data?.meta?.views || 0) }}</span>
                </div>
                <span class=""> | </span>
                <div class="flex rounded-lg gap-1 items-center">
                    <Icon name="solar:chat-round-dots-bold" size="1em" class=""> </Icon>
                    <span class="">{{ useCompact(posts?.data?.meta?.Comments || 0) }}</span>
                </div>
            </div>
        </div>
    </div>
    <NuxtLink :to="`/posts/${posts?.data.id}`">
        <h1 class="text-lg font-bold truncate underline text-[#376A7A]">{{ posts?.data.title }}</h1>
    </NuxtLink>
    <p class="text-sm line-clamp-1 text-balance">
        {{
        posts?.data.content ||
        `We wouden de inhoud laten zien, maar deze
        was er helaas niet!`
        }}
    </p>
</template>

<script setup lang="ts">
    import { useTimeAgo } from '@vueuse/core';
    import useCompact from '@/composables/useCompact';
    
	defineProps<{ posts: any }>();
</script>
