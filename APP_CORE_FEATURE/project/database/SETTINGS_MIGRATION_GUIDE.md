# Settings Feature - Database Migration Guide

## 🎯 Overview
This guide will help you add the settings feature to your FitGenie app database.

## 📋 Prerequisites
- Supabase project already set up
- Tables from `01_create_tables.sql` already created
- Access to Supabase SQL Editor

## 🚀 Step 1: Run the Migration

1. **Open Supabase Dashboard**
   - Go to https://supabase.com
   - Open your project: `khsnmgqsanwtppuwgplm`

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Execute the Migration**
   - Copy the entire contents of `database/03_add_settings.sql`
   - Paste into the SQL Editor
   - Click "Run" or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

4. **Verify Success**
   You should see:
   ```
   Success. No rows returned
   ```

## ✅ Step 2: Verify the Migration

Run this query to check if the settings column was added:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name = 'settings';
```

Expected result:
```
column_name | data_type
------------|----------
settings    | jsonb
```

## 🧪 Step 3: Test the Settings

### Test 1: Check Default Settings
```sql
-- This will show NULL for existing users
SELECT id, settings 
FROM user_profiles 
LIMIT 5;
```

### Test 2: Update a User's Settings (Optional)
```sql
-- Replace YOUR_USER_ID with an actual user ID
UPDATE user_profiles 
SET settings = '{
  "notifications": {
    "workoutReminders": true,
    "mealReminders": false,
    "progressUpdates": true,
    "weeklyReports": true
  },
  "appearance": {
    "theme": "dark",
    "language": "en"
  },
  "privacy": {
    "shareProgress": true,
    "publicProfile": false
  },
  "account": {
    "units": "metric"
  }
}'::jsonb
WHERE id = 'YOUR_USER_ID';
```

### Test 3: Query Specific Settings
```sql
-- Get all users with dark theme
SELECT username, settings->'appearance'->>'theme' as theme
FROM user_profiles
WHERE settings->'appearance'->>'theme' = 'dark';
```

## 📱 Frontend Integration

The Settings component now automatically:

✅ **Loads** settings from database on open
✅ **Saves** settings to database when user clicks "Save Changes"
✅ **Applies** theme changes immediately
✅ **Shows** loading state while fetching data
✅ **Displays** error messages if something fails
✅ **Provides** success feedback after saving

## 🎨 Available Settings

### Notifications
- `workoutReminders` - Boolean
- `mealReminders` - Boolean
- `progressUpdates` - Boolean
- `weeklyReports` - Boolean

### Appearance
- `theme` - "light" | "dark"
- `language` - String (e.g., "en", "hi", "es")

### Privacy
- `shareProgress` - Boolean
- `publicProfile` - Boolean

### Account
- `units` - "metric" | "imperial"

## 🔧 How It Works

1. **On Settings Open:**
   - Component fetches user's profile from Supabase
   - Loads settings JSONB field
   - Merges with defaults if some settings are missing

2. **On Settings Save:**
   - Validates user is logged in
   - Updates settings column in user_profiles table
   - Applies theme changes to DOM
   - Shows success message and closes modal

3. **Data Storage:**
   - All settings stored in single JSONB column
   - Fast queries with GIN index
   - Flexible structure for future settings

## 🐛 Troubleshooting

### Issue: Column already exists
```
ERROR: column "settings" of relation "user_profiles" already exists
```
**Solution:** The migration was already run. No action needed.

### Issue: Settings not saving
1. Check browser console for errors
2. Verify user is authenticated
3. Check RLS policies allow updates
4. Verify network tab shows successful request

### Issue: Settings not loading
1. Check if settings column exists in database
2. Verify user_profiles table has data
3. Check browser console for errors
4. Try logging out and back in

## 📊 Performance

- **GIN Index**: Fast JSONB queries
- **Single Column**: No extra joins needed
- **Default Values**: Handled in application layer
- **Efficient**: Only loads settings when modal opens

## 🎯 Next Steps

After running the migration:

1. ✅ Test the Settings page in your app
2. ✅ Try changing different settings
3. ✅ Verify settings persist after page refresh
4. ✅ Test theme switching works
5. ✅ Check privacy settings save correctly

## 🔐 Security Notes

- Settings are per-user (tied to auth.users)
- RLS policies ensure users can only modify their own settings
- No sensitive data stored in settings
- JSONB validation prevents malformed data

---

**Need Help?**
- Check Supabase logs for detailed errors
- Verify your database connection
- Ensure user is authenticated before opening Settings

🎉 **Congratulations!** Your Settings feature is now fully functional with backend support!
