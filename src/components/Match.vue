<template>
    <div class="match">

        <div v-for="v, i in matchValues" :key="i" class="match-item">
            <label v-if="v.key">{{ v.key }}</label>
            <select v-else v-model="v.key">
                <option v-for="o in matchOptions" :key="o">{{ o }}</option>
            </select>
            <slot :data="v"></slot>
            <button v-if="i === 0" :disabled="matchOptions.length === 0" @click="handleAddMatchValue">+</button>
            <button v-else @click="handleSubMatchValue(i)">-</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { TAllExpressionSpecificationPropertyName } from './types';
import {isEqual} from 'es-toolkit';

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

const matchValues = reactive<TMatchValue[]>([{
    key: "默认值",
    value: props.defaultValue
}]);

const matchOptions = computed(() => {
    const res = new Array<any>();
    props.keys.forEach(k => {
        if (!matchValues.some(x => x.key === k))
            res.push(k);
    });
    return res;
});

watch(matchValues, (a, b) => {
    console.log(isEqual(a, b));

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
}, {});

function handleAddMatchValue() {
    for (let i = 0; i < matchValues.length; i++) {
        const matchValue = matchValues[i];
        if (matchValue.key && matchValue.value)
            continue;
        else
            return i;
    }

    matchValues.push({
        key: "",
        value: props.defaultValue
    });
}

function handleSubMatchValue(index: number) {
    matchValues.splice(index, 1);
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