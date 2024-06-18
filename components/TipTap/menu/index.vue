<template>
    <div class="overflow-scroll w-full ">
        <div class=" flex items-center md:hidden bg-gray-100 sticky left-0 p-2 pr-0 justify-end w-full">
            <button @click="submit" class="bg-[#376A7A] text-[#ffffff] px-4 py-1 md:w-fit rounded-lg font-semibold">
                <icon v-if="loading" class=" animate-spin" name="bx:loader-circle" size="1.4em"></icon>
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
                <icon v-if="loading" class=" animate-spin" name="bx:loader-circle" size="1.4em"></icon>
                <span v-else>Posten</span>
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const modalFiles: any = defineModel()
    
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
            icon: "fluent:text-header-1-20-filled",
            title: "Heading 1",
            action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: () => editor.isActive("heading", { level: 1 }),
        },
        {
            icon: "fluent:text-header-2-20-filled",
            title: "Heading 2",
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => editor.isActive("heading", { level: 2 }),
        },
        {
            icon: "fluent:text-paragraph-direction-20-filled",
            title: "Paragraph",
            action: () => editor.chain().focus().setParagraph().run(),
            isActive: () => editor.isActive("paragraph"),
        },
        {
            type: "divider",
        },
        {
            icon: "fluent:text-bullet-list-20-filled",
            title: "Bullet List",
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: () => editor.isActive("bulletList"),
        },
        {
            icon: "fluent:apps-list-20-filled",
            title: "Ordered List",
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: () => editor.isActive("orderedList"),
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
            icon: "fluent:image-20-regular",
            activeIcon: "fluent:image-off-20-regular",
            title: "image",
            action: async () => {
                return new Promise((resolve, reject) => {
                    if (editor.isActive("image") || editor.isActive("video")) {
                        editor.commands.deleteSelection();
                        reject(new Error("Image selection deleted."));
                    } else {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/png,image/jpeg,image/gif,video/mp4";
                        input.onchange = (event: any) => {
                            const file = event.target.files[0];
                            if (file) {

                                if(file.type.includes("image")) editor.chain().focus().setImage({ src: URL.createObjectURL(file), alt: file.name, title: file.name }).run();
                                else editor.chain().focus().setVideo({ src: URL.createObjectURL(file), title: file.name, type: `video/mp4` }).run();
                                
                                editor.commands.createParagraphNear();
                                editor.commands.scrollIntoView();

                                resolve(file); 
                            } else {
                                reject(new Error("No file selected.")); 
                            }
                        };
                        input.click();
                    }
                }).then((file: any) => {
                
                    const reader = new FileReader();
                    reader.readAsDataURL(file)
                    reader.onload = () => {
                        modalFiles.value.push(file)
                    }

                }).catch(() => {
                    const images: any = document.querySelectorAll(".TipTapMedia")
                    const DeletedImages: any[] = []

                    

                    for (let i = 0; i < images.length; i++) {DeletedImages.push({title: images[i].title})}
                    const remainingFiles = modalFiles.value.filter((file: any) =>
                        DeletedImages.some(image => image.title === file.name)
                    );

                    modalFiles.value = remainingFiles
                    
                });
            },
            isActive: () => editor.isActive("image") || editor.isActive("video"),
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

