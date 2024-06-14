<template>
	<div class="">
		<div class="fixed top-0 backdrop-blur-lg w-screen h-screen flex flex-col justify-center p-6 items-center">
			<h1 class="text-4xl text-[#103C4A] font-bold mt-12">ForumWave</h1>
			<p class="text-[#103C4A] mt-2">Alle vragen en antwoorden op één plek</p>

			<div class="mt-6 sm:px-28 md:px-30 lg:px-52 xl:px-80 flex flex-col items-center w-3/4 gap-2">
				<button @click="openLoginModal" class="bg-[#103C4A] w-full text-white px-4 py-2 rounded-md font-semibold">Login</button>
				<button @click="openRegisterModal" class="bg-[#103C4A] w-full text-white px-4 py-2 rounded-md font-semibold">Aanmelden</button>
			</div>
		</div>
		<Modal v-model="status">
			<FormLogin v-model="status" v-if="status.type == 'inloggen'"></FormLogin>
			<FormRegister v-model="status" v-else-if="status.type == 'Aanmelden'"></FormRegister>
			<FormReset v-else-if="status.type == 'Reset'"></FormReset>
		</Modal>
	</div>
</template>

<script lang="ts" setup>
	definePageMeta({
		middleware: "redirect",
	});

	useSeoMeta({
		title: "ForumWave - Auth",
		description: "Login of meld je aan bij ForumWave!",
		ogTitle: "ForumWave",
		ogDescription: "Login of meld je aan bij ForumWave!",
        ogImage: "/apple-touch-icon.png",
		ogUrl: "/",
		twitterTitle: "ForumWave",
		twitterDescription: "Login of meld je aan bij ForumWave!",
        twitterImage: "/apple-touch-icon.png",
		twitterCard: "summary",
	});

	const status: any = ref({});

	const openLoginModal = () => {
		status.value = {
			status: true,
			type: "inloggen",
		};
	};

	const openRegisterModal = () => {
		status.value = {
			status: true,
			type: "Aanmelden",
		};
	};
</script>
