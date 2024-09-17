<template>
	<Field :name="name" v-slot="{ handleChange, handleBlur, meta }">
		<div class="flex items-center justify-center w-full">
			<label for="dropzone-file" :class="meta.touched && !meta.valid ? ' text-[#B92538] border-[#B92538]' : meta.valid ? ' border-green-700 text-green-700' : ' border-gray-300 text-gray-400'" class="flex flex-col items-center justify-center w-full h-fit border-2 border-dashed rounded-lg cursor-pointer bg-gray-50">
				<div class="flex flex-col items-center justify-center pt-5 pb-6">
					<svg class="w-8 h-8 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
					</svg>
					<p class="mb-2 text-sm"><span class="font-semibold">Click to upload</span> or drag and drop</p>
					<p class="text-xs">png (MAX. 5MB)</p>
				</div>
				<input id="dropzone-file" :placeholder="value" class="hidden" :ref="type" :type="type" @change="handleChange" @blur="handleBlur" :aria-label="type" :autocomplete="label == 'email' || label == 'Gebuikersnaam' ? `current-${probs.type}` : `new-${probs.type}`" />
			</label>
		</div>
		<ErrorMessage class="mt-3 mb-4 text-xs text-[#B92538] block" :name="name" />
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
