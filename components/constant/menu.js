export const MENUITEMS = [
   {
      title: 'HOME',
      type: 'link',
      path: '/'
   },
   {
      title: 'ALL PRODUCTS',
      type: 'link',
      path: '/shop/all-products'
   },
   {
      title: 'BRANDS',
      type: 'sub',
      path: '/brands',
      children: [
         { path: '/brands/american-apparel', title: 'American Apparel', type: 'link' },
         { path: '/brands/bella-canvas', title: 'BELLA+CANVAS', type: 'link' },
         { path: '/brands/burnside', title: 'Burnside', type: 'link' },
         { path: '/brands/carhartt', title: 'Carhartt', type: 'link' },
         { path: '/brands/champion', title: 'Champion', type: 'link' },
         { path: '/brands/columbia', title: 'Columbia', type: 'link' },
         { path: '/brands/comfort-colors', title: 'Comfort Colors', type: 'link' },
         { path: '/brands/core365', title: 'Core365', type: 'link' },
         { path: '/brands/cornerstone', title: 'CornerStone', type: 'link' },
         { path: '/brands/devon-jones', title: 'Devon & Jones', type: 'link' },
         { path: '/brands/dickies', title: 'Dickies', type: 'link' },
         { path: '/brands/district', title: 'District', type: 'link' },
         { path: '/brands/eddie-bauer', title: 'Eddie Bauer', type: 'link' },
         { path: '/brands/gildan', title: 'Gildan', type: 'link' },
         { path: '/brands/harriton', title: 'Harriton', type: 'link' },
         { path: '/brands/mercer-mettle', title: 'Mercer+Mettle', type: 'link' },
         { path: '/brands/nautica', title: 'Nautica', type: 'link' },
         { path: '/brands/nike', title: 'Nike', type: 'link' },
         { path: '/brands/ogio', title: 'OGIO', type: 'link' },
         { path: '/brands/port-company', title: 'Port & Company', type: 'link' },
         { path: '/brands/port-authority', title: 'Port Authority', type: 'link' },
         { path: '/brands/puma', title: 'Puma', type: 'link' },
         { path: '/brands/red-kap', title: 'Red Kap', type: 'link' },
         { path: '/brands/sport-tek', title: 'Sport-Tek', type: 'link' },
         { path: '/brands/spyder', title: 'Spyder', type: 'link' },
         { path: '/brands/team-365', title: 'Team 365', type: 'link' },
         { path: '/brands/the-north-face', title: 'The North Face', type: 'link' },
         { path: '/brands/travismathew', title: 'TravisMathew', type: 'link' },
         { path: '/brands/under-armour', title: 'Under Armour', type: 'link' },
         { path: '/brands/wink', title: 'Wink (scrubs)', type: 'link' },
      ]
   },
   {
      title: 'APPAREL',
      type: 'sub',
      path: '/apparel',
      children: [
         {
            title: 'T-Shirts', type: 'sub', path: '/apparel/t-shirts',
            children: [
               { path: '/apparel/t-shirts/short-sleeve', title: 'Short Sleeve', type: 'link' },
               { path: '/apparel/t-shirts/long-sleeve', title: 'Long Sleeve', type: 'link' },
               { path: '/apparel/t-shirts/100-cotton', title: '100% Cotton', type: 'link' },
               { path: '/apparel/t-shirts/50-50-blend', title: '50/50 Blend', type: 'link' },
               { path: '/apparel/t-shirts/tri-blend', title: 'Tri-Blend (soft feel)', type: 'link' },
               { path: '/apparel/t-shirts/performance', title: 'Performance', type: 'link' },
               { path: '/apparel/t-shirts/tall-size', title: 'Tall Size T-Shirts', type: 'link' },
               { path: '/apparel/t-shirts/ladies', title: 'Ladies T-Shirts', type: 'link' },
            ]
         },
         {
            title: 'Polos/Knits', type: 'sub', path: '/apparel/polos-knits',
            children: [
               { path: '/apparel/polos-knits/performance', title: 'Performance', type: 'link' },
               { path: '/apparel/polos-knits/silk-touch', title: 'Silk Touch', type: 'link' },
               { path: '/apparel/polos-knits/cotton', title: 'Cotton', type: 'link' },
               { path: '/apparel/polos-knits/workwear', title: 'Workwear', type: 'link' },
               { path: '/apparel/polos-knits/sweaters', title: 'Sweaters', type: 'link' },
               { path: '/apparel/polos-knits/ladies', title: 'Ladies Polos/Knits', type: 'link' },
               { path: '/apparel/polos-knits/tall-size', title: 'Tall Size Polos/Knits', type: 'link' },
            ]
         },
         {
            title: 'Sweatshirts/Fleece', type: 'sub', path: '/apparel/sweatshirts-fleece',
            children: [
               { path: '/apparel/sweatshirts-fleece/crewnecks', title: 'Crewnecks', type: 'link' },
               { path: '/apparel/sweatshirts-fleece/performance', title: 'Performance', type: 'link' },
               { path: '/apparel/sweatshirts-fleece/half-quarter-zips', title: '½ & ¼ Zips', type: 'link' },
               { path: '/apparel/sweatshirts-fleece/full-zips', title: 'Full Zips', type: 'link' },
               { path: '/apparel/sweatshirts-fleece/fleece', title: 'Fleece', type: 'link' },
               { path: '/apparel/sweatshirts-fleece/ladies', title: 'Ladies Sweatshirts/Fleece', type: 'link' },
               { path: '/apparel/sweatshirts-fleece/tall-size', title: 'Tall Size Sweatshirts/Fleece', type: 'link' },
            ]
         },
         {
            title: 'Outerwear', type: 'sub', path: '/apparel/outerwear',
            children: [
               { path: '/apparel/outerwear/soft-shells', title: 'Soft Shells', type: 'link' },
               { path: '/apparel/outerwear/polyester-fleece', title: 'Polyester Fleece', type: 'link' },
               { path: '/apparel/outerwear/rainwear', title: 'Rainwear', type: 'link' },
               { path: '/apparel/outerwear/vests', title: 'Vests', type: 'link' },
               { path: '/apparel/outerwear/corporate-jackets', title: 'Corporate Jackets', type: 'link' },
               { path: '/apparel/outerwear/ladies', title: 'Ladies Outerwear', type: 'link' },
               { path: '/apparel/outerwear/tall-size', title: 'Tall Size Outerwear', type: 'link' },
            ]
         },
         {
            title: 'Medical/Scrubs', type: 'sub', path: '/apparel/medical-scrubs',
            children: [
               { path: '/apparel/medical-scrubs/scrub-tops', title: 'Scrub Tops', type: 'link' },
               { path: '/apparel/medical-scrubs/scrub-bottoms', title: 'Scrub Bottoms', type: 'link' },
               { path: '/apparel/medical-scrubs/lab-coats', title: 'Lab Coats', type: 'link' },
            ]
         },
      ]
   },
   {
      title: 'BAGS',
      type: 'sub',
      path: '/bags',
      children: [
         { path: '/bags/tote-bags', title: 'Tote Bags', type: 'link' },
         { path: '/bags/backpacks', title: 'Backpacks', type: 'link' },
         { path: '/bags/coolers', title: 'Coolers', type: 'link' },
         { path: '/bags/duffle-bags', title: 'Duffle Bags', type: 'link' },
         { path: '/bags/drawstring-bags', title: 'Drawstring Bags', type: 'link' },
      ]
   },
   {
      title: 'PROMOTIONAL ITEMS',
      type: 'link',
      path: 'https://hoytcompany.logomall.com/'
   },
]