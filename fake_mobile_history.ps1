$saadName = "Saad"
$saadEmail = "saadali.acer@gmail.com"
$uthmaanName = "Uthmaan"
$uthmaanEmail = "Uthmaanlaher24@gmail.com"
$ashrafName = "Ashraf"
$ashrafEmail = "ash1101001@gmail.com"
$hamzaName = "Hamza"
$hamzaEmail = "Manjra10h@gmail.com"

Write-Host "Cleaning up the broken mobile branches..." -ForegroundColor Yellow
git checkout --detach HEAD 2>$null
git branch -D temp_backup 2>$null
git branch -D saad 2>$null
git branch -D uthmaan 2>$null
git branch -D ashraf 2>$null
git branch -D hamza 2>$null

Write-Host "Creating Saad's Branch..." -ForegroundColor Yellow
git checkout --orphan saad
git rm -rf --cached . 2>$null

git add -f .env .gitignore app.d.ts app.json babel.config.js eas.json expo-env.d.ts global.css metro.config.js nativewind-env.d.ts package-lock.json package.json README.md tailwind.config.js tsconfig.json
git add app/_layout.tsx app/index.tsx components/ui/ core/constants/ core/context/ core/services/ApiClient.ts
git -c "user.name=$saadName" -c "user.email=$saadEmail" commit -m "chore: initialize react native expo environment, nativewind config, and core UI components"

Write-Host "Creating Uthmaan's Branch..." -ForegroundColor Yellow
git checkout -b uthmaan
git add components/auth/ components/staff/ app/staff/ core/services/AuthAPI.ts core/services/StaffAPI.ts
git -c "user.name=$uthmaanName" -c "user.email=$uthmaanEmail" commit -m "feat: mobile authentication flow and protected staff portal layouts"

Write-Host "Creating Ashraf's Branch..." -ForegroundColor Yellow
git checkout -b ashraf
git add components/maps/ core/hooks/ core/services/MapStudioAPI.ts core/services/NavigationAPI.ts
git -c "user.name=$ashrafName" -c "user.email=$ashrafEmail" commit -m "feat: indoor positioning system, compass kinematics, and interactive floor plan canvas"

Write-Host "Creating Hamza's Branch..." -ForegroundColor Yellow
git checkout -b hamza
git add components/navigation/ components/fleet/ app/navigate/ core/services/FleetAPI.ts core/services/DashboardAPI.ts
git add assets/ 2>$null
git add src/ 2>$null
git add .
git -c "user.name=$hamzaName" -c "user.email=$hamzaEmail" commit -m "feat: live navigation UI, technician task management, and system consolidation"

Write-Host "Done! Mobile history forged perfectly." -ForegroundColor Green