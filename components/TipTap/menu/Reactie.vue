<template>
    <div class="overflow-scroll w-full ">
        <div class=" flex items-center md:hidden bg-gray-100 sticky left-0 p-2 pr-0 justify-end w-full">
            <button @click="submit" class="bg-[#376A7A] text-[#ffffff] px-4 py-1 md:w-fit rounded-lg font-semibold">
                <icon v-if="loading" class=" animate-spin" name="solar:refresh-broken" size="1.4em"></icon>
                <span v-else>Posten</span>
            </button>
            <div class="divider"></div>
        </div>
        <div v-for="(item, index) in items">
            <div class="divider" v-if="item.type === 'divider'" :key="`divider${index}`"></div>
            <TipTapMenuList v-else :key="index" v-bind="item" />
        </div>
        <div class=" hidden md:flex justify-end w-full">
            <button @click="submit" class="bg-[#376A7A] text-[#ffffff] px-4 py-1 md:w-fit rounded-lg font-semibold">
                <icon v-if="loading" class="rotate-180 animate-spin" name="solar:refresh-broken" size="1.4em"></icon>
                <span v-else>Posten</span>
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const { loading, editor, submit }: any = defineProps<{
        editor: Object;
        loading: Boolean;
        submit: (callback: any) => void;
    }>();

    const items = [
        {
            icon: "fluent:text-bold-20-filled",
            title: "Bold",
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: () => editor.isActive("bold"),
        },
        {
            icon: "fluent:text-italic-20-filled",
            title: "Italic",
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: () => editor.isActive("italic"),
        },
        {
            icon: "fluent:text-strikethrough-20-filled",
            title: "Strike",
            action: () => editor.chain().focus().toggleStrike().run(),
            isActive: () => editor.isActive("strike"),
        },
        {
            type: "divider",
        },
        {
            icon: "fluent:link-add-20-regular",
            activeIcon: "fluent:link-dismiss-20-regular",
            title: "link",
            action: () => {
                const existingHref = editor.isActive("link") ? editor.getAttributes("link").href : "";

                if (!existingHref) {
                    const href: any = window.prompt("URL", existingHref);
                    if (href.trim()) editor.chain().focus().setLink({ href: href.trim() }).run();
                } else {
                    editor.chain().focus().unsetLink().run();
                }
            },
            isActive: () => editor.isActive("link"),
        },
        {
            type: "divider",
        },

        {
            icon: "fluent:arrow-hook-up-left-20-filled",
            title: "Undo",
            action: () => editor.chain().focus().undo().run(),
        },
        {
            icon: "fluent:arrow-hook-up-right-20-filled",
            title: "Redo",
            action: () => editor.chain().focus().redo().run(),
        },
    ];

</script>

<style scoped>
    .divider {
        @apply bg-black h-5 ml-2 mr-2 md:mr-3 w-px;
    }
</style>
