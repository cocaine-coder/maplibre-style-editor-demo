import * as maplibregl from 'maplibre-gl';
import { ref, Ref, toRaw, watch } from 'vue';

export class LayerProxy {
    private declare vm: Ref<maplibregl.AddLayerObject>;

    /**  
     *
     */
    private constructor() {
        //super();
    }

    static create(map: maplibregl.Map, layer: maplibregl.AddLayerObject, beforeLayerId?: string) {
        let ff: maplibregl.StyleSpecification
        const proxy = new LayerProxy();
        proxy.vm = ref(layer) as any;
        map.addLayer(layer, beforeLayerId);

        watch(() => (proxy.vm.value as any)['paint'], a => {
            console.warn(a);
        }, { deep: true });

        return proxy;
    }

    get value() {
        return this.vm.value;
    }

    toJSON() {
        return this.vm.value
    }
}