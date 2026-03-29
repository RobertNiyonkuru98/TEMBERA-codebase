#!/bin/bash

# Fix imports in itineraries feature
find src/features/itineraries -type f -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i "s|from '../i18n'|from '@/core/i18n'|g" "$file"
  sed -i "s|from '../AuthContext'|from '@/features/auth/AuthContext'|g" "$file"
  sed -i "s|from '../types'|from '@/shared/types'|g" "$file"
  sed -i "s|from '../api/platformApi'|from '@/core/api'|g" "$file"
  sed -i "s|from '../../types'|from '@/shared/types'|g" "$file"
  sed -i "s|from '../../api/platformApi'|from '@/core/api'|g" "$file"
  sed -i "s|from '../../AuthContext'|from '@/features/auth/AuthContext'|g" "$file"
done

# Fix imports in profile feature
find src/features/profile -type f -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i "s|from '../AuthContext'|from '@/features/auth/AuthContext'|g" "$file"
  sed -i "s|from '../i18n'|from '@/core/i18n'|g" "$file"
  sed -i "s|from '../types'|from '@/shared/types'|g" "$file"
done

# Fix imports in bookings feature
find src/features/bookings -type f -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i "s|from '../AuthContext'|from '@/features/auth/AuthContext'|g" "$file"
  sed -i "s|from '../i18n'|from '@/core/i18n'|g" "$file"
  sed -i "s|from '../types'|from '@/shared/types'|g" "$file"
  sed -i "s|from '../api/|from '@/core/api/|g" "$file"
done

# Fix imports in company feature
find src/features/company -type f -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i "s|from '../AuthContext'|from '@/features/auth/AuthContext'|g" "$file"
  sed -i "s|from '../i18n'|from '@/core/i18n'|g" "$file"
  sed -i "s|from '../types'|from '@/shared/types'|g" "$file"
  sed -i "s|from '../api/|from '@/core/api/|g" "$file"
  sed -i "s|from '../../AuthContext'|from '@/features/auth/AuthContext'|g" "$file"
  sed -i "s|from '../../types'|from '@/shared/types'|g" "$file"
  sed -i "s|from '../../api/|from '@/core/api/|g" "$file"
done

# Fix imports in admin feature
find src/features/admin -type f -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i "s|from '../AuthContext'|from '@/features/auth/AuthContext'|g" "$file"
  sed -i "s|from '../i18n'|from '@/core/i18n'|g" "$file"
  sed -i "s|from '../types'|from '@/shared/types'|g" "$file"
  sed -i "s|from '../api/|from '@/core/api/|g" "$file"
done

# Fix imports in auth feature
find src/features/auth -type f -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i "s|from '../i18n'|from '@/core/i18n'|g" "$file"
  sed -i "s|from '../types'|from '@/shared/types'|g" "$file"
  sed -i "s|from '../api/|from '@/core/api/|g" "$file"
  sed -i "s|from './api/|from '@/core/api/|g" "$file"
  sed -i "s|from '../store'|from '@/core/store'|g" "$file"
done

# Fix imports in home feature
find src/features/home -type f -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i "s|from '../i18n'|from '@/core/i18n'|g" "$file"
  sed -i "s|from '../types'|from '@/shared/types'|g" "$file"
  sed -i "s|from '../api/|from '@/core/api/|g" "$file"
  sed -i "s|from '../AuthContext'|from '@/features/auth/AuthContext'|g" "$file"
done

# Fix imports in shared components
find src/shared/components -type f -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i "s|from '../AuthContext'|from '@/features/auth/AuthContext'|g" "$file"
  sed -i "s|from '../../AuthContext'|from '@/features/auth/AuthContext'|g" "$file"
  sed -i "s|from '../../../AuthContext'|from '@/features/auth/AuthContext'|g" "$file"
  sed -i "s|from '../i18n'|from '@/core/i18n'|g" "$file"
  sed -i "s|from '../../i18n'|from '@/core/i18n'|g" "$file"
  sed -i "s|from '../types'|from '@/shared/types'|g" "$file"
  sed -i "s|from '../../types'|from '@/shared/types'|g" "$file"
  sed -i "s|from '../theme'|from '@/core/theme'|g" "$file"
  sed -i "s|from '../../theme'|from '@/core/theme'|g" "$file"
  sed -i "s|from './ui/menubar'|from '@/shared/components/ui'|g" "$file"
  sed -i "s|from '../ui/menubar'|from '@/shared/components/ui'|g" "$file"
  sed -i "s|from './RoleSwitcher'|from '@/shared/components/common'|g" "$file"
  sed -i "s|from '../../lib/utils'|from '@/shared/utils/utils'|g" "$file"
done

echo "Import fixes complete!"
