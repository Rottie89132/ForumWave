<template>
	<div>
		<div class="sm:px-28 md:px-30 lg:px-52 xl:px-80 px-5 py-3 fixed w-full h-full overflow-scroll">
			<div class="bg-white sticky z-50 -top-4 py-3">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-4 pr-5">
						<NuxtLink to="/" class="text-lg font-bold">Home</NuxtLink>
					</div>
					<div class="flex items-center gap-2">
						<button @click="refresh" class="border-[#376A7A] border text-[#376A7A] p-2 w-fit rounded-xl flex items-center justify-center">
							<icon name="solar:refresh-broken" size="1.4em" :class="loading ? ' animate-spin' : ''"></icon>
						</button>
						<button class="border-[#376A7A] text-sm w-16 border text-[#376A7A] p-[0.59rem] rounded-xl flex items-center justify-center">
							{{ Pages }}
						</button>
						<button @click="$router.back()" class="bg-[#376A7A] border-[#376A7A] border text-[#ffffff] p-2 w-fit rounded-xl flex items-center justify-center">
							<icon name="solar:forward-line-duotone" size="1.4em" class="rotate-180"></icon>
						</button>
					</div>
				</div>
				<hr class="w-full mt-2 -mb-1" />
			</div>

			<div class="mt-2 z-20">
				<div class="mb-16">
					<div v-bind="containerProps" class="h-[71.6vh] md:h-[75.5vh] overflow-scroll w-full">
						<div v-bind="wrapperProps" class="flex flex-col gap-3 snap-y snap-proximity scroll-smooth">
							<div class="bg-gray-50 h-[142px] p-3 overflow-hidden rounded-md border" v-for="posts in list" :key="posts.index">
								<div>
									<div class="flex items-center gap-1">
										<h1 class="text-[0.9rem] text-[#376A7A] font-semibold opacity-60">
											{{ user.user.Username || "Onbekent" }}
										</h1>
										<span class="opacity-60"> | </span>
										<h1 class="text-[0.9rem] opacity-60">{{ useTimeAgo(posts?.data?.CreatedAt).value }}</h1>
									</div>
								</div>

								<h1 class="text-lg font-bold truncate">{{ posts?.data.title }}</h1>
								<p class="text-sm line-clamp-1 text-balance">{{ posts?.data.content || `We wouden de inhoud laten zien, maar deze was er helaas niet!` }}</p>
								<hr class="-mb-1 mt-2" />
								<div class="mt-3 text-[0.95rem] items-center flex gap-1 justify-between">
									<button @click="navigateTo(`/posts/${posts?.data.id}`)" class="bg-[#376A7A] text-[#ffffff] p-1 px-4 w-fit rounded-md flex items-center justify-center">
										<span class="mr-1">Lees meer</span>
									</button>
									<div class="cursor-default items-center flex gap-1">
										<div class="flex gap-1 items-center group opacity-60 hover:opacity-100 transition-all duration-150">
											<Icon v-if="posts?.data?.liked" name="solar:heart-bold" size="1em" class="text-cyan-500 scale-150 transition-all duration-150"> </Icon>
											<Icon v-else name="solar:heart-bold" size="1em" class="group-hover:text-cyan-500 group-hover:scale-150 group-hover:mr-[0.25rem] transition-all duration-150"> </Icon>
											<span class="group-hover:font-medium"> {{ posts?.data?.meta?.Likes || 0 }}</span>
										</div>
										<span class="opacity-60"> | </span>
										<div class="flex gap-1 items-center group opacity-60 hover:opacity-100 transition-all duration-150">
											<Icon name="solar:eye-bold" size="1em" class="group-hover:scale-150 group-hover:mr-[0.25rem] transition-all duration-150"> </Icon>
											<span class="group-hover:font-medium">{{ posts?.data?.meta?.views || 0 }}</span>
										</div>
										<span class="opacity-60"> | </span>
										<div class="flex gap-1 items-center group opacity-60 hover:opacity-100 transition-all duration-150">
											<Icon name="solar:chat-round-dots-bold" size="1em" class="group-hover:scale-150 group-hover:mr-[0.25rem] transition-all duration-150"> </Icon>
											<span class="group-hover:font-medium">{{ posts?.data?.meta?.comments || 0 }}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	definePageMeta({
		middleware: "auth",
	});

	const userId = useRoute().params.id;
	const items = ref([]);
	const Pages = ref(1);
	const TotalPages = ref(0);
	const loading = ref(false);

	const { data: user, error: userError } = await useFetch(`/api/users/${userId}`);
	const { data, error } = await useFetch(`/api/posts?SearchId=${userId}`);
	items.value = data.value?.posts;
	TotalPages.value = data.value?.totalPages;

	const refresh = async () => {
		loading.value = true;
		const { data, error, status } = await useFetch(`/api/posts?SearchId=${userId}&reload=true`);

		loading.value = status.value != "success";

		items.value = data.value?.posts;
		TotalPages.value = data.value?.totalPages;
		Pages.value = 1;
	};

	const { list, containerProps, wrapperProps } = useVirtualList(items, {
		itemHeight: 152,
	});

	useInfiniteScroll(
		containerProps.ref,
		async () => {
			if (Pages.value >= TotalPages.value) return;
			loading.value = true;

			Pages.value += 1;
			const Post = await $fetch(`/api/posts?page=${Pages.value}&SearchId=${userId}`);

			setTimeout(() => {
				loading.value = false;
			}, 500);

			items.value.push(...Post.posts);
			TotalPages.value = Post.totalPages;
		},
		{
			distance: 12,
		}
	);
</script>
