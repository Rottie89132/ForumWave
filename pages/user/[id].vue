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
							<icon name="bx:loader-circle" size="1.4em" :class="loading ? ' animate-spin' : ''"></icon>
						</button>
						<span class="border-[#376A7A] text-sm w-16 border text-[#376A7A] p-[0.56rem] rounded-xl flex items-center justify-center">
							{{ Pages }}
						</span>
						<button @click="$router.back()" class="bg-[#376A7A] border-[#376A7A] border text-[#ffffff] p-2 w-fit rounded-xl flex items-center justify-center">
							<icon name="bx:arrow-back" size="1.4em" class=""></icon>
						</button>
					</div>
				</div>
				<hr class="w-full mt-2 -mb-1" />
			</div>

			<div class="mt-2 z-20">
				<div class="mb-16">
					<div class="mb-3">
						<h1 class="font-bold">Overzicht van {{ user.user.Username || "Onbekent" }}</h1>
					</div>
					<div class="grid grid-cols-2 mb-3 border rounded-lg overflow-hidden bg-gray-100 cursor-pointer">
						<div class="flex justify-center items-center py-2" :class="activeTab === 'Posts' ? 'bg-[#376A7A] text-white rounded-lg' : 'bg-gray-100'" @click="setActiveTab('Posts')">
							<span class="text-sm">Posts</span>
						</div>
						<div class="flex justify-center items-center py-2" :class="activeTab === 'Comments' ? 'bg-[#376A7A] text-white rounded-lg' : 'bg-gray-100'" @click="setActiveTab('Comments')">
							<span class="text-sm">Comments</span>
						</div>
					</div>
					<div v-if="items.length > 0" v-bind="containerProps" class="h-[62vh] md:h-[65.5vh] overflow-scroll w-full">
						<div v-bind="wrapperProps" class="flex flex-col gap-3 snap-y snap-proximity scroll-smooth">
							<div class="bg-gray-50 p-3 h-[95px] overflow-hidden rounded-md border" v-for="posts in list" :key="posts.index">
								<PostsCreated v-if="activeTab === 'Posts'" :posts />
								<PostsCreatedComments v-else :posts />
							</div>
						</div>
					</div>
					<p v-if="items.length < 1" class="opacity-60 font-semibold">Er zijn nog geen {{ activeTab.toLocaleLowerCase() }} beschikbaar</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	definePageMeta({
		middleware: "auth",
	});

	useSeoMeta({
		title: "ForumWave - User",
		description: "Overzicht van de gebruiker",
		ogTitle: "ForumWave",
		ogDescription: "Overzicht van de gebruiker",
		ogImage: "/apple-touch-icon.png",
		ogUrl: "/",
		twitterTitle: "ForumWave",
		twitterDescription: "Overzicht van de gebruiker",
		twitterImage: "/apple-touch-icon.png",
		twitterCard: "summary",
	});

	const userId = useRoute().params.id;
	const items = ref([]);
	const Pages = ref(1);
	const TotalPages = ref(0);
	const loading = ref(false);
	const activeTab = ref(useRoute().query.tab || "Posts");

	const { data: user, error: userError } = await useFetch(`/api/users/${userId}`);

	if (activeTab.value == "Comments") {
		const { data, error } = await useFetch(`/api/users/comments?SearchId=${userId}`);
		items.value = data.value?.comments;
		TotalPages.value = data.value?.totalPages;
	} else {
		const { data, error } = await useFetch(`/api/users/posts?SearchId=${userId}`);
		items.value = data.value?.posts;
		TotalPages.value = data.value?.totalPages;
	}

	const setActiveTab = async (tab) => {
		loading.value = true;
		const itemData = ref();
		const itemTotalPages = ref();
		const itemsStatus = ref();

		if (tab == "Comments") {
			const { data, status } = await useFetch(`/api/users/comments?page=1&SearchId=${userId}&reload=true`);
			itemData.value = data.value?.comments;
			itemTotalPages.value = data.value?.totalPages;
			itemsStatus.value = status.value;
		} else {
			const { data, status } = await useFetch(`/api/users/posts?page=1&SearchId=${userId}&reload=true`);
			itemData.value = data.value?.posts;
			itemTotalPages.value = data.value?.totalPages;
			itemsStatus.value = status.value;
		}

		loading.value = itemsStatus.value != "success";
		activeTab.value = tab;

		items.value = itemData.value;
		TotalPages.value = itemTotalPages.value;
		Pages.value = 1;
		navigateTo(`/user/${userId}?tab=${tab}`);
	};

	const refresh = async () => {
		loading.value = true;
		const itemData = ref();
		const itemTotalPages = ref();
		const itemsStatus = ref();

		if (activeTab.value == "Comments") {
			const { data, status } = await useFetch(`/api/users/comments?page=1&SearchId=${userId}&reload=true`);
			itemData.value = data.value?.comments;
			itemTotalPages.value = data.value?.totalPages;
			itemsStatus.value = status.value;
		} else {
			const { data, status } = await useFetch(`/api/users/posts?page=1&SearchId=${userId}&reload=true`);
			itemData.value = data.value?.posts;
			itemTotalPages.value = data.value?.totalPages;
			itemsStatus.value = status.value;
		}

		loading.value = itemsStatus.value != "success";
		items.value = itemData.value;
		TotalPages.value = itemTotalPages.value;
		Pages.value = 1;
	};

	const { list, containerProps, wrapperProps } = useVirtualList(items, {
		itemHeight: 105,
	});

	useInfiniteScroll(
		containerProps.ref,
		async () => {
			if (Pages.value >= TotalPages.value) return;
			loading.value = true;

			Pages.value += 1;

			if (activeTab.value == "Comments") {
				const data = await $fetch(`/api/users/comments?page=${Pages.value}&SearchId=${userId}`);

				setTimeout(() => {
					loading.value = false;
				}, 500);

				items.value.push(...data.comments);
				TotalPages.value = data.totalPages;
			} else {
				const data = await $fetch(`/api/users/posts?page=${Pages.value}&SearchId=${userId}`);

				setTimeout(() => {
					loading.value = false;
				}, 500);

				items.value.push(...data.posts);
				TotalPages.value = data.totalPages;
			}
		},
		{
			distance: 12,
		}
	);
</script>
