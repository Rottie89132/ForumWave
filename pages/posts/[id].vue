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
							class="border-[#376A7A] border text-[#376A7A] p-2 w-fit rounded-xl flex items-center justify-center">
							<icon name="bx:loader-circle" size="1.4em" :class="loading ? ' animate-spin' : ''"> </icon>
						</button>
						<button @click="$router.back()"
							class="bg-[#376A7A] border-[#376A7A] border text-[#ffffff] p-2 w-fit rounded-xl flex items-center justify-center">
							<icon name="bx:arrow-back" size="1.4em" class="text-white"></icon>
						</button>
					</div>
				</div>
				<hr class="w-full mt-2 -mb-1" />
			</div>

			<div class="mt-2 z-20">
				<PostsDetails 
					:loading 
					:items 
					:disabled 
					:openEditPostModal 
					:OpenDeletePostModal 
					:UseMakeHtml
					:openCreatePostModal 
					:addLike 
					:unlike 
				/>
			</div>
			<div class="mt-3 mb-28">
				<div>
					<div class="flex items-center gap-2">
						<h1 class="text-[#376A7A] font-semibold text-lg">Reacties</h1>
						<span class="text-[#376A7A] opacity-60">({{ comments.length }})</span>
					</div>
					<hr class="mt-2" />
					<div v-if="comments.length < 1" class="mt-2">
						<p class="text-gray-400">Er zijn nog geen reacties beschikbaar</p>
					</div>
					<PostsComments v-else 
						:loading 
						:comments 
						:openEditPostModal 
						:OpenDeletePostModal 
						:UseMakeHtml
						:upVoteComment 
						:downVoteComment 
					/>
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
	import Image from "@tiptap/extension-image";
	import video from "@/composables/video";

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
	const content = ref("");
	const isEdit = ref(false);
	const comments = ref([]);
	const isComment = ref(false);
	const CommentId = ref(null);
	const disabled = ref(false);

	const { data: Post } = await useFetch(`/api/posts/${id}`);
	items.value = Post.value
	comments.value = Post.value?.Comments;

	const UseMakeHtml = (item) => {
		const Html = item.posts?.Content || item.Content;
		return generateHTML(Html, [
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

	const upVoteComment = async (MessageId) => {

		const { data, error } = await useFetch(`/api/posts/${id}/comments/vote/${MessageId}`, {
			method: "patch",
		});

		if (!error.value) {
			const { data: Post } = await useFetch(`/api/posts/${id}`);
			items.value = Post.value
			comments.value = Post.value?.Comments;
		}

	};

	const downVoteComment = async (MessageId) => {

		const { data, error } = await useFetch(`/api/posts/${id}/comments/vote/${MessageId}?DownVote=true`, {
			method: "patch",
		});

		if (!error.value) {
			const { data: Post } = await useFetch(`/api/posts/${id}`);
			items.value = Post.value
			comments.value = Post.value?.Comments;
		}

	};

	const refresh = async () => {
		loading.value = true;
		const { data: Post, status } = await useFetch(`/api/posts/${id}?reload=true`);

		loading.value = status.value != "success";
		items.value = Post.value
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
		loading.value = true;
		if (Comment) {
			CommentId.value = MessageId;
			const { error, status } = await useFetch(`/api/posts/${id}/comments/${MessageId}`, {
				method: "DELETE",
			});

			loading.value = status.value != "success";
			if (!error.value) {
				const { data: Post } = await useFetch(`/api/posts/${id}`);
				items.value = Post.value
				comments.value = Post.value?.Comments;
			}
		} else {
			const { error, status } = await useFetch(`/api/posts/${MessageId}`, {
				method: "DELETE",
			});

			loading.value = status.value != "success";
			if (!error.value) {
				navigateTo("/");
			}
		}
	};

	const addLike = async () => {
		disabled.value = true;
		const { data, error, status } = await useFetch(`/api/posts/${id}/likes`, {
			method: "POST",
		});

		if (!error.value) {
			const { data: Post } = await useFetch(`/api/posts/${id}`);
			items.value = Post.value
		}

		disabled.value = status.value != "success";
	};

	const unlike = async () => {
		disabled.value = true;
		const { data, error, status } = await useFetch(`/api/posts/${id}/likes`, {
			method: "DELETE",
		});

		if (!error.value) {
			const { data: Post } = await useFetch(`/api/posts/${id}`);
			items.value = Post.value
		}

		disabled.value = status.value != "success";
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
			items.value = Post.value
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
			items.value = Post.value
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
			items.value = Post.value
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
