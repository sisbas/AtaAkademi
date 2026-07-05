# DB Smoke QA Contract

Bu klasör migration PR'ları için PostgreSQL seviyesinde çalışan QA smoke testlerini içerir.

Amaç yalnızca `migration çalıştı` demek değildir. Aşağıdaki release kapıları DB seviyesinde doğrulanır:

- cross-tenant veri sızıntısı engeli
- composite FK davranışı
- permission negative testlerin veri tabanı karşılığı
- published program conflict partial unique indexleri
- yoklama ve bildirim duplicate engelleri
- status/type/channel/KVKK check constraintleri
- hassas veri minimizasyonu

## Çalıştırma

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/ataakademi_test \
MIGRATIONS_DIR=db/migrations \
bash qa/db/run-db-smoke.sh
```

veya:

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/ataakademi_test npm run qa:db
```

## Migration dizini

Varsayılan migration dizini:

```text
db/migrations
```

Farklı bir dizin için:

```bash
MIGRATIONS_DIR=migrations bash qa/db/run-db-smoke.sh
```

Migration PR'larında migration dosyası yoksa job'ın kalmasını istiyorsanız:

```bash
REQUIRE_MIGRATIONS=true bash qa/db/run-db-smoke.sh
```

## Beklenen şema sözleşmesi

Smoke test dosyası Faz 1 MVP için şu tablo/kolon sözleşmesini varsayar:

- `tenant_id` tüm operasyon tablolarında `NOT NULL`
- child tablolar parent'lara `tenant_id + id` composite FK ile bağlı
- `schedule_events` published conflictleri partial unique index ile korunur
- `attendance_records` aynı öğrenci + aynı oturum için tek kayıt alır
- `parent_notifications` aynı attendance record için tek aktif bildirim üretir
- `students.kvkk_consent_status` yalnızca `pending`, `approved`, `rejected` değerlerini kabul eder
- KVKK approved olmayan öğrenci için `sent` bildirim DB guard veya trigger ile reddedilir

## Test yaklaşımı

Her kritik guard için iki doğrulama yapılır:

1. Catalog doğrulaması: tablo/kolon/constraint/index var mı?
2. Davranış doğrulaması: yanlış veri insert/update edilmeye çalışıldığında DB reddediyor mu?

Bu nedenle testler yalnızca migration uygulamasını değil, güvenlik ve veri bütünlüğü varsayımlarını da doğrular.

## Not

Mevcut repository Vite/React odaklı olduğundan bu QA harness uygulama koduna bağımlı değildir. Migration PR'ı eklendiğinde `db/migrations/*.sql` dosyaları uygulanır ve ardından smoke testler çalışır.
