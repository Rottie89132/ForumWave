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
							<icon name="solar:refresh-broken" size="1.4em" :class="loading ? ' rotate-180 animate-spin' : ''"> </icon>
						</button>
						<button @click="$router.back()" class="bg-[#376A7A] text-[#ffffff] p-2 w-fit rounded-xl flex items-center justify-center">
							<icon name="solar:forward-line-duotone" size="1.4em" class="text-white rotate-180"></icon>
						</button>
					</div>
				</div>
				<hr class="w-full mt-2 -mb-1" />
			</div>

			<div class="mt-2 z-20">
				<div class="bg-gray-50 p-3 md:p-5 rounded-md border">
					<div class="group ml-[85%] z-30 sticky -mb-[2.5rem] top-[4.2rem] right-9 sm:right-[7.8rem] md:right-[8.3rem] lg:right-[14.2rem] xl:right-[21rem]" v-if="owned">
						<div class="w-full pb-10 group flex justify-end">
							<icon name="solar:menu-dots-bold" size="2.2em" class="text-gray-400 bg-white -mb-9 border-gray-300 border p-1 rounded-md"></icon>
							<div class="group-hover:block hidden absolute mt-10 transition-all duration-200">
								<div class="flex text-sm shadow-md flex-col justify-start items-start rounded-md">
									<button @click="openEditPostModal(false)" class="text-[#376A7A] w-full hover:bg-slate-100 bg-white border rounded-t-md p-1 px-2 flex items-center gap-2">
										<icon name="solar:pen-new-round-outline" size="1.2em" class=""></icon>
										<span>|</span>
										<span>Bewerken</span>
									</button>
									<button @click="OpenDeletePostModal(false, items._id)" class="text-[#376A7A] hover:bg-slate-100 bg-white border rounded-b-md p-1 px-2 flex items-center gap-2">
										<icon name="solar:trash-bin-minimalistic-outline" size="1.2em" class=""> </icon>
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
								<h1 class="text-[0.9rem] underline text-[#376A7A] font-semibold opacity-60">{{ Author || "Onbekent" }}</h1>
							</NuxtLink>
							<span class="opacity-60"> | </span>
							<h1 class="text-[0.9rem] opacity-60">{{ useTimeAgo(items?.CreatedAt).value }}</h1>
						</div>
					</div>
					<div class="tiptap select-none" v-html="UseMakeHtml(items)"></div>
					<hr class="mb-2 mt-2" />
					<div class="flex select-none gap-1 items-center justify-between">
						<div class="cursor-default text-[0.9rem] flex gap-1">
							<div class="flex gap-1 items-center group transition-all duration-150">
								<Icon v-if="liked" @click="unlike" name="solar:heart-bold" size="1em" class="group-hover:text-cyan-700 text-cyan-500 group-hover:scale-100 scale-150 group-hover:mr-[0rem] mr-[0.25rem] transition-all duration-150"> </Icon>
								<Icon v-else-if="!owned" @click="addLike" name="solar:heart-bold" size="1em" class="group-hover:text-cyan-500 group-hover:scale-150 group-hover:mr-[0.25rem] transition-all duration-150"> </Icon>
								<Icon v-else name="solar:heart-bold" size="1em" class="group-hover:text-cyan-500 group-hover:scale-150 group-hover:mr-[0.25rem] transition-all duration-150"> </Icon>
								<span class="group-hover:font-medium"> {{ items?.meta?.Likes || 0 }}</span>
							</div>
							<span class="opacity-60"> | </span>
							<div class="flex gap-1 items-center group transition-all duration-150">
								<Icon name="solar:eye-bold" size="1em" class="group-hover:scale-150 group-hover:mr-[0.25rem] transition-all duration-150"> </Icon>
								<span class="group-hover:font-medium">{{ items?.meta?.views || 0 }}</span>
							</div>
							<span class="opacity-60"> | </span>
							<div class="flex gap-1 items-center group transition-all duration-150">
								<Icon name="solar:chat-round-dots-bold" size="1em" class="group-hover:scale-150 group-hover:mr-[0.25rem] transition-all duration-150"> </Icon>
								<span class="group-hover:font-medium">{{ items?.meta?.Comments || 0 }}</span>
							</div>
						</div>
						<button @click="openCreatePostModal" class="text-[#376A7A]">
							<span class="opacity-80"> Beantwoorden </span>
						</button>
					</div>
				</div>
			</div>
			<div class="mt-3 mb-16">
				<div>
					<div class="flex items-center gap-2">
						<h1 class="text-[#376A7A] font-semibold text-lg">Reacties</h1>
						<span class="text-[#376A7A] opacity-60">({{ comments.length }})</span>
					</div>
					<hr class="mt-2" />

					<div v-for="comment in comments" :key="comment.id" class="bg-[#eaf0f2] p-3 md:p-5 rounded-md border mt-2">
						<div class="group ml-[85%] z-30 sticky -mb-[2.5rem] top-[4.2rem] right-9 sm:right-[7.8rem] md:right-[8.3rem] lg:right-[14.2rem] xl:right-[21rem]" v-if="comment.owned">
							<div class="w-full pb-10 group flex justify-end">
								<icon name="solar:menu-dots-bold" size="2em" class="text-[#376A7A] -mb-10 -mt-1 p-1 rounded-md"> </icon>
								<div class="group-hover:block hidden absolute mt-8 transition-all duration-200">
									<div class="flex text-sm shadow-md flex-col justify-start items-start rounded-md">
										<button @click="openEditPostModal(true, UseMakeHtml(comment), comment._id)" class="text-[#376A7A] w-full hover:bg-slate-100 bg-white border rounded-t-md p-1 px-2 flex items-center gap-2">
											<icon name="solar:pen-new-round-outline" size="1.2em" class=""></icon>
											<span>|</span>
											<span>Bewerken</span>
										</button>
										<button @click="OpenDeletePostModal(true, comment._id)" class="text-[#376A7A] hover:bg-slate-100 bg-white border rounded-b-md p-1 px-2 flex items-center gap-2">
											<icon name="solar:trash-bin-minimalistic-outline" size="1.2em" class=""> </icon>
											<span>|</span>
											<span>Verwijderen</span>
										</button>
									</div>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-1">
							<NuxtLink :to="`/user/${comment.UserId}`">
								<h1 class="text-[0.9rem] underline text-[#376A7A] font-semibold opacity-60">{{ comment.author || "Onbekent" }}</h1>
							</NuxtLink>

							<span class="opacity-60"> | </span>
							<h1 class="text-[0.9rem] opacity-60">{{ useTimeAgo(comment?.CreatedAt).value }}</h1>
						</div>
						<div class="tiptap select-none" v-html="UseMakeHtml(comment)"></div>
					</div>
				</div>
			</div>
		</div>
		<TipTapModal v-model="status">
			<div v-if="isEdit">
				<p v-if="!isComment" class="mb-3">Hier kan je de post bewerken</p>
				<p v-else class="mb-3">Hier kan je de reactie bewerken</p>
				<hr class="hidden md:block my-2" />

				<TipTapEditor v-if="!isComment" v-model="status" :submit :loading :content />
				<TipTapEditorReactie v-else v-model="status" :submit="SumbitEditReactie" :loading :content />
				<div v-if="status?.error" class="flex justify-start gap-2 mt-2">
					<p class="text-red-600 text-sm">
						{{ status.error }}
					</p>
				</div>
			</div>
			<div v-else>
				<p class="mb-3">Hier kan je <span class="text-[#376A7A] cursor-pointer">reageren</span> op de post.</p>
				<hr class="hidden md:block my-2" />
				<TipTapEditorReactie v-model="status" :submit="sumbitReactie" :loading :content />
				<div v-if="status?.error" class="flex justify-start gap-2 mt-2">
					<p class="text-red-600 text-sm">
						{{ status.error }}
					</p>
				</div>
			</div>
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
	const status = ref({});
	const loading = ref(false);
	const Author = ref("");
	const owned = ref(false);
	const content = ref("");
	const liked = ref(false);
	const isEdit = ref(false);
	const comments = ref([]);
	const isComment = ref(false);
	const CommentId = ref(null);

	const { data: Post } = await useFetch(`/api/posts/${id}`);
	items.value = Post.value?.posts;
	liked.value = Post.value?.liked;
	owned.value = Post.value?.owned;
	Author.value = Post.value?.Author;
	comments.value = Post.value?.Comments;

	const UseMakeHtml = (item) => {
		return generateHTML(item.Content, [
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
		]);
	};

	const output = computed(() => UseMakeHtml(items.value));

	const refresh = async () => {
		loading.value = true;
		const { data: Post, status } = await useFetch(`/api/posts/${id}?reload=true`);

		loading.value = status.value != "success";

		items.value = Post.value?.posts;
		liked.value = Post.value?.liked;
		owned.value = Post.value?.owned;
		Author.value = Post.value?.Author;
		comments.value = Post.value?.Comments;
	};

	const openEditPostModal = (CommentActive, contenValue, MessageId) => {
		isEdit.value = true;
		isComment.value = CommentActive;
		CommentId.value = MessageId;
		content.value = CommentActive ? contenValue : output.value;
		status.value = {
			status: true,
			type: "Post",
		};
	};

	const OpenDeletePostModal = async (Comment, MessageId) => {
		if (Comment) {
			CommentId.value = MessageId;
			const { data, error } = await useFetch(`/api/posts/${id}/comments/${MessageId}`, {
				method: "DELETE",
			});

			if (!error.value) {
				const { data: Post } = await useFetch(`/api/posts/${id}`);
				items.value = Post.value?.posts;
				comments.value = Post.value?.Comments;
			}
		} else {
			const { data, error } = await useFetch(`/api/posts/${MessageId}`, {
				method: "DELETE",
			});

			if (!error.value) {
				navigateTo("/");
			}
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
		isEdit.value = false;
		content.value = "";
		status.value = {
			status: true,
			type: "Post",
		};
	};

	const sumbitReactie = async (callback) => {
		loading.value = true;
		const result = callback();

		status.value.error = undefined;
		const { data, error } = await useFetch(`/api/posts/${id}/comments`, {
			method: "POST",
			body: result,
		});

		loading.value = false;
		if (!error.value) {
			const { data: Post } = await useFetch(`/api/posts/${id}`);
			items.value = Post.value?.posts;
			comments.value = Post.value?.Comments;
			status.value = false;
		} else {
			status.value = {
				status: true,
				type: "Post",
				error: error.value.data.message,
			};
		}
	};

	const SumbitEditReactie = async (callback) => {
		loading.value = true;
		const result = callback();

		status.value.error = undefined;
		const { data, error } = await useFetch(`/api/posts/${id}/comments/${CommentId.value}`, {
			method: "Patch",
			body: result,
		});

		loading.value = false;
		if (!error.value) {
			const { data: Post } = await useFetch(`/api/posts/${id}`);
			items.value = Post.value?.posts;
			comments.value = Post.value?.Comments;
			status.value = false;
		} else {
			status.value = {
				status: true,
				type: "Post",
				error: error.value.data.message,
			};
		}
	};

	const submit = async (callback) => {
		loading.value = true;
		const result = callback();

		const { data, error } = await useFetch(`/api/posts/${id}`, {
			method: "Patch",
			body: result,
		});

		loading.value = false;

		if (!error.value) {
			const { data: Post } = await useFetch(`/api/posts/${id}`);
			items.value = Post.value?.posts;
			comments.value = Post.value?.Comments;
			status.value = false;
		} else {
			status.value = {
				status: true,
				type: "Post",
				error: error.value.data.message,
			};
		}

		
	};
</script>
