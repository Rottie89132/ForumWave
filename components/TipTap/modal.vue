<template>
  <div>
    <ClientOnly>
      <Transition name="modal">
        <div v-if="status"
          class="fixed top-0 z-10 flex items-end justify-center w-screen h-full bg-black md:justify-center md:items-center bg-opacity-60 backdrop-blur-sm">
          <div tabindex="0" class="mx-6 mb-[12%] md:mb-0 outline-none rounded-xl" ref="modal">
            <Transition name="modalDelay">
              <div ref="modalDelay" v-if="DelayStatus">
                <div class="p-5 bg-white rounded-2xl w-[90vw] sm:w-[75vw] md:w-[80vw] lg:w-[70vw] xl:w-[50vw]">
                  <div class="flex items-center mb-2 justify-between">
                    <h1 class="text-3xl font-bold">{{ modalStatus.type }}</h1>
                    <button @click="closeModal">
                      <Icon name="pajamas:close-xs" size="2em"></Icon>
                    </button>
                  </div>
                  <slot></slot>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </ClientOnly>
  </div>
</template>


<script lang="ts" setup>

  const modalStatus: any = defineModel({})
  const status = ref<boolean>(false)
  const DelayStatus = ref<boolean>(false)
  const modal = ref(null);

  watch(modalStatus, (value: any) => {
    
    if(value.status) {
      status.value = value
      setTimeout(() => {
        DelayStatus.value = value
      }, 300);
    }

    else if (value.reload) {
      DelayStatus.value = false
      setTimeout(() => {
        DelayStatus.value = true
      }, 500);
    }

    else {
      DelayStatus.value = value
      setTimeout(() => {
        status.value = value
      }, 100);
    }

  })

  onClickOutside(modal, () => {
    modalStatus.value = false
  });

  const closeModal = () => {
    modalStatus.value = false
  };

</script>

<style scoped>

  .modal-enter-active,
  .modal-leave-active {
    transition: all 0.8s ease;
  }

  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }

  .modalDelay-enter-active,
  .modalDelay-leave-active {
    transition: all 1s ease;
  }

  .modalDelay-enter-from,
  .modalDelay-leave-to {
    opacity: 0;
    transform: translateY(12em);
  }
</style>
