<template>
	<div>
		<div class="sm:px-28 md:px-30 lg:px-52 xl:px-80 px-5 py-3 fixed w-full h-full overflow-scroll">
			<div class="bg-white sticky z-50 -top-4 py-3">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-4 pr-5">
						<NuxtLink to="/" class="text-lg font-bold">Home</NuxtLink>
					</div>
					<div class="flex items-center gap-2">
						<button @click="$router.back()" class="bg-[#376A7A] border-[#376A7A] border text-[#ffffff] p-2 w-fit rounded-xl flex items-center justify-center">
							<icon name="bx:arrow-back" size="1.4em" class="text-white"></icon>
						</button>
					</div>
				</div>
				<hr class="w-full mt-2 mb-1" />
				<h1 class="text-4xl font-bold">Wijzigen</h1>
				<p class="mb-3">Hier kan je de post bewerken</p>
				<hr class="w-full -mt-1 -mb-1" />
			</div>

			<div class="z-20 pb-14 md:pb-6">
				<TipTapEditor v-model="status" :submit :loading :content />
			</div>
		</div>
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

	const comments = ref([]);
	const { data: Post, error } = await useFetch(`/api/posts/${id}`);

	if (error.value) {
		navigateTo("/");
	}

	items.value = Post.value;
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

	const router = useRouter();
	const output = computed(() => UseMakeHtml(items.value));
	content.value = output.value;

	const submit = async (callback) => {
		loading.value = true;
		const result = callback();

		const { data, error } = await useUploadFilesInChunks(`/api/posts/${id}`, {
			method: "Patch",
			body: result,
		});

		loading.value = false;

		if (!error.value) {
			setTimeout(() => {
				router.back();
			}, 200);
		} else {
			status.value = {
				status: true,
				type: "Post",
				error: error.value.data.message,
			};
		}
	};
</script>
