import * as maplibregl from 'maplibre-gl';

/**
 * P<maplibregl.ExpressionSpecification | number> 转为 P<maplibregl.ExpressionSpecification> | P<number> 进行判断
 * 筛选 T 代表的联合类型存在 C
 * 如果存在 返回类型 K
 */
type P<T, C, K> = T extends C ? K : never;

/**
 * 去掉 undefined 并将属性全部非空
 */
type R<T> = Required<Exclude<T, undefined>>

/**
 * 筛选属性类型
 * 属性类型一定存在 maplibregl.ExpressionSpecification
 */
type TFilter<TSource, TCondition> = Pick<
    R<TSource>,
    {
        [K in keyof R<TSource>]: P<R<TSource>[K], TCondition, K>
    }[keyof R<TSource>]
>;

type ToUnionOfFunction<T> = T extends any ? (x: T) => any : never;
type UnionToIntersection<T> = ToUnionOfFunction<T> extends (x: infer P) => any ? P : never;

export type TPaintWithExpressionSpecification = TFilter<UnionToIntersection<R<maplibregl.LayerSpecification>['paint']>, maplibregl.ExpressionSpecification>;
export type TLayoutWithExpressionSpecification = TFilter<UnionToIntersection<R<maplibregl.LayerSpecification>['layout']>, maplibregl.ExpressionSpecification>;
export type TAllExpressionSpecificationPropertyName = keyof TPaintWithExpressionSpecification | keyof TLayoutWithExpressionSpecification