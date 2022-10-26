import L, { LatLng, Tooltip } from 'leaflet';
import { Point } from 'leaflet/src/geometry/index.js';
import { inject, reactive, toRefs, watch } from 'vue';
import { renderless } from '../utils/utils.js';

export default renderless({
  props: {
    position: {
      type: LatLng,
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
      type: Point,
      default: () => new Point(0, 0),
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
      offset: props.offset,
      permanent: props.permanent,
      sticky: props.sticky,
      opacity: props.opacity,
    });
    const map = inject('map');
    const tooltip = new Tooltip();
    tooltip.setLatLng(props.position).addTo(map);
    watch(position, position => tooltip.setLatLng(position));
    watch(text, text => tooltip.setContent(text), {immediate: true});
    watch(options, options => L.setOptions(tooltip, options), {immediate: true});
  },
});
