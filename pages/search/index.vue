<template>
	<div>
		<div class="sm:px-28 md:px-30 lg:px-52 xl:px-80 pl-5 py-3 fixed w-full h-full">
			<div class="bg-white sticky z-50 -top-4 py-3 pr-5">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-4 pr-5">
						<NuxtLink to="/" class="text-lg font-bold">Home</NuxtLink>
					</div>
					<div class="flex items-center gap-2">
						<button @click="refresh" class="border-[#376A7A] border text-[#376A7A] p-2 w-fit rounded-xl flex items-center justify-center">
							<icon name="bx:loader-circle" size="1.4em" :class="loading ? ' animate-spin' : ''"> </icon>
						</button>
						<PostsCreateButton />
						<NuxtLink to="/" class="bg-[#376A7A] border-[#376A7A] border text-[#ffffff] p-2 w-fit rounded-xl flex items-center justify-center">
							<icon name="bx:arrow-back" size="1.4em" class="text-white"></icon>
						</NuxtLink>
					</div>
				</div>
				<hr class="w-full mt-2 -mb-1" />
			</div>

			<div class="mt-1">
				<h1 class="text-4xl font-bold">ForumWave</h1>
			</div>

			<div class="mt-4 pr-5">
				<Form @submit="handleSearch" class="flex items-center gap-2">
					<input v-model="searchParams" placeholder="Zoeken naar posts" class="btn-Input" ref="zoeken" type="text" aria-label="zoeken" autocomplete="current-zoeken" />

					<button class="bg-[#376A7A] text-[#ffffff] p-2 w-fit rounded-xl flex items-center justify-center">
						<icon name="bx:arrow-back" size="1.6em" class="text-white rotate-180"></icon>
					</button>
				</Form>
			</div>

			<div class="mt-4">
				<div class="flex gap-2 items-center pr-5">
					<h1 class="font-bold text-lg">Resultaten</h1>
				</div>
				<div v-if="items.length > 0" class="mt-2">
					<div v-bind="containerProps" class="h-[28vh] w-full">
						<div v-bind="wrapperProps" class="flex gap-2 snap-y snap-proximity scroll-smooth">
							<div class="last:pr-5 snap-center" v-for="item in list" :key="item.index">
								<Posts :item />
							</div>
						</div>
					</div>
				</div>
				<div v-else class="-mt-1">
					<p class="text-gray-400">Er zijn geen posts gevonden die voldoen aan de zoekopdracht</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { Form } from "vee-validate";

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
	const items = ref([]);
	const itemsTotalPages = ref(0);
	const itemsPages = ref(1);

	const loading = ref(false);
	const status = ref({
		status: false,
		type: "Post",
		error: undefined,
	});

	const { data: User } = await useFetch("/api/users/me");
	const { data: Post } = await useFetch("/api/posts/search", {
		method: "POST",
		body: { title: searchParams.value },
	});

	items.value = Post.value?.posts;
	itemsTotalPages.value = Post.value?.totalPages;

	const handleSearch = async () => {
		if (searchParams.value == "") return navigateTo(`/search`);
		navigateTo(`/search/${searchParams.value}`);
	};

	const refresh = async () => {
		loading.value = true;
		const { data: Post, status } = await useFetch("/api/posts/search?reload=true", {
			method: "POST",
			body: { title: searchParams.value },
		});

		loading.value = status.value != "success";

		items.value = Post.value?.posts;
		itemsTotalPages.value = Post.value?.totalPages;
		itemsPages.value = 1;
	};

	const { list, containerProps, wrapperProps } = useVirtualList(items, {
		itemWidth: 160,
	});

	useInfiniteScroll(
		containerProps.ref,
		async () => {
			if (itemsPages.value >= itemsTotalPages.value) return;
			loading.value = true;

			itemsPages.value += 1;
			const Post = await $fetch(`/api/posts/search?page=${itemsPages.value}`, {
				method: "POST",
				body: { title: searchParams.value },
			});

			setTimeout(() => {
				loading.value = false;
			}, 500);

			items.value.push(...Post.posts);
			itemsTotalPages.value = Post.totalPages;
		},
		{
			direction: "right",
			distance: 8,
		}
	);
</script>
