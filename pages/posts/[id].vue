<template>
	<div>
		<div class="sm:px-28 md:px-30 lg:px-52 xl:px-80 px-5 py-3 fixed w-full h-full overflow-scroll">
			<div class="bg-white sticky z-50 -top-4 py-3">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-4 pr-5">
						<NuxtLink to="/" class="text-lg font-bold">Home</NuxtLink>
					</div>
					<div class="flex items-center gap-2">
						<button @click="refresh"
							class=" border-[#376A7A] border text-[#376A7A] p-2 w-fit rounded-xl flex items-center justify-center">
							<icon name="solar:refresh-broken" size="1.4em" :class="loading ? ' animate-spin' : ''">
							</icon>
						</button>
						<button @click="$router.back()"
							class="bg-[#376A7A] text-[#ffffff] p-2 w-fit rounded-xl flex items-center justify-center">
							<icon name="solar:forward-line-duotone" size="1.4em" class="text-white rotate-180"></icon>
						</button>
					</div>

				</div>
				<hr class="w-full mt-2 -mb-1" />
			</div>

			<div class="mt-2 z-20">
				<div class="bg-gray-50 p-3 md:p-5 mb-16 rounded-md border">
					<div class="group ml-[85%] z-30 sticky -mb-[2.5rem] top-[4.2rem] right-9 sm:right-[7.8rem] md:right-[8.3rem] lg:right-[14.2rem] xl:right-[21rem]"
						v-if="owned">
						<div class="w-full pb-10 group flex justify-end">
							<icon name="solar:menu-dots-bold" size="2.2em"
								class="text-gray-400 bg-white -mb-9 border-gray-300 border p-1 rounded-md"></icon>
							<div class="group-hover:block hidden absolute mt-10 transition-all duration-200">
								<div class="flex text-sm shadow-md flex-col justify-start items-start rounded-md">
									<button @click="openEditPostModal"
										class="text-[#376A7A] w-full hover:bg-slate-100 bg-white border rounded-t-md p-1 px-2 flex items-center gap-2">
										<icon name="solar:pen-new-round-outline" size="1.2em" class=""></icon>
										<span>|</span>
										<span>Bewerken</span>
									</button>
									<button @click="OpenDeletePostModal"
										class="text-[#376A7A] hover:bg-slate-100 bg-white border rounded-b-md p-1 px-2 flex items-center gap-2">
										<icon name="solar:trash-bin-minimalistic-outline" size="1.2em" class="">
										</icon>
										<span>|</span>
										<span>Verwijderen</span>
									</button>
								</div>
							</div>
						</div>
					</div>
					<div>
						<div class="flex items-center gap-1">
							<NuxtLink :to="`/user/${items.UserId}`">
								<h1 class="text-[0.9rem] underline text-[#376A7A] font-semibold opacity-60">{{
									Author ||
									"Onbekent" }}
								</h1>
							</NuxtLink>
							<span class="opacity-60"> | </span>
							<h1 class="text-[0.9rem] opacity-60">{{ useTimeAgo(items?.CreatedAt).value }}</h1>
						</div>
					</div>
					<div class="tiptap select-none" v-html="output"></div>
					<hr class="mb-2 mt-2" />
					<div class="flex select-none gap-1 items-center justify-between">
						<div class="cursor-default text-[0.9rem] flex gap-1">
							<div class="flex gap-1 items-center group transition-all duration-150">
								<Icon v-if="liked" @click="unlike" name="solar:heart-bold" size="1em"
									class="group-hover:text-cyan-700 text-cyan-500 group-hover:scale-100 scale-150 group-hover:mr-[0rem] mr-[0.25rem] transition-all duration-150">
								</Icon>
								<Icon v-else-if="!owned" @click="addLike" name="solar:heart-bold" size="1em"
									class="group-hover:text-cyan-500 group-hover:scale-150 group-hover:mr-[0.25rem] transition-all duration-150">
								</Icon>
								<Icon v-else name="solar:heart-bold" size="1em"
									class="group-hover:text-cyan-500 group-hover:scale-150 group-hover:mr-[0.25rem] transition-all duration-150">
								</Icon>
								<span class="group-hover:font-medium"> {{ items?.meta?.Likes || 0 }}</span>
							</div>
							<span class="opacity-60"> | </span>
							<div class="flex gap-1 items-center group transition-all duration-150">
								<Icon name="solar:eye-bold" size="1em"
									class="group-hover:scale-150 group-hover:mr-[0.25rem] transition-all duration-150">
								</Icon>
								<span class="group-hover:font-medium">{{ items?.meta?.views || 0 }}</span>
							</div>
							<span class="opacity-60"> | </span>
							<div class="flex gap-1 items-center group transition-all duration-150">
								<Icon name="solar:chat-round-dots-bold" size="1em"
									class="group-hover:scale-150 group-hover:mr-[0.25rem] transition-all duration-150">
								</Icon>
								<span class="group-hover:font-medium">{{ items?.meta?.comments || 0 }}</span>
							</div>
						</div>
						<button @click="openCreatePostModal" class="text-[#376A7A]">
							<span class="opacity-80"> Beantwoorden </span>
						</button>
					</div>
				</div>
			</div>
		</div>
		<TipTapModal v-model="status">
			<p class="mb-3">Hier kan je de post bewerken</p>
			<hr class=" hidden md:block my-2" />
			<TipTapEditor v-model="status" :submit :loading :content />
		</TipTapModal>
	</div>
</template>

<script setup>
	import video from "../../composables/video";
	import Image from "@tiptap/extension-image";
	import { generateHTML } from "@tiptap/html";

	definePageMeta({
		middleware: "auth",
	});

	useSeoMeta({
		title: "ForumWave - Post",
		description: "Bekijk de post op ForumWave!",
		ogTitle: "ForumWave",
		ogDescription: "Bekijk de post op ForumWave!",
		ogImage: "/apple-touch-icon.png",
		ogUrl: "/",
		twitterTitle: "ForumWave",
		twitterDescription: "Bekijk de post op ForumWave!",
		twitterImage: "/apple-touch-icon.png",
		twitterCard: "summary",
	});

	const id = useRoute().params.id;
	const items = ref([]);
	//const output = ref("");
	const status = ref({});
	const loading = ref(false);
	const Author = ref("");
	const owned = ref(false);
	const content = ref("");
	const liked = ref(false);

	const { data: Post } = await useFetch(`/api/posts/${id}`);
	items.value = Post.value?.posts;
	liked.value = Post.value?.liked;
	owned.value = Post.value?.owned;
	Author.value = Post.value?.Author;

	const output = computed(() => generateHTML(items.value.Content, [
		video,
		TiptapStarterKit.configure({
			bulletList: {
				HTMLAttributes: {
					class: "bullet_class",
				},
			},
			orderedList: {
				HTMLAttributes: {
					class: "order_class",
				},
			},
		}),
		TiptapLink.configure({
			HTMLAttributes: {
				class: "TipTapLink",
			},
		}),
		Image.configure({
			HTMLAttributes: {
				class: "TipTapImage TipTapMedia",
			},
		}),
	]));

	const refresh = async () => {
		loading.value = true;
		const { data: Post, status } = await useFetch(`/api/posts/${id}?reload=true`);

		loading.value = status.value != "success";

		items.value = Post.value?.posts;
		liked.value = Post.value?.liked;
		owned.value = Post.value?.owned;
		Author.value = Post.value?.Author;

	}

	const openEditPostModal = () => {
		content.value = output.value;
		status.value = {
			status: true,
			type: "Post",
		};
	};

	const OpenDeletePostModal = async () => {
		const { data, error } = await useFetch(`/api/posts/${id}`, {
			method: "DELETE",
		});

		if (!error.value) {
			navigateTo("/");
		}
	};

	const addLike = async () => {
		const { data, error } = await useFetch(`/api/posts/${id}/likes`, {
			method: "POST",
		});

		if (!error.value) {
			liked.value = true;
			const { data: Post } = await useFetch(`/api/posts/${id}`);
			items.value = Post.value?.posts;
			liked.value = Post.value?.liked;
		}
	};

	const unlike = async () => {
		const { data, error } = await useFetch(`/api/posts/${id}/likes`, {
			method: "DELETE",
		});

		if (!error.value) {
			liked.value = false;
			const { data: Post } = await useFetch(`/api/posts/${id}`);
			items.value = Post.value?.posts;
			liked.value = Post.value?.liked;
		}
	};

	const openCreatePostModal = () => {
		status.value = {
			status: true,
			type: "Post",
		};
	};

	const submit = async (callback) => {
		loading.value = true;
		const result = callback();

		// const { data, error, pending } = await useFetch("/api/posts", {
		// 	method: "POST",
		// 	body: result,
		// });

		// if (!error.value) {

		setTimeout(() => {
			loading.value = false;
			setTimeout(() => {
				status.value = false;
			}, 1000);
		}, 1000);
	};
</script>
