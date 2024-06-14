<template>
    <div>
        <Form @submit="handleSubmit" :validation-schema="schema" v-slot="{ meta }">
            <p class="mb-6">Vul hieronder je gebruikersnaam en wachtwoord in om toegang te krijgen tot je account.</p>
            <FieldInput :name="'email'" :type="'email'" :label="'email'" />
            <FieldInput :name="'wachtwoord'" :type="'password'" :label="'wachtwoord'" />
            <div @click="handleReset"
                class="text-sm select-none cursor-pointer text-neutral-800 hover:text-neutral-900">Wachtwoord vergeten?
            </div>
            <button class="bg-[#103C4A] text-[#ffffff] px-4 py-2 w-full rounded-xl font-semibold mt-4">
                <span v-if="loading">
                    <icon class=" animate-spin" name="solar:refresh-circle-bold" size="1.5em"></icon>
                </span>
                <span v-else>Inlogen</span>

            </button>
        </Form>
    </div>
</template>

<script setup>
    import { toTypedSchema } from '@vee-validate/zod';
    import * as zod from 'zod';

    const loading = ref(false)
    const modalStatus = defineModel()
    const schema = toTypedSchema(
        zod.object({
            email: zod.string({ message: "Dit is een verplicht veld" }).email({ message: 'Moet een correcte email zijn' }),
            wachtwoord: zod.string({ message: "Dit is een verplicht veld" }).min(8, { message: 'Moet langer dan 8 zijn' }),
        })
    );

    const handleReset = async () => {
        modalStatus.value = {
            status: false,
            type: "Reset",
            reload: true
        }
    };

	const handleSubmit = async (values, actions) => {
        loading.value = true
        const { data, error, pending } = await useFetch("/api/auth", {
            method: "POST",
            body: values
        })

        loading.value = pending.value

        if (error.value) {
            actions.setErrors(error.value.data.data)
        } else {
            actions.resetForm()
            modalStatus.value = false
            setTimeout(() => {
                navigateTo("/")
            }, 500);
        }
	};

	
</script>
