<template>
    <div>
        <Form @submit="handleSubmit" :validation-schema="schema" v-slot="{ meta }">
            <p class=" mb-6">Vul hieronder je gegevens in om een account aan te maken.</p>


            <FieldInput :name="'username'" :type="'text'" :label="'Gebruikersnaam'" />
            <FieldInput :name="'email'" :type="'email'" :label="'Email adress'" />
            <FieldInput :name="'wachtwoord'" :type="'password'" :label="'Wachtwoord'" />
            <FieldInput :name="'confirmatie'" :type="'password'" :label="'Confirmatie'" />
            <button
                class="bg-[#103C4A] transition-all duration-200 hover:bg-[#18343c] text-[#ffffff] px-4 py-2 w-full rounded-xl font-semibold mt-4">
                <span v-if="loading">
                    <icon class=" rotate-180 animate-spin" name="solar:refresh-broken" size="1.5em"></icon>
                </span>
                <span v-else>Aanmelden</span>

            </button>
            <p class="text-gray-600 mt-2">{{ succesMessage }}</p>

        </Form>
    </div>
</template>

<script setup>

    import { toTypedSchema } from '@vee-validate/zod';
    import * as zod from 'zod';

    const loading = ref(false)
    const succesMessage = ref("")
    const modalStatus = defineModel()
    const schema = toTypedSchema(
        zod.object({
            username: zod.string({ message: "Dit is een verplicht veld" }).min(5, { message: 'Moet langer dan 5 zijn' }),
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
        loading.value = true
        const { data, error, pending } = await useFetch("/api/auth/register", {
            method: "POST",
            body: values
        })

        loading.value = pending.value

        if (error.value) {
            actions.setErrors(error.value.data.data)
        } else {
            actions.resetForm()
            succesMessage.value = data.value.message
            setTimeout(() => {
                
                modalStatus.value = {
                    status: false,
                    type: "inloggen",
                    reload: true
                }
            }, 2000);
        }
    }


</script>