import * as maplibregl from 'maplibre-gl';
import { ref, Ref, watch } from 'vue';

export class LayerProxy {
    private declare vm: Ref<maplibregl.AddLayerObject>;

    /**  
     *
     */
    private constructor() {
        //super();
    }

    static create(map: maplibregl.Map, layer: maplibregl.AddLayerObject) {
        const proxy = new LayerProxy();
        proxy.vm = ref(layer) as any;

        watch(() => (proxy.vm.value as any)['paint'], a => {
            // console.warn(proxy.vm.value,a); 

            for (const v in a) { 
                 map.setPaintProperty(proxy.vm.value.id, v, a[v]);
            }
           
            
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