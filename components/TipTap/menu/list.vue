<template>
    <button class="menu-item flex items-center justify-between text-black"
        :class="{ 'is-active': isActive ? isActive() : null }" @click="action" :title="title">
        <div class=" flex items-end justify-center" v-if="isActive">
            <div class=" flex items-end justify-center" v-if="isActive() && activeIcon">
                <Icon :name="activeIcon" size="1.2em" />
            </div>
            <div class=" flex items-end justify-center" v-else>
                <Icon :name="icon" size="1.2em" />
            </div>
        </div>
        <div class=" flex items-end justify-center" v-else>
            <Icon :name="icon" size="1.2em" />
        </div>
    </button>
</template>

<script setup>

const probs = defineProps({
    icon: {
        type: String,
        required: true,
    },

    activeIcon: {
        type: String,
        default: null,
        required: false,
    },

    title: {
        type: String,
        required: true,
    },

    action: {
        type: Function,
        required: true,
    },

    isActive: {
        type: Function,
        default: null,
    },
});

</script>

<style scoped>

    .menu-item {
        @apply border-none transition-all duration-150 rounded-md text-black cursor-pointer h-7 p-1 mr-1 w-7;
    }

    .menu-item.is-active,
    .menu-item:hover {
        @apply bg-[#376A7A] text-white;
    }


</style>
