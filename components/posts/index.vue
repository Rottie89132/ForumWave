<template>
	<div @click="navigateTo(`/posts/${item.data.id}`)"
		class="p-1 rounded-md border select-none border-gray-400 h-[28vh] w-[10em]">
		<template v-if="isVideo(media)">
			<div class="p-2 z-20 relative bg-black bg-opacity-50 text-white flex items-end rounded-md w-full h-full">
				<div class="flex gap-4 flex-col justify-end pb-2">
					<div class="">
						<p class="opacity-80 text-sm">{{ item.data?.author }}</p>
						<p class="opacity-60 text-xs truncate">{{ useTimeAgo(item?.data.CreatedAt).value }}</p>
						<h1 class="font-black text-lg line-clamp-2 leading-5 my-1">{{ item.data?.title }}</h1>
						<p class="opacity-85 text-xs line-clamp-2">
							{{ item.data?.content }}
						</p>
					</div>
					<div class="cursor-default text-[0.8rem] flex gap-1 justify-end">
						<div
							class="flex gap-1 items-center group opacity-60 hover:opacity-100 transition-all duration-150">
							<Icon v-if="item.data?.liked" name="solar:heart-bold" size="1em"
								class="text-cyan-500 scale-150 transition-all duration-150">
							</Icon>
							<Icon v-else name="solar:heart-bold" size="1em"
								class="group-hover:text-cyan-500 group-hover:scale-150 group-hover:mr-[0.25rem] transition-all duration-150">
							</Icon>
							<span class="group-hover:font-medium"> {{ useCompact(item.data?.meta?.Likes || 0)
								}}</span>
						</div>
						<span class="opacity-60"> | </span>
						<div
							class="flex gap-1 items-center group opacity-60 hover:opacity-100 transition-all duration-150">
							<Icon name="solar:eye-bold" size="1em"
								class="group-hover:scale-150 group-hover:mr-[0.25rem] transition-all duration-150 ">
							</Icon>
							<span class="group-hover:font-medium">{{ useCompact(item.data?.meta?.views || 0)
								}}</span>
						</div>
						<span class="opacity-60"> | </span>
						<div
							class="flex gap-1 items-center group opacity-60 hover:opacity-100 transition-all duration-150">
							<Icon name="solar:chat-round-dots-bold" size="1em"
								class="group-hover:scale-150 group-hover:mr-[0.25rem] transition-all duration-150 ">
							</Icon>
							<span class="group-hover:font-medium">{{ useCompact(item.data?.meta?.Comments || 0)
								}}</span>
						</div>
					</div>
				</div>
			</div>
			<video @error="handleError" :src="media" muted type="video/mp4" playsinline autoplay loop preload="metadata"
				class="rounded-md h-full -mt-[26.9vh] z-10 w-full re object-cover">
			</video>
		</template>
		<template v-else>
			<div class="rounded-md h-full w-full background_image bg-slate-50"
				:style="media ? `background-image: url('${media}');` : `background-image: url('/placeholderl.jpg')`">
				<div class="p-2 bg-black bg-opacity-50 text-white flex items-end rounded-md w-full h-full">
					<div class="flex w-full gap-4 flex-col justify-end pb-2">
						<div class="">
							<p class="opacity-80 text-sm">{{ item.data?.author }}</p>
							<p class="opacity-60 text-xs truncate">{{ useTimeAgo(item?.data.CreatedAt).value }}</p>
							<h1 class="font-black text-lg line-clamp-2 leading-5 my-1">{{ item.data?.title }}</h1>
							<p class="opacity-85 text-xs line-clamp-2">{{ item.data?.content }}</p>
						</div>
						<div class="cursor-default text-[0.8rem] flex gap-1 justify-end">
							<div
								class="flex gap-1 items-center group opacity-60 hover:opacity-100 transition-all duration-150">
								<Icon v-if="item.data?.liked" name="solar:heart-bold" size="1em"
									class="text-cyan-500 scale-150 transition-all duration-150">
								</Icon>
								<Icon v-else name="solar:heart-bold" size="1em"
									class="group-hover:text-cyan-500 group-hover:scale-150 group-hover:mr-[0.25rem] transition-all duration-150">
								</Icon>
								<span class="group-hover:font-medium"> {{ useCompact(item.data?.meta?.Likes || 0)
									}}</span>
							</div>
							<span class="opacity-60"> | </span>
							<div
								class="flex gap-1 items-center group opacity-60 hover:opacity-100 transition-all duration-150">
								<Icon name="solar:eye-bold" size="1em"
									class="group-hover:scale-150 group-hover:mr-[0.25rem] transition-all duration-150 ">
								</Icon>
								<span class="group-hover:font-medium">{{ useCompact(item.data?.meta?.views || 0)
									}}</span>
							</div>
							<span class="opacity-60"> | </span>
							<div
								class="flex gap-1 items-center group opacity-60 hover:opacity-100 transition-all duration-150">
								<Icon name="solar:chat-round-dots-bold" size="1em"
									class="group-hover:scale-150 group-hover:mr-[0.25rem] transition-all duration-150 ">
								</Icon>
								<span class="group-hover:font-medium">{{ useCompact(item.data?.meta?.Comments || 0)
									}}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup>
	const media = ref(null);

	const { item } = defineProps({
		item: Object,
	});

	media.value = item.data.media;
	const image = new Image();

	const isVideo = (mediaUrl) => {
		return mediaUrl && (mediaUrl.includes('.mp4') || mediaUrl.includes('.mov'));
	};

	const handleError = () => {
		media.value = '/placeholderl.jpg';
	};

	if (media.value) {
		if (!isVideo(media.value)) {
			image.src = media.value;
			image.onerror = () => handleError()
		}
	} else handleError()

	






</script>

<style scoped>
	.background_image {
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		border-radius: 0.375rem;
		z-index: 10;
	}
</style>