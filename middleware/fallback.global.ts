export default defineNuxtRouteMiddleware((event) => {

    if (document) {
        setTimeout(() => {
            const image: any = document.querySelector('.TipTapImage');
            const video: any = document.querySelector('.TipTapVideo');

            

            if (image) {
                const tester = new Image();
                tester.src = image.src;

                tester.onerror = () => {
                    image.src = '/placeholderl.jpg';
                    console.error('Afbeelding kon niet geladen worden, placeholder ingesteld.');
                };
            }

            if (video) {
                if (video) {
                    if (video.readyState < 4) {
                        const img = document.createElement('img');
                        img.className = 'TipTapImage TipTapMedia';
                        img.src = '/placeholderl.jpg';
                        img.alt = 'placeholderl.jpeg';
                        img.title = 'placeholderl.jpeg';
                        video.parentNode.replaceChild(img, video);
                    }
                }
            }

        }, 500)
    }
});