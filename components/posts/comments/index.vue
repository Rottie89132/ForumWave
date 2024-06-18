<template>
    <div v-for="comment in comments" :key="comment.id" class="bg-[#eaf0f2] p-3 md:p-5 rounded-md border mt-2">
        <PostsCommentsView 
            :comment
            :openEditPostModal
            :OpenDeletePostModal
            :UseMakeHtml
            :upVoteComment
            :downVoteComment
        />
    </div>
</template>

<script setup lang="ts">
	defineProps<{
		comments: any;
		openEditPostModal: (Boolean: boolean, html?: string, id?: string) => void;
		OpenDeletePostModal: (value: boolean, id: string) => void;
		UseMakeHtml: (data: any) => string;
		upVoteComment: (id: string) => void;
		downVoteComment: (id: string) => void;
	}>();

</script>
