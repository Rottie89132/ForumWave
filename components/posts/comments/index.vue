<template>
	<div v-for="comment in comments" :key="comment.id" :id="comment._id"
		:class="highlight == comment._id ? ' border-2 border-[#376A7A]' : ''"
		class="bg-[#eaf0f2] p-3 md:p-5 rounded-md border mt-2">
		<PostsCommentsView 
			:loading 
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
	const highlight: any = ref(useRoute().query.comment);

	onMounted(() => {
		if (highlight.value) {
			setTimeout(() => {
				const element: any = window.document.getElementById(highlight.value);
				element.scrollIntoView({ block: "center", behavior: "smooth" });
			}, 500);
		}
	});

	defineProps<{
		comments: any;
		loading: boolean;
		openEditPostModal: (Boolean: boolean, html?: string, id?: string) => void;
		OpenDeletePostModal: (value: boolean, id: string) => void;
		UseMakeHtml: (data: any) => string;
		upVoteComment: (id: string) => void;
		downVoteComment: (id: string) => void;
	}>();

</script>
