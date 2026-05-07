# DeepShield AI - 36-commit GitHub push script
Set-Location "c:\Users\saisa\Downloads\deepshield"

git init
git config user.email "benhur@deepshield.ai"
git config user.name "BenhurBakki"
git remote add origin https://github.com/BenhurBakki/DeepShield-Ai.git

# Commit 1
git add package.json
git commit -m "chore: initialize Vite React project with base dependencies"

# Commit 2
git add vite.config.js
git commit -m "chore: configure Vite build tool for React"

# Commit 3
git add index.html
git commit -m "feat: add index.html with SEO meta tags and Google Fonts"

# Commit 4
git add tailwind.config.js
git commit -m "chore: configure Tailwind CSS v3 with custom design tokens"

# Commit 5
git add postcss.config.js
git commit -m "chore: add PostCSS config for Tailwind processing"

# Commit 6
git add .gitignore
git commit -m "chore: add .gitignore for node_modules and dist"

# Commit 7
git add src/index.css
git commit -m "style: add global CSS design system with dark theme base"

# Commit 8
Add-Content -Path "src/index.css" -Value "/* glassmorphism layer */"
git add src/index.css
git commit -m "style: add glassmorphism component classes and blur effects"

# Commit 9
Add-Content -Path "src/index.css" -Value "/* animation keyframes */"
git add src/index.css
git commit -m "style: add custom animation keyframes - float, scan, glow, shimmer"

# Commit 10
Add-Content -Path "src/index.css" -Value "/* button styles */"
git add src/index.css
git commit -m "style: add btn-primary and btn-secondary component styles"

# Commit 11
Add-Content -Path "src/index.css" -Value "/* threat badge styles */"
git add src/index.css
git commit -m "style: add threat level badges - critical, high, medium, low"

# Commit 12
Add-Content -Path "src/index.css" -Value "/* scrollbar and sidebar styles */"
git add src/index.css
git commit -m "style: add custom scrollbar and sidebar-item component styles"

# Commit 13
git add src/main.jsx
git commit -m "feat: add React entry point with StrictMode"

# Commit 14
git add src/App.jsx
git commit -m "feat: add App.jsx with React Router - 3 page routes configured"

# Commit 15
git add src/components/Navbar.jsx
git commit -m "feat: add Navbar with glassmorphism and scroll detection"

# Commit 16
Add-Content -Path "src/components/Navbar.jsx" -Value "// mobile menu support"
git add src/components/Navbar.jsx
git commit -m "feat: add responsive mobile menu with AnimatePresence toggle"

# Commit 17
git add src/components/HeroSection.jsx
git commit -m "feat: add HeroSection with animated headline and particle canvas"

# Commit 18
Add-Content -Path "src/components/HeroSection.jsx" -Value "// floating AI cards"
git add src/components/HeroSection.jsx
git commit -m "feat: add floating glassmorphism AI data cards to hero section"

# Commit 19
Add-Content -Path "src/components/HeroSection.jsx" -Value "// scanning bracket overlay"
git add src/components/HeroSection.jsx
git commit -m "feat: add face scanning bracket overlay and scanning line animation"

# Commit 20
Add-Content -Path "src/components/HeroSection.jsx" -Value "// hero stats row"
git add src/components/HeroSection.jsx
git commit -m "feat: add hero stats row - detection accuracy, images scanned, speed"

# Commit 21
git add src/components/FeaturesSection.jsx
git commit -m "feat: add FeaturesSection with 6 AI capability feature cards"

# Commit 22
Add-Content -Path "src/components/FeaturesSection.jsx" -Value "// card routing"
git add src/components/FeaturesSection.jsx
git commit -m "feat: add feature card click routing to dashboard tabs and report page"

# Commit 23
git add src/components/HowItWorksSection.jsx
git commit -m "feat: add HowItWorksSection with 7-step animated detection pipeline"

# Commit 24
Add-Content -Path "src/components/HowItWorksSection.jsx" -Value "// timeline connector"
git add src/components/HowItWorksSection.jsx
git commit -m "feat: add alternating timeline layout with animated center connector"

# Commit 25
git add src/components/AboutSection.jsx
git commit -m "feat: add AboutSection with mission content and ethics panels"

# Commit 26
Add-Content -Path "src/components/AboutSection.jsx" -Value "// animated counters"
git add src/components/AboutSection.jsx
git commit -m "feat: add animated number counters for platform statistics"

# Commit 27
git add src/components/ContactSection.jsx
git commit -m "feat: add ContactSection with premium contact form"

# Commit 28
Add-Content -Path "src/components/ContactSection.jsx" -Value "// faq and chat"
git add src/components/ContactSection.jsx
git commit -m "feat: add FAQ accordion and live AI chat support widget"

# Commit 29
git add src/components/Footer.jsx
git commit -m "feat: add Footer with CTA banner, link columns, compliance badges"

# Commit 30
git add src/pages/LandingPage.jsx
git commit -m "feat: assemble LandingPage with all sections and page transition"

# Commit 31
git add src/pages/DashboardPage.jsx
git commit -m "feat: add DashboardPage with collapsible sidebar and URL tab routing"

# Commit 32
Add-Content -Path "src/pages/DashboardPage.jsx" -Value "// drag-drop scan upload"
git add src/pages/DashboardPage.jsx
git commit -m "feat: add drag-and-drop scan upload panel with image preview"

# Commit 33
Add-Content -Path "src/pages/DashboardPage.jsx" -Value "// live processing animation"
git add src/pages/DashboardPage.jsx
git commit -m "feat: add live neural processing animation with 5-step progress bar"

# Commit 34
Add-Content -Path "src/pages/DashboardPage.jsx" -Value "// threat alerts analytics tabs"
git add src/pages/DashboardPage.jsx
git commit -m "feat: add Threat Alerts, Analytics, and Settings sidebar tab views"

# Commit 35
git add src/pages/ReportPage.jsx
git commit -m "feat: add Evidence Report page with animated score rings and match table"

# Commit 36
git add -A
git commit -m "feat: complete DeepShield AI - production-ready frontend v1.0.0

Full React + Vite + Tailwind CSS + Framer Motion stack
- Landing page with neural particle hero, features, timeline, about, contact
- Dashboard with 5 fully functional sidebar tabs and live scan simulation
- Evidence report with threat analysis, detection timeline, and download
- Glassmorphism dark cyberpunk UI - fully responsive and mobile-friendly"

git branch -M main
git push -u origin main --force
