# Ata Akademi Yoklama Sistemi

Bu depo Ata Akademi yoklama uygulamasının Netlify üzerinde yayınlanabilmesi için Vite ve React kullanılarak yeniden düzenlenmiş halini içerir.

## Geliştirme

```bash
npm install
npm run dev
```

## Derleme

```bash
npm run build
```

Derleme çıktısı `dist/` klasörüne oluşturulur ve Netlify tarafından bu klasör yayınlanmalıdır.

## Netlify

Depo kökündeki `netlify.toml` dosyası gerekli yapılandırmayı içerir. Netlify üzerinde build komutu olarak `npm run build`, yayın klasörü olarak `dist` seçilmelidir.
