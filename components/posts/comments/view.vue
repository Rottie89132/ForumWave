<template>

    <div class="flex items-center justify-between gap-1">
        <div :class="comment?.meta?.Likes < 0 ? ' cursor-pointer' : ' '"
            @click="comment?.meta?.Likes >= 0 ? '' : (hide = !hide)" class="flex items-center gap-1">
            <NuxtLink :to="`/user/${comment.UserId}`">
                <h1 class="text-[0.9rem] underline text-[#376A7A] font-semibold opacity-80">{{ comment.author ||
                    "Onbekent" }}</h1>
            </NuxtLink>
            <span class="opacity-60"> | </span>
            <h1 class="text-[0.9rem] opacity-60">{{ useTimeAgo(comment?.CreatedAt).value }}</h1>
        </div>
        <div class="flex items-center gap-1">
            <div class="group" v-if="comment.owned">
                <div class="">
                    <icon name="solar:menu-dots-bold" size="2em" class="text-[#376A7A] p-1 rounded-md"></icon>
                    <div class="group-hover:block hidden absolute -ml-12 transition-all duration-200">
                        <div class="flex text-sm shadow-md flex-col justify-start items-start rounded-md">
                            <button @click="openEditPostModal(true, UseMakeHtml(comment), comment._id)"
                                class="text-[#376A7A] w-full hover:bg-slate-100 bg-white border rounded-t-md p-1 px-2 flex items-center gap-2">
                                <icon name="bx:bxs-pencil" size="1.2em" class=""></icon>
                                <span>|</span>
                                <span>Bewerken</span>
                            </button>
                            <button @click="OpenDeletePostModal(true, comment._id)"
                                class="text-[#376A7A] hover:bg-slate-100 bg-white border rounded-b-md p-1 px-2 flex items-center gap-2">
                                <icon name="bx:trash" size="1.2em" class=""> </icon>
                                <span>|</span>
                                <span>Verwijderen</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex text-[#376A7A] rounded-lg text-[0.85rem] gap-1 items-center transition-all duration-150">
                <Icon @click="upVoteComment(comment._id)" name="bx:bxs-upvote" size="1em"
                    :class="comment?.liked ? 'text-green-500 scale-125' : ''"
                    class="hover:text-green-500 hover:scale-125 transition-all duration-150"></Icon>
                <span class=""> {{ useCompact(comment?.meta?.Likes || 0) }}</span>
                <Icon @click="downVoteComment(comment._id)" name="bx:bxs-downvote" size="1em"
                    :class="comment?.disliked ? 'text-red-500 scale-125' : ''"
                    class="hover:text-red-500 hover:scale-125 transition-all duration-150"></Icon>
            </div>
        </div>
    </div>
    <div v-if="comment?.meta?.Likes >= 0" class="tiptap select-none" v-html="UseMakeHtml(comment)"></div>
    <div v-else-if="!hide" class="tiptap select-none" v-html="UseMakeHtml(comment)"></div>
</template>

<script setup lang="ts">
    const hide = ref(true);
    
    defineProps<{
        comment: any;
        openEditPostModal: (Boolean: boolean, html?: string, id?: string) => void;
        OpenDeletePostModal: (value: boolean, id: string) => void;
        UseMakeHtml: (data: any) => string;
        upVoteComment: (id: string) => void;
        downVoteComment: (id: string) => void;
    }>();
</script>
