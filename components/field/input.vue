<template>
	<Field :name="name" v-slot="{ field, meta }">
		<label class="text-base font-bold text-neutral-900" :for="type">{{ label }}</label>
		<input :placeholder="value" :class="meta.touched && !meta.valid ? ' btn-Input mt-2 mb-5 text-[#B92538] outline-none appearance-none border-2 border-[#B92538] ' : ' btn-Input mt-2 mb-5'" :ref="type" :type="type" v-bind="field" :aria-label="type" :autocomplete="label == 'email' || label == 'wachtwoord' ? `current-${probs.type}` : `new-${probs.type}`" />
		<ErrorMessage class="mb-1 -mt-3 text-xs text-[#B92538] block" :name="name"></ErrorMessage>
	</Field>
</template>

<script setup lang="ts">
	import { Field, ErrorMessage } from 'vee-validate';





	const probs = defineProps({
		type: { type: String, default: "text" },
		label: { type: String, default: "Input" },
		name: { type: String, default: "Input" },
		value: { type: String, default: "" },
	});
</script>
