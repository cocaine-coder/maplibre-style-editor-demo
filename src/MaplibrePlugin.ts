import maplibregl from 'maplibre-gl';
import { LayerProxy } from '../style';


type TDictionary<TK,TV> = Map<TK,TV>;

declare module 'maplibre-gl' {
    export interface Map{
        layerProxies: TDictionary<string, LayerProxy>;
    }
}
maplibregl.Map.prototype.layerProxies = new Map<string, LayerProxy>();

const _addLayer = maplibregl.Map.prototype.addLayer;

maplibregl.Map.prototype.addLayer = function (layer: maplibregl.AddLayerObject, beforeLayerId?: string) {
    this.layerProxies.set(layer.id,  LayerProxy.create(this, layer));
    return _addLayer.call(this, layer, beforeLayerId);
};