<template>
  <div class="cookie-comply__modal">
    <div class="cookie-comply__modal-middle">
      <div class="cookie-comply__modal-inner">
        <img
          alt="Back arrow"
          src="../assets/modal_close.svg"
          class="cookie-comply__close-icon"
          @click="onCloseModal"
        />

        <header class="cookie-comply__modal-header">
          <slot name="modal-header">
            <h3>Your privacy preferences</h3>
          </slot>
        </header>

        <main class="cookie-comply__modal-content">
          <template
            v-for="(preference, index) in preferences"
            :key="index"
          >
            <slot
              name="modal-body"
              :preference="preference"
              :index="index"
            >
              <h2>{{ preference.title }}</h2>
              <div
                v-for="item in preference.items"
                :key="item.value"
                class="cookie-comply__modal-switches"
              >
                <p
                  class="cookie-comply__item-description"
                  v-html="item.description"
                />
                <h3 class="cookie-comply__item-headline">{{ item.label }}</h3>
                <cookie-comply-switch
                  :value="item.value"
                  :is-required="item.isRequired"
                  :is-default-enable="item.isEnable"
                  :is-checked="getIsChecked(item.value)"
                  @update:checkbox="handleCheckboxUpdate"
                />
              </div>
            </slot>
          </template>
        </main>

        <footer class="cookie-comply__modal-footer">
          <slot name="modal-footer">
            <cookie-comply-button @handle-click="onSaveConfiguration">
              Save Settings
            </cookie-comply-button>
            <cookie-comply-button
              v-if="showAcceptAllInModal"
              class-name="cookie-comply__button-accept"
              @handle-click="acceptAll"
            >
              Accept All
            </cookie-comply-button>
          </slot>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CookieComplyButton from './CookieComplyButton.vue';
import CookieComplySwitch from './CookieComplySwitch.vue';
import { getConsentValuesFromStorage } from "../shared/storageUtils";
import { ref } from "vue";

interface Props {
  preferences: Array<unknown>,
  showAcceptAllInModal?: boolean
}

interface Emits {
  (e: 'cookie-comply-save', payload: Array<string>): void
  (e: 'cookie-comply-close'): void
  (e: 'cookie-comply-accept-all'): void
}

const props = withDefaults(defineProps<Props>(), {
  showAcceptAllInModal: false
})

const emit = defineEmits<Emits>()

const checkedValues = ref<Array<string>>([])

const handleCheckboxUpdate = ({ value, isEnable }): void => {
  isEnable
    ? checkedValues.value.push(value)
    : checkedValues.value.splice(checkedValues.value.indexOf(value), 1);
}
const onSaveConfiguration = (): void => {
  emit('cookie-comply-save', checkedValues.value);
}
const acceptAll = (): void => {
  emit('cookie-comply-accept-all')
}
const onCloseModal = (): void => {
  emit('cookie-comply-close');
}
const getIsChecked = (value: string): boolean => {
  const values = getConsentValuesFromStorage();

  if (!values.length) {
    return false;
  }

  if (values.includes('all')) {
    return true;
  }

  return !!values.includes(value);
}
</script>

<style>
.cookie-comply__modal {
  display: table;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: var(--background-overlay);
}

.cookie-comply__modal-middle {
  display: table-cell;
  vertical-align: middle;
}

.cookie-comply__modal-inner {
  position: relative;
  margin-left: auto;
  margin-right: auto;
  width: 400px;
  padding: var(--spacing-lg);
  background-color: var(--color-white);
  border-radius: var(--spacing-sm);
  box-shadow: var(--box-shadow);
}

.cookie-comply__close-icon {
  position: absolute;
  right: var(--spacing-lg);
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.cookie-comply__modal-content {
  overflow-y: scroll;
  max-height: 400px;
  text-align: left;
}

.cookie-comply__modal-switches {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  border-bottom: var(--border-color-lightest);
}

@media (max-width: 480px) {
  .cookie-comply__modal-middle {
    padding: var(--spacing-md);
  }

  .cookie-comply__modal-inner {
    width: auto;
  }
}

.cookie-comply__modal-header {
  border-bottom: var(--border-color-light);
}

.cookie-comply__modal-footer {
  border-top: var(--border-color-light);
  padding-top: var(--spacing-lg);
  display: flex;
  justify-content: space-between;
}
</style>
