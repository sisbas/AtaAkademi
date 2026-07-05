# Faz 1 PO Freeze — Okul Yönetim SaaS MVP

## Kısa Hüküm
Faz 1 MVP Product Owner açısından şartlı olarak geliştirilmeye hazırdır. P0 akış dondurulmuştur; geliştirme başlamadan önce tenant, auth, RBAC, audit log ve KVKK veri minimizasyonu release blocker kabul edilmiştir.

## Nihai Sprint Goal
Faz 1 MVP sprint hedefi; çok kurumlu SaaS temelini koruyarak yöneticinin temel tanımları oluşturduğu, haftalık ders programını hard conflict olmadan yayınladığı, öğretmenin izin talebinin ders etkisiyle birlikte yönetildiği, günlük operasyon ekranında ders/izin/yoklama durumunun izlendiği, öğretmenin yalnızca kendi dersinde yoklama alabildiği ve devamsızlık durumunda veli bilgilendirme taslağının operasyon onayıyla kayıt altına alındığı uçtan uca operasyon çekirdeğini çalışır, test edilebilir ve GitHub issue’ları üzerinden izlenebilir hale getirmektir.

## Faz 1 Kapsam İçi
- Tenant / kurum ayrımı
- Auth / kullanıcı girişi
- RBAC / rol bazlı yetkilendirme
- Audit Log
- KVKK veri minimizasyonu
- Öğretmen, öğrenci, sınıf/şube, ders, derslik ve zaman slotu temel tanımları
- Ders Programı
- İzin Yönetimi
- Günlük Operasyon
- Yoklama
- Veli bilgilendirme taslağı + insan onayı + gönderim durumu kaydı

## Faz 1 Kapsam Dışı
- Gelişmiş rehberlik modülü
- Deneme sınavı planlama
- Öğrenci başarı analitiği
- Mobil uygulama
- Gelişmiş AI tahmin/predict ekranları
- Tam otomatik WhatsApp entegrasyonu
- Gelişmiş BI / stratejik raporlama panelleri
- Mezun takip sistemi
- Ödeme / muhasebe modülü

## P0 Epic Yapısı
1. SaaS Core
2. Master Data
3. Scheduling
4. Leave Management
5. Daily Operations
6. Attendance
7. Parent Notification
8. QA Acceptance

## Definition of Ready
- User story rol + ihtiyaç + sonuç içerir.
- En az 2 test edilebilir acceptance criteria vardır.
- P0/P1/Faz 2 etiketi nettir.
- Veri modeli, API ihtiyacı ve bağımlılıklar belirtilmiştir.
- RBAC, KVKK ve audit log ihtiyacı işaretlenmiştir.
- PO kararı Decision Log’a işlenmiştir.

## Definition of Done
- Acceptance criteria eksiksiz geçmiştir.
- Unit/API testleri eklenmiştir.
- RBAC ve tenant izolasyonu test edilmiştir.
- KVKK veri minimizasyonu kontrol edilmiştir.
- Kritik işlem audit log’a düşmektedir.
- Açık P0 bug veya release blocker yoktur.

## MVP KPI Seti
| KPI | Hedef |
|---|---:|
| Program Tamamlanma Oranı | >= %90 |
| Hard Conflict Sayısı | 0 |
| İzin Etki Analizi Oranı | %100 |
| Günlük Yoklama Tamamlanma Oranı | >= %95 |
| Devamsızlık Bildirim Oranı | >= %90 |
| Bildirim Başarı Oranı | >= %95 |
| Günlük Operasyon Kapanış Oranı | >= %90 |

## Release Blocker
- Tenant izolasyonu eksikse release yok.
- RBAC ihlali varsa release yok.
- KVKK onaysız otomatik bildirim varsa release yok.
- Audit log eksik kritik işlem varsa release yok.
- Yayınlanmış programda hard conflict varsa release yok.
