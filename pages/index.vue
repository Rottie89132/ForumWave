<template>
	<div>
		<div class="sm:px-28 md:px-30 lg:px-52 xl:px-80 pl-5 py-3 fixed w-full h-full">
			<div class="flex items-center gap-4 pr-5">
				<NuxtImg src="/Avatar.png" alt="logo" class="h-11 w-11 object-cover rounded-md border border-black" />
				<h1 class="text-lg font-bold">Hallo Bart</h1>
			</div>

			<div class="mt-4 pr-5">
				<Form @submit="handleSearch" class="flex items-center gap-2">
					<input v-model="searchParams" placeholder="Zoeken" class="btn-Input" ref="zoeken" type="text" aria-label="zoeken" autocomplete="current-zoeken" />

					<button class="bg-[#376A7A] text-[#ffffff] p-2 w-fit rounded-xl flex items-center justify-center">
						<icon name="solar:forward-line-duotone" size="1.6em" class="text-white"></icon>
					</button>
				</Form>
			</div>
			<div class="mt-6">
				<div class="flex gap-2 items-center pr-5">
					<h1 class="font-bold text-lg">Populaire Posts</h1>
					<button @click="openCreatePostModal" class="text-[#376A7A]">
						<icon name="solar:add-square-linear" size="1.6em" class=""></icon>
					</button>
				</div>

				<div v-if="popularItems.length > 0" class="mt-3">
					<div v-bind="popularContainerProps" class="h-[28vh] w-full">
						<div v-bind="popularWrapperProps" class="flex gap-2 snap-y snap-proximity scroll-smooth">
							<div class="last:pr-5 snap-center" v-for="item in popularList" :key="item.index">
								<Posts :item />
							</div>
						</div>
					</div>
				</div>
				<div v-else class="-mt-1">
					<p class="text-gray -400">Er zijn nog geen populaire posts beschikbaar</p>
				</div>
			</div>
			<div class="mt-6">
				<div class="flex gap-2 items-center pr-5">
					<h1 class="font-bold text-lg">Nieuwste Posts</h1>
				</div>
				<div v-if="items.length > 0" class="mt-3">
					<div v-bind="containerProps" class="h-[28vh] w-full">
						<div v-bind="wrapperProps" class="flex gap-2 snap-y snap-proximity scroll-smooth">
							<div class="last:pr-5 snap-center" v-for="item in list" :key="item.index">
								<Posts :item />
							</div>
						</div>
					</div>
				</div>
				<div v-else class="-mt-1">
					<p class="text-gray-400">Er zijn nog geen nieuwe posts beschikbaar</p>
				</div>
			</div>
		</div>

		<TipTapModal v-model="status">
			<p class="mb-3">Hier kan je een nieuwe post aanmaken</p>
			<hr class="my-2" />
			<TipTapEditor v-model="status" :loading :content :submit />
		</TipTapModal>
	</div>
</template>

<script setup>
	definePageMeta({
		middleware: "auth",
	});
	
	useSeoMeta({
		title: "ForumWave - Home",
		description: "Bekijk de nieuwste en populairste posts op ForumWave!",
		ogTitle: "ForumWave",
		ogDescription: "Bekijk de nieuwste en populairste posts op ForumWave!",
		ogImage: "/apple-touch-icon.png",
		ogUrl: "/",
		twitterTitle: "ForumWave",
		twitterDescription: "Bekijk de nieuwste en populairste posts op ForumWave!",
		twitterImage: "/apple-touch-icon.png",
		twitterCard: "summary",
	});

	const searchParams = ref("");
	const popularItems = ref([]);
	const popularTotalPages = ref(0);
	const popularPages = ref(1);

	const items = ref([]);
	const itemsTotalPages = ref(0);
	const itemsPages = ref(1);

	const status = ref({});
	const loading = ref(false);
	const content = ref("");

	const { data: popularPosts } = await useFetch("/api/posts?popular=true");
	const { data: Post } = await useFetch("/api/posts");

	items.value = Post.value?.posts;
	itemsTotalPages.value = Post.value?.totalPages;

	popularItems.value = popularPosts.value?.posts;
	popularTotalPages.value = popularPosts.value?.totalPages;

	const openCreatePostModal = () => {
		status.value = {
			status: true,
			type: "Post",
		};
	};

	const handleSearch = async () => {
		console.log("searching");
		console.log(searchParams.value);
	};

	const submit = async (callback) => {
		loading.value = true;
		const result = callback();

		const { data, error } = await useFetch("/api/posts", {
			method: "POST",
			body: result,
		});

		loading.value = false;
		if (!error.value) {
			const { data: popularPosts } = await useFetch("/api/posts?popular=true");
			const { data: Post } = await useFetch("/api/posts");

			items.value = Post.value?.posts;
			itemsTotalPages.value = Post.value?.totalPages;

			popularItems.value = popularPosts.value?.posts;
			popularTotalPages.value = popularPosts.value?.totalPages;

			setTimeout(() => {
				status.value = false;
			}, 1000);
		}
	};

	const { list, containerProps, wrapperProps } = useVirtualList(items, {
		itemWidth: 160,
	});

	const {
		list: popularList,
		containerProps: popularContainerProps,
		wrapperProps: popularWrapperProps,
	} = useVirtualList(popularItems, {
		itemWidth: 160,
	});

	useInfiniteScroll(
		containerProps.ref,
		async () => {
			if (itemsPages.value >= itemsTotalPages.value) return;

			itemsPages.value += 1;
			const Post = await $fetch(`/api/posts?page=${itemsPages.value}`);
			items.value.push(...Post.posts);
			itemsTotalPages.value = Post.totalPages;
		},
		{
			direction: "right",
			distance: 8,
		}
	);

	useInfiniteScroll(
		popularContainerProps.ref,
		async () => {
			if (popularPages.value >= popularTotalPages.value) return;

			popularPages.value += 1;
			const Post = await $fetch(`/api/posts?page=${popularPages.value}&popular=true`);
			popularItems.value.push(...Post.posts);
			popularTotalPages.value = Post.totalPages;
		},
		{
			direction: "right",
			distance: 8,
		}
	);
</script>
