import { toRaw } from 'vue';

function setBouncingState(marker, value) {
  if (value) {
    marker.bounce();
  } else {
    marker.stopBouncing();
  }
}

export default {
  async mounted(el, binding, vnode) {
    const marker = toRaw(vnode.props['data-marker']);
    if (!(marker instanceof L.Marker)) {
      throw Error('This directive can only be used on markers.');
    }

    // v-bounce:options="{}"
    if ('options' === binding.arg) {
      marker.setBouncingOptions(binding.value);
      return;
    }

    // v-bounce="true|false"
    setBouncingState(marker, binding.value);
  },
  async updated(el, binding, vnode) {
    const marker = toRaw(vnode.props['data-marker']);

    // v-bounce:options="{}"
    if ('options' === binding.arg) {
      marker.setBouncingOptions(binding.value);
      return;
    }

    // v-bounce="true|false"
    setBouncingState(marker, binding.value);
  },
};
