<template>
	<div>
		<Form @submit="handleSubmit" :validation-schema="schema" v-slot="{ meta }">
			<p class="mb-6">Vul je email adres in om een link te ontvangen om je wachtwoord te resetten</p>
			<FieldInput :name="'email'" :type="'email'" :label="'Email adress'" />
			<FieldInput :name="'wachtwoord'" :type="'password'" :label="'Nieuwe wachtwoord'" />
			<FieldInput :name="'confirmatie'" :type="'password'" :label="'Confirmatie'" />
			<button class="bg-[#376A7A] text-[#ffffff] px-4 py-2 w-full rounded-xl font-semibold mt-4">Reset</button>
		</Form>
	</div>
</template>

<script setup>
	import { toTypedSchema } from '@vee-validate/zod';
	import * as zod from 'zod';

	const schema = toTypedSchema(
		zod.object({
			email: zod.string({ message: "Dit is een verplicht veld" }).email({ message: 'Moet een correcte email zijn' }),
			wachtwoord: zod.string({ message: "Dit is een verplicht veld" }).min(8, { message: 'Moet langer dan 8 zijn' }),
			confirmatie: zod.string({ message: "Dit is een verplicht veld" })
		})
			.refine((data) => data.wachtwoord === data.confirmatie, {
				message: "Wachtwoorden komen niet overheen",
				path: ["confirmatie"],
			})
	);

	const handleSubmit = async (values, actions) => {
		console.log(values);
	}
</script>
