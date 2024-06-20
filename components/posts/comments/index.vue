<template>
	<div v-for="comment in comments" :key="comment.id" :id="comment._id"
		:class="highlight == comment._id ? ' border-2 border-[#376A7A]' : ''"
		class="bg-[#eaf0f2] p-3 md:p-5 rounded-md border mt-2">
		<PostsCommentsView :comment :openEditPostModal :OpenDeletePostModal :UseMakeHtml :upVoteComment
			:downVoteComment />
	</div>
</template>

<script setup lang="ts">
    const highlight = ref(useRoute().query.comment);

	setTimeout(() => {
		location.replace(`#${highlight.value}`);
	}, 500);

	defineProps<{
		comments: any;
		openEditPostModal: (Boolean: boolean, html?: string, id?: string) => void;
		OpenDeletePostModal: (value: boolean, id: string) => void;
		UseMakeHtml: (data: any) => string;
		upVoteComment: (id: string) => void;
		downVoteComment: (id: string) => void;
	}>();

</script>
