<template>
	<div class="">
		<div class="fixed top-0 w-screen h-screen flex flex-col justify-center p-6 items-center">
			<div :class="Installed ? 'mt-8' : ''" class="bg-slate-50 w-full h-full rounded-xl flex flex-col justify-center items-center">
				<h1 class="text-4xl text-[#103C4A] font-bold mt-12">ForumWave</h1>
				<p class="text-[#103C4A] mt-2">Alle vragen en antwoorden op één plek</p>

				<div class="mt-6 sm:px-28 md:px-30 lg:px-52 xl:px-80 flex flex-col items-center w-3/4 gap-2">
					<button @click="openLoginModal" class="bg-[#103C4A] hover:bg-[#18343c] transition-all duration-200 w-full text-white px-4 py-2 rounded-md font-semibold">Inloggen</button>
					<button @click="openGuestModal" class="border-[#103C4A] hover:border-[#18343c] transition-all duration-200 hover:text-[#18343c] hover:bg-slate-100 w-full border text-[#103C4A] px-4 py-2 rounded-md font-semibold">Bezoeker</button>
					<button @click="openRegisterModal" class="border-[#103C4A] hover:border-[#18343c] transition-all duration-200 hover:text-[#18343c] hover:bg-slate-100 w-full border text-[#103C4A] px-4 py-2 rounded-md font-semibold">Aanmelden</button>
					<hr class="w-full mt-2" />
				</div>
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

	const { $pwa }: any = useNuxtApp();
	const status: any = ref({});
	const Installed = ref(false);

	const openLoginModal = () => {
		status.value = {
			status: true,
			type: "inloggen",
		};
	};

	const openGuestModal = async () => {

		const { data, error } = await useFetch("/api/auth", {
			method: "POST",
			body: {
				email: "Guest@example.mail",
				wachtwoord: "wachtwoord",
			}
		})

		if (!error.value) navigateTo("/")
	
	};

	const openRegisterModal = () => {
		status.value = {
			status: true,
			type: "Aanmelden",
		};
	};

	onMounted(() => {
		if ($pwa.isPWAInstalled) Installed.value = true;
	});
</script>
