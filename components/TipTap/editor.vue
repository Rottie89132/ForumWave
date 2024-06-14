<template>
	<div v-if="editor">
		<div class="border rounded-xl border-gray-200 w-full h-full">
			<TipTapMenu :submit="handleListData" :loading v-model="files" class="hidden md:flex bg-gray-100 mb-2 p-2 border-b border-gray-200 rounded-t-xl items-center" :editor="editor" />
			<TiptapEditorContent class="tiptapEditor md:py-1 mb-6 md:mb-1 pt-3 px-3" :editor="editor" />
			<TipTapMenu v-model="files" class="flex md:hidden bg-gray-100 z-30 p-2 border-t border-gray-200 items-center" :editor="editor" :submit="handleListData" :loading />
			<div class="flex md:hidden gap-2 bg-gray-100 p-2 border-t border-gray-400 rounded-b-xl items-center">
				<button @click="submit(handleFormData)" class="bg-[#376A7A] text-[#ffffff] px-4 py-2 md:w-fit rounded-lg font-semibold">
					<icon v-if="loading" class="animate-spin" name="solar:refresh-circle-bold" size="1.6em"> </icon>
					<span v-else>Posten</span>
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>

	import video from "../../composables/Editorvideo";
	import Image from "@tiptap/extension-image";
	import Placeholder from "@tiptap/extension-placeholder";

	const { $pwa }:any = useNuxtApp();
	const Installed = ref(false);
	const files = ref([]);
	const Output = ref({});
	const modalStatus = defineModel();

	const { loading, content, submit } = defineProps<{
		loading: Boolean;
		submit: (callback: any) => void;
		content: string, 
	}>();

	const handleFormData = () => {
		Output.value = editor.value.getJSON();
		const formData = new FormData();
	
		files.value.forEach((file) => {
			formData.append("file", file);
		});
	
		formData.append("content", JSON.stringify(Output.value));
		return formData;
	};

	const handleListData = () => {
		submit(handleFormData);
	};

	const CustomDocument = TiptapDocument.extend({
		content: "heading block*",
	});

	const editor: any = useEditor({
		content: content,
		extensions: [
			video,
			CustomDocument,
			TiptapStarterKit.configure({
				document: false,
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
					class: "TipTapEditorImage TipTapMedia",
				},
			}),
			Placeholder.configure({
				placeholder: ({ node }) => {
					if (node.type.name === "heading") return "Schrijf hier je titel...";
					return "Schrijf hier je content...";
				},
			}),
		],
	});

	const closeModal = () => {
		modalStatus.value = false;
	};

	onMounted(() => {
		if ($pwa.isPWAInstalled) Installed.value = true;
	});

	onUnmounted(() => {
		unref(editor).destroy();
	});
</script>
