module.exports = {
  singleQuote: true,
  semi: false,
  useTabs: false,
  tabWidth: 2,
  trailingComma: 'none',
  printWidth: 80,
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^components/(.*)$',
    '^services/(.*)$',
    '^server/(.*)$',
    '^[./]'
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss'
  ]
}
