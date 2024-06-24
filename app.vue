<template>
  <div>
    <div v-show="isLoading">
      <div class="fixed z-50 bg-white top-0 w-screen h-screen flex flex-col justify-center p-6 items-center">
        <div :class="Installed ? 'mt-8' : ''"
          class="bg-slate-50 w-full h-screen rounded-xl flex flex-col justify-center items-center">
          <div class='flex space-x-2 justify-center items-center h-screen '>
            <span class='sr-only'>Loading...</span>
            <div class='h-8 w-8 bg-[#103C4A] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
            <div class='h-8 w-8 bg-[#103C4A] rounded-full animate-bounce [animation-delay:-0.15s]'></div>
            <div class='h-8 w-8 bg-[#103C4A] rounded-full animate-bounce'></div>
          </div>
        </div>
      </div>
    </div>
    <NuxtPwaManifest />
    <NuxtPage />
  </div>
</template>

<script setup>
  const nuxtApp = useNuxtApp();
  const { $pwa } = useNuxtApp();
  const Installed = ref(false);

  const { progress, isLoading, start, finish, clear } = useLoadingIndicator({
    duration: 2000,
    throttle: 200,
    estimatedProgress: (duration, elapsed) => (2 / Math.PI) * 100 * Math.atan(((elapsed / duration) * 100) / 50),
  });

  onMounted(() => {
    if ($pwa.isPWAInstalled) {
      Installed.value = true;
    }
  });

  addRouteMiddleware("global-loader",(to, from) => start(),{ global: true });
  nuxtApp.hook("page:finish", () => finish());
</script>

