# Despliegue en Hostinger

El sitio es estático: `pnpm build` genera `dist/` y GitHub Actions lo sube por FTP a Hostinger en cada push a `main`.

## 1. Crear la cuenta FTP en Hostinger

hPanel → **Sitios web** → aranaprostudio.com → **Archivos → Cuentas FTP**. Anota el host, el usuario y la contraseña.

Fíjate en qué carpeta abre la cuenta:

- Si abre directamente `public_html`, no necesitas `FTP_DIR`.
- Si abre un nivel arriba, crea el Secret `FTP_DIR` con el valor `public_html/`.

## 2. Configurar los Secrets en GitHub

Repositorio → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Valor |
|---|---|
| `FTP_SERVER` | Host FTP (p. ej. `ftp.aranaprostudio.com` o la IP que muestra Hostinger) |
| `FTP_USERNAME` | Usuario FTP |
| `FTP_PASSWORD` | Contraseña FTP |
| `FTP_DIR` | *(Opcional)* `public_html/` si hace falta |
| `FTP_PROTOCOL` | *(Opcional)* `ftp` si Hostinger rechaza `ftps` |

Mientras no existan, el workflow compila y avisa, pero no despliega.

### Si el paso de FTP falla con `ECONNRESET`

Es un corte pasajero entre GitHub y el FTP de Hostinger, no un problema del sitio ni de las credenciales. El workflow reintenta solo hasta dos veces (con 45 s y 90 s de pausa) y cada intento sube únicamente lo que falte, sin borrar nada. Si fallan los tres, vuelve a correrlo más tarde (**Re-run failed jobs**); el sitio publicado no se toca mientras tanto.

Que el registro diga «No file exists on the server ./.ftp-deploy-sync-state.json» en esos casos tampoco es grave: la acción no pudo leer ese archivo por el mismo corte y lo trata como primera publicación (vuelve a subir todo).

## 3. DNS (Cloudflare)

El correo ya apunta a Hostinger (MX, SPF, DKIM y DMARC). Para la web faltan:

| Tipo | Nombre | Valor |
|---|---|---|
| A | `@` | IP del hosting en Hostinger (hPanel → Detalles del plan) |
| CNAME | `www` | `aranaprostudio.com` |

- Activa el SSL gratuito en hPanel → **Seguridad → SSL**.
- Si usas el proxy de Cloudflare (nube naranja), pon SSL/TLS en modo **Full (strict)**. El `.htaccess` ya contempla `X-Forwarded-Proto` para evitar redirecciones en bucle.

## 4. Desplegar a mano (alternativa)

```bash
pnpm build
```

Después sube el contenido de `dist/`, incluidos los archivos ocultos `.htaccess`, a `public_html` desde el Administrador de archivos de hPanel.
