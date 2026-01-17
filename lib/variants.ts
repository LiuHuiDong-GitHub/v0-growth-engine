export type VariantProps<T> = T extends {
  variants: infer V
  defaultVariants?: infer D
}
  ? {
      [K in keyof V]?: keyof V[K]
    } & {
      [K in keyof D]?: keyof D[K]
    }
  : never

export function variants<
  T extends string,
  V extends Record<string, Record<string, T>>,
  D extends Partial<{ [K in keyof V]: keyof V[K] }>,
>(baseClass: T, config: { variants: V; defaultVariants?: D }) {
  return (props: any = {}) => {
    let result = baseClass
    for (const [key, value] of Object.entries(config.variants)) {
      const selectedVariant = props[key] ?? config.defaultVariants?.[key as keyof D]
      if (selectedVariant && value[selectedVariant as string]) {
        result += " " + value[selectedVariant as string]
      }
    }
    return result
  }
}
