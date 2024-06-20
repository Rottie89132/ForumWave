<template>
    <div>
        <button @click="openCreatePostModal"
            class="border-[#376A7A] bg-[#376A7A] border text-white font-medium p-2 w-fit rounded-xl flex items-center justify-center">
            <icon name="bx:plus-circle" size="1.4em" class=""></icon>
        </button>
    </div>
</template>

<script setup>

    const status = defineModel()
    
    const openCreatePostModal = () => {
        status.value = {
            status: true,
            type: "Post",
        };
    };

</script>