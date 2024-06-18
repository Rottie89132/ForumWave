<template>
    <div v-if="editor">
        <div :class="modalStatus.error ? ' border-red-600 border-2 ' : 'border-gray-200'"
            class="border rounded-xl w-full h-full">
            <TipTapMenuReactie :submit="handleListData" :loading
                class="hidden md:flex bg-gray-100 mb-2 p-2 border-b border-gray-200 rounded-t-xl items-center"
                :editor="editor" />
            <TiptapEditorContent class="tiptapEditorReactie md:py-1 mb-2 md:mb-1 pt-3 px-3" :editor="editor" />
            <TipTapMenuReactie
                class="flex md:hidden bg-gray-100 z-30 border-t rounded-b-xl border-gray-200 items-center"
                :editor="editor" :submit="handleListData" :loading />
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { Image } from "@tiptap/extension-image";
    import video from "@/composables/video";

    const { $pwa }: any = useNuxtApp();
    const Installed = ref(false);
    const Output = ref({});
    const modalStatus: any = defineModel();

    const { loading, content, submit } = defineProps<{
        loading: Boolean;
        submit: (callback: any) => void;
        content: string,
    }>();

    const handleFormData = () => {
        Output.value = editor.value.getJSON();
        return Output.value;
    };

    const handleListData = () => {
        submit(handleFormData);
    };


    const editor: any = useEditor({
        content: content,
        extensions: [
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
            Placeholder.configure({
                placeholder:"Schrijf hier je content...",
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
