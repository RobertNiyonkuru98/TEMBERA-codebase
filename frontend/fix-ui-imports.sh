#!/bin/bash

# Fix all UI component imports
find src/shared/components/ui -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i \
  -e "s|from '@/lib/utils'|from '@/shared/utils/utils'|g" \
  -e "s|from '@/hooks/use-mobile'|from '@/shared/hooks/use-mobile'|g" \
  -e "s|from '@/components/ui/button'|from './button'|g" \
  -e "s|from '@/components/ui/input'|from './input'|g" \
  -e "s|from '@/components/ui/separator'|from './separator'|g" \
  -e "s|from '@/components/ui/sheet'|from './sheet'|g" \
  -e "s|from '@/components/ui/skeleton'|from './skeleton'|g" \
  -e "s|from '@/components/ui/tooltip'|from './tooltip'|g" \
  {} \;

echo "UI component imports fixed"
