<template>
    <div class="bg-gray-50 p-3 md:p-5 rounded-md border">
        <div class="group ml-[85%] z-30 sticky -mb-[2.5rem] top-[4.2rem] right-9 sm:right-[7.8rem] md:right-[8.3rem] lg:right-[14.2rem] xl:right-[21rem]"
            v-if="items.owned">
            <div class="w-full pb-10 group flex justify-end">
                <icon name="solar:menu-dots-bold" size="2.2em"
                    class="text-gray-400 bg-white -mb-9 border-gray-300 border p-1 rounded-md"></icon>
                <div class="group-hover:block hidden absolute mt-10 transition-all duration-200">
                    <div class="flex text-sm shadow-md flex-col justify-start items-start rounded-md">
                        <button @click="openEditPostModal(false)"
                            class="text-[#376A7A] w-full hover:bg-slate-100 bg-white border rounded-t-md p-1 px-2 flex items-center gap-2">
                            <icon name="bx:bxs-pencil" size="1.2em" class=""></icon>
                            <span>|</span>
                            <span>Bewerken</span>
                        </button>
                        <button @click="OpenDeletePostModal(false, items.posts._id)"
                            class="text-[#376A7A] hover:bg-slate-100 bg-white border rounded-b-md p-1 px-2 flex items-center gap-2">
                            <icon name="bx:trash" size="1.2em" class=""> </icon>
                            <span>|</span>
                            <span>Verwijderen</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class="flex items-center gap-1">
                <NuxtLink :to="`/user/${items.posts.UserId}`">
                    <h1 class="text-[0.9rem] underline text-[#376A7A] font-semibold opacity-60">{{ items.Author ||
                        "Onbekent"
                        }}</h1>
                </NuxtLink>
                <span class="opacity-60"> | </span>
                <h1 class="text-[0.9rem] opacity-60">{{ useTimeAgo(items?.posts.CreatedAt).value }}</h1>
            </div>
        </div>
        <div class="tiptap select-none" v-html="UseMakeHtml(items.posts)"></div>
        <hr class="mb-2 mt-2" />
        <div class="flex select-none gap-1 items-center justify-between">
            <div class="cursor-default text-[0.9rem] flex gap-1">
                <div class="flex gap-1 items-center group transition-all duration-150">
                    <Icon v-if="items.liked" @click="unlike" name="solar:heart-bold" size="1em"
                        class="group-hover:text-cyan-700 text-cyan-500 group-hover:scale-100 scale-150 group-hover:mr-[0rem] mr-[0.25rem] transition-all duration-150">
                    </Icon>
                    <Icon v-else-if="!items.owned" @click="addLike" name="solar:heart-bold" size="1em"
                        class="group-hover:text-cyan-500 group-hover:scale-150 group-hover:mr-[0.25rem] transition-all duration-150">
                    </Icon>
                    <Icon v-else name="solar:heart-bold" size="1em"
                        class="group-hover:text-cyan-500 group-hover:scale-150 group-hover:mr-[0.25rem] transition-all duration-150">
                    </Icon>
                    <span class="group-hover:font-medium"> {{ useCompact(items?.posts.meta?.Likes || 0) }}</span>
                </div>
                <span class="opacity-60"> | </span>
                <div class="flex gap-1 items-center group transition-all duration-150">
                    <Icon name="solar:eye-bold" size="1em"
                        class="group-hover:scale-150 group-hover:mr-[0.25rem] transition-all duration-150"> </Icon>
                    <span class="group-hover:font-medium">{{ useCompact(items?.posts.meta?.views || 0) }}</span>
                </div>
                <span class="opacity-60"> | </span>
                <div class="flex gap-1 items-center group transition-all duration-150">
                    <Icon name="solar:chat-round-dots-bold" size="1em"
                        class="group-hover:scale-150 group-hover:mr-[0.25rem] transition-all duration-150"> </Icon>
                    <span class="group-hover:font-medium">{{ useCompact(items?.posts.meta?.Comments || 0) }}</span>
                </div>
            </div>
            <button @click="openCreatePostModal" class="text-[#376A7A]">
                <span class="opacity-80"> Beantwoorden </span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">

    defineProps<{
        items: any
        openEditPostModal: (value: boolean) => void,
        OpenDeletePostModal: (value: boolean, id: string) => void,
        UseMakeHtml: (data: any) => string,
        unlike: () => void,
        addLike: () => void,
        openCreatePostModal: () => void,
        
    }>();

</script>