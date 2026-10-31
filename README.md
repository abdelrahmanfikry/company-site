# موقع الشركة + لوحة التحكم

## الملفات
| الملف | وظيفته |
|---|---|
| `index.html` + `style.css` + `app.js` | الموقع نفسه (لا تحتاج تعديله) |
| `site.json` | **كل محتوى الموقع** (النصوص، الأقسام، الأرقام، الصور) — اللوحة بتعدّله |
| الصور | ملفات `.svg` التجريبية في الجذر · المرفوعة من اللوحة في `images/uploads/` |
| `admin.html` | لوحة التحكم — تفتحها من `yoursite.com/admin.html` |

## النشر على GitHub Pages (مرة واحدة — 10 دقائق)
1. اعمل حساب على github.com.
2. **New repository** ← الاسم مثلاً `green-valley` ← Public ← Create.
3. **Add file ← Upload files** ← اسحب كل محتويات الفولدر (مش الفولدر نفسه) ← Commit.
4. **Settings ← Pages** ← Source: `Deploy from a branch` ← Branch: `main` / `root` ← Save.
5. بعد دقيقة الموقع يشتغل على: `https://<اسم-حسابك>.github.io/green-valley/`

## مفتاح لوحة التحكم (Token)
1. GitHub ← صورتك ← **Settings ← Developer settings ← Personal access tokens ← Fine-grained tokens ← Generate new token**.
2. **Repository access:** Only select repositories ← اختار مستودع الموقع بس.
3. **Permissions ← Repository permissions ← Contents: Read and write**.
4. Generate ← انسخ المفتاح (بيظهر مرة واحدة).
5. افتح `…/admin.html` ← اكتب اسم الحساب واسم المستودع والفرع `main` والمفتاح ← دخول.

> المفتاح بيتحفظ على جهازك بس. لو الجهاز اتسرق أو حد شافه: امسحه من نفس الصفحة واعمل غيره.

## استخدام اللوحة
- **الإعدادات العامة:** الاسم، اللوجو، الألوان، الواتساب، الجوالات، الإيميل، العنوان، السوشيال.
- **الأقسام:** اسحب للترتيب · 👁 إظهار/إخفاء · «+ إضافة قسم» لأي نوع (فيديو، نص حر، أسئلة…) · نسخ أو حذف.
- **الصور:** «⬆ رفع صورة» — بتتصغّر تلقائياً عشان الموقع يفضل سريع.
- **👁 معاينة** قبل النشر · **🚀 حفظ ونشر** ← الموقع يتحدّث خلال دقيقة.
- **⬇ نسخة احتياطية** خدها قبل أي تعديل كبير، و**⬆ استرجاع** يرجّعها.

## دومين خاص (اختياري)
اشترِ دومين (مثلاً من Namecheap أو GoDaddy) ← في GitHub: **Settings ← Pages ← Custom domain** ← اكتبه ← واتبع تعليمات الـDNS اللي هتظهر.
