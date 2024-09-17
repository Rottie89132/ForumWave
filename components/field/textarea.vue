<template>
	<Field :name="name" v-slot="{ field, meta }">
		<label class="text-base font-bold text-neutral-900" :for="type">{{ label }}</label>
		<textarea :class="meta.touched && !meta.valid ? ' btn-Input mt-2 mb-5 text-[#B92538] ring-2 ring-[#B92538] outline-none appearance-none border-none' : ' btn-Input mt-2 mb-5'" :ref="type" :type="type" v-bind="field" :aria-label="type" :autocomplete="`current-${probs.type}`" />
		<ErrorMessage class="mb-1 -mt-4 text-xs text-[#B92538] block" :name="name" />
	</Field>
</template>

<script setup lang="ts">
	import { Field, ErrorMessage } from 'vee-validate';


	const probs = defineProps({
		type: { type: String, default: "text" },
		label: { type: String, default: "Input" },
		name: { type: String, default: "Input" },
	});
</script>
