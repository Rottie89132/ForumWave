export default defineNuxtRouteMiddleware( async(to, from) => {
    const {data}: any = await useFetch("/api/users/me")
    if (data.value.statusCode !== 200) {
        return navigateTo("/screen")
    }
})
