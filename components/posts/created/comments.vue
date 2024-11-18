<template>
	<div>
		<div class="flex items-center justify-between gap-1">
			<h1 class="text-[0.9rem] opacity-60">{{ useTimeAgo(posts?.data?.CreatedAt).value }}</h1>
			<div class="flex text-[#376A7A] rounded-lg text-[0.90rem] gap-1 items-center transition-all duration-150">
				<Icon name="bx:bxs-upvote" size="1em" :class="posts?.data?.liked ? 'text-green-500 scale-125' : ''" class="transition-all duration-150"></Icon>
				<span class=""> {{ useCompact(posts?.data?.meta?.Likes || 0) }}</span>
				<Icon name="bx:bxs-downvote" size="1em" :class="posts?.data?.disliked ? 'text-red-500 scale-125' : ''" class="transition-all duration-150"></Icon>
			</div>
		</div>
	</div>
	<NuxtLink :to="`/posts/${posts?.data.ParentId}?comment=${posts?.data.id}`">
		<h1 class="text-lg font-bold truncate underline text-[#376A7A]">{{ posts?.data.title }}</h1>
	</NuxtLink>
	<p class="text-sm line-clamp-1 text-balance">
		{{
			posts?.data.content ||
			`We wouden de inhoud laten zien, maar dezewas
        er helaas niet!`
		}}
	</p>
</template>

<script setup lang="ts">
	import { useTimeAgo } from '@vueuse/core';
    import useCompact from '@/composables/useCompact';
    

	defineProps<{ posts: any }>();
</script>
