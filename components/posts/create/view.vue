<template>
    <div>
        <TipTapModal v-model="status">
            <p class="mb-3">Hier kan je een nieuwe post aanmaken</p>
            <hr class="hidden md:block my-2" />
            <TipTapEditor v-model="status" :loading :content :submit />
            <div v-if="status?.error" class="flex justify-start gap-2 mt-2">
                <p class="text-red-600 text-sm">
                    {{ status.error }}
                </p>
            </div>
        </TipTapModal>
    </div>
</template>

<script setup>
    const status = defineModel()
    const loading = ref(false)
    const content = ref("");

    const submit = async (callback) => {
        loading.value = true;
        const result = callback();

        status.value.error = undefined;
        const { data, error} = await useUploadFilesInChunks("/api/posts", {
            method: "POST",
            body: result
        });

        loading.value = false;
        if (!error.value) {
            setTimeout(() => {
                status.value = false;
                setTimeout(() => {
                    navigateTo(`/posts/${data.value.data.PostId}`);
                }, 200);
            }, 200);
        } else {
            status.value = {
                status: true,
                type: "Post",
                error: error.value.data.message,
            };
        }
    };

    
</script>

