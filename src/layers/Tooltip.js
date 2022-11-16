import { whenever } from '@vueuse/core';
import { inject, reactive, toRefs, watch } from 'vue';
import { renderless } from '../utils/utils.js';

export default renderless({
  props: {
    position: {
      type: [Array, Object],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    direction: {
      type: String,
      default: 'auto',
    },
    offset: {
      type: Object,
      default: undefined,
    },
    permanent: {
      type: Boolean,
      default: false,
    },
    sticky: {
      type: Boolean,
      default: false,
    },
    opacity: {
      type: Number,
      default: 0.9,
    },
  },
  setup(props) {
    const {position, text} = toRefs(props);
    const options = reactive({
      direction: props.direction,
      offset: props.offset ?? new L.Point(0, 0),
      permanent: props.permanent,
      sticky: props.sticky,
      opacity: props.opacity,
    });
    const map = inject('map');
    const mount = (map) => {
      const tooltip = new L.Tooltip();
      tooltip.setLatLng(props.position).addTo(map);
      watch(position, position => tooltip.setLatLng(position));
      watch(text, text => tooltip.setContent(text), {immediate: true});
      watch(options, options => L.setOptions(tooltip, options), {immediate: true});
    }
    whenever(map, mount, {immediate: true});
  },
});
