<template>
	<div>
		<div class="sm:px-28 md:px-30 lg:px-52 xl:px-80 px-5 py-3 fixed w-full h-full overflow-scroll">
			<div class="bg-white sticky z-50 -top-4 py-3">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-4 pr-5">
						<NuxtLink to="/" class="text-lg font-bold">Home</NuxtLink>
					</div>
					<div class="flex items-center gap-2">
						<button @click="logout" class="border-[#376A7A] border text-[#376A7A] p-[0.45rem] px-4 w-fit rounded-xl flex items-center justify-center">Uitloggen</button>
						<PostsCreateButton />
						<button @click="$router.back()" class="bg-[#376A7A] border-[#376A7A] border text-[#ffffff] p-2 w-fit rounded-xl flex items-center justify-center">
							<icon name="bx:arrow-back" size="1.4em" class=""></icon>
						</button>
					</div>
				</div>
				<hr class="w-full mt-2 -mb-1" />
			</div>

			<div class="mt-2 z-20">
				<div class="">
					<div class="bg-gray-50 p-3 md:p-5 rounded-md border">
						<h1 class="font-semibold">
							Hallo
							<span class="text-[#376A7A] text-lg font-bold">
								{{ user.Name || "Onbekent" }}
							</span>
						</h1>
						<p class="opacity-50">
							<span class="font-medium">
								{{ user.Email || "Er is geen email bekend" }}
							</span>
						</p>
						<hr class="my-2" />
						<p class="text-sm opacity-30">
							{{ user.Id }}
						</p>
					</div>
				</div>
				<div class="mt-3">
					<div class="bg-gray-50 p-3 md:p-5 rounded-md border">
						<div class="flex items-center justify-between">
							<h1 class="font-semibold -mb-2">Posts</h1>
							<div class="flex items-center gap-2">
								<span class="border-[#376A7A] text-xs border text-[#376A7A] rounded-md p-1 px-3 font-semibold">
									{{ posts }}
								</span>
								<NuxtLink :to="`/user/${user.Id}`" class="bg-[#376A7A] border-[#376A7A] border text-xs text-white rounded-md p-1 px-3 font-semibold"> Bekijken </NuxtLink>
							</div>
						</div>
						<p class="mt-2 opacity-70 leading-5">Overzicht van alle post die jij hebt geplaats op het forum van ForumWave</p>
					</div>
				</div>
				<div class="mt-3">
					<div class="bg-gray-50 p-3 md:p-5 rounded-md border">
						<div class="flex items-center justify-between">
							<h1 class="font-semibold -mb-2">Comments</h1>
							<div class="flex items-center gap-2">
								<span class="border-[#376A7A] text-xs border text-[#376A7A] rounded-md p-1 px-3 font-semibold">
									{{ comments }}
								</span>
								<NuxtLink :to="`/user/${user.Id}?tab=Comments`" class="bg-[#376A7A] border-[#376A7A] border text-xs text-white rounded-md p-1 px-3 font-semibold"> Bekijken </NuxtLink>
							</div>
						</div>
						<p class="mt-2 opacity-70 leading-5">Overzicht van alle comments die jij hebt geplaats, op posts van andere gebruikers</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	definePageMeta({
		middleware: "auth",
	});

	useSeoMeta({
		title: "ForumWave - Account",
		description: "Account informatie van de gebruiker",
		ogTitle: "ForumWave",
		ogDescription: "Account informatie van de gebruiker",
		ogImage: "/apple-touch-icon.png",
		ogUrl: "/",
		twitterTitle: "ForumWave",
		twitterDescription: "Account informatie van de gebruiker",
		twitterImage: "/apple-touch-icon.png",
		twitterCard: "summary",
	});

	const user = ref();
	const posts = ref([]);
	const comments = ref([]);

	const status = ref({
		status: false,
		type: "",
		error: undefined,
	});

	const { data: User } = await useFetch("/api/users/me");
	user.value = User.value.user;
	posts.value = User.value.posts;
	comments.value = User.value.comments;

	const logout = async () => {
		const { data, error } = await useFetch("/api/users/logout", {
			method: "delete",
		});
		if (!error.value) {
			navigateTo("/screen");
		}
	};
</script>
