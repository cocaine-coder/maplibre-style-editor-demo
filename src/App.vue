<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as maplibre from 'maplibre-gl';
import Interpolate from './components/Interpolate.vue';
import Match from './components/Match.vue';

let map: maplibre.Map;
const loaded = ref(false);

onMounted(() => {
    map = new maplibre.Map({
        container: "map",
        center: [100, 35],
        zoom: 3,
        style: {
            version: 8,
            sources: {
                "raster-base-map": {
                    type: 'raster',
                    tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"]
                }
            },
            layers: [{
                id: 'raster-base-map',
                type: 'raster',
                source: "raster-base-map",
            }]
        },
        attributionControl: false
    });

    map.on('load', () => {
        map.addLayer({
            id: 'line1100',
            type: 'line',
            source: {
                'type': 'geojson',
                data: {
                    type: 'LineString',
                    coordinates: [
                        [-100, 40],
                        [-50, 40],
                        [-50, 50],
                        [-100, 50]
                    ]
                }
            },
            paint: {
                "line-width": 1
            }
        });

        map.addLayer({
            id: "china-fill",
            type : 'fill',
            source : {
                type : 'geojson',
                data : "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json"
            },
            paint:{
                "fill-opacity" : 0.5
            },
        });

        map.addLayer({
            id: "china-line",
            type : 'line',
            source : {
                type : 'geojson',
                data : "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json"
            },
            paint:{
            },
        });

        // map.addControl(new MeasureControl() as any)

        loaded.value = true;
    })
});
</script>

<template>
    <div id="controls" v-if="loaded">
        <Interpolate :map="map" :layer="'china-line'" :value="{
            'line-color': ['interpolate', ['linear'], ['zoom'], 4, '#00ffff', 10, '#ff0000'],
            'line-width': ['interpolate', ['linear'], ['zoom'], 4, 1, 10, 10]
        }" :default-value="{
            'line-color': '#00ffff',
            'line-width': 1,
        }" :value-converters="{
        'line-width': (v) => parseFloat(v),
    }">
            <template #symbol="{ mark }">
                <div
                    :style="{ height: '20px', width: mark['line-width'] + 'px', backgroundColor: mark['line-color'], transform: 'rotate(30deg)' }">
                </div>
            </template>

            <template #editor="{ mark }">
                <div>
                    <label for="line-color">线颜色</label>
                    <input id="line-color" type="color" v-model="mark['line-color']">
                </div>

                <div>
                    <label for="line-width">线宽</label>
                    <input id="line-width" type="range" min="1" max="10" step="1" v-model="mark['line-width']">
                </div>
            </template>
        </Interpolate>

        <Match :map="map" layer="china-fill" property="fill-color" :p-value="['match', ['get', 'name']]" :default-value="'#ff0000'" :keys="['北京市', '天津市', '重庆市', '上海市']" >
            <template #default="{data}">
                <input type="color" v-model="data.value"> 
            </template>
        </Match>
    </div>
    <div id="map">

    </div>
</template>

<style scoped>
#map {
    width: 100%;
    height: 100%;
}

#controls {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 20px 0;
}
</style>
