<template>
    <div class="match">

        <div v-for="v, i in matchValues" :key="i" class="match-item">
            <label v-if="v.key">{{ v.key }}</label>
            <select v-else v-model="v.key">
                <option v-for="o in matchOptions" :key="o">{{o}}</option>
            </select>
            <slot :data="v"></slot>
            <button v-if="i === 0" :disabled="matchOptions.length === 0" @click="handleAddMatchValue">+</button>
            <button v-else @click="handleSubMatchValue(i)">-</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { TAllExpressionSpecificationPropertyName } from './types';

const props = defineProps<{
    map: maplibregl.Map,
    layer: string,
    property: TAllExpressionSpecificationPropertyName,
    pValue: ['match', any],
    defaultValue: any,
    keys: any[]
}>();

type TMatchValue = {
    key: any,
    value: any
};

const matchValues = ref<TMatchValue[]>([{
    key: "默认值",
    value: props.defaultValue
}]);

const matchOptions = computed(()=>{
   const res = new Array<any>();
   props.keys.forEach(k=>{
        if(!matchValues.value.some(x=>x.key === k))
            res.push(k);
   });
   return res;
});

watch(matchValues, a => {
    const v = props.pValue.concat(
        a.reduce((p, c, i) => {
            if (i === 0) {
                p.push(c.value);
            } else if (c.key && c.value) {
                p.unshift(c.value);
                p.unshift(c.key);
            }

            return p;
        }, [] as any[])
    );

    props.map.setPaintProperty(props.layer, props.property, v.length === 3 ? v[2] : v);
},{deep:true});

function handleAddMatchValue() {
    for (let i = 0; i < matchValues.value.length; i++) {
        const matchValue = matchValues.value[i];
        if (matchValue.key && matchValue.value)
            continue;
        else
            return i;
    }

    matchValues.value.push({
        key: "",
        value: props.defaultValue
    });
}

function handleSubMatchValue(index: number) {
    matchValues.value.splice(index, 1);
}


</script>

<style lang="css" scoped>
.match {
    background-color: aliceblue;
}

.match-item {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
}
</style>