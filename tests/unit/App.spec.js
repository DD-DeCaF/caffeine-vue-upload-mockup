import { expect } from 'chai';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import App from '@/App.vue';

const localVue = createLocalVue();
localVue.use(Vuetify);
localVue.use(VueRouter);
const router = new VueRouter();

describe('App.vue', () => {
  it('mounts', () => {
    const wrapper = shallowMount(App, { localVue, router });
    expect(wrapper.text()).to.include('Caffeine');
  });
});
