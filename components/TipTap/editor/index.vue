<template>
	<div v-if="editor">
		<div class=" w-full h-full">
			<TipTapMenu :submit="handleListData" :loading v-model="files" class="flex bg-gray-100 mb-2 md:p-2 py-1 md:py-3 rounded-md items-center" :editor="editor" />
			<TiptapEditorContent :class="modalStatus.error ? ' border-red-400 border-2 ' : ''" class="tiptapEditor bg-gray-100 md:py-2 mb-2 md:mb-1 py-3 px-3" :editor="editor" />
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { Image } from "@tiptap/extension-image";
	import video from "@/composables/video";

	const { $pwa }:any = useNuxtApp();
	const Installed = ref(false);
	const files = ref([]);
	const Output = ref({});
	const modalStatus: any = defineModel();

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
					class: "TipTapImage TipTapMedia",
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

	onMounted(() => {
		if ($pwa.isPWAInstalled) Installed.value = true;
	});

	onUnmounted(() => {
		unref(editor).destroy();
	});
</script>
