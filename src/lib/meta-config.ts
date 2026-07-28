/**
 * Meta-Konfiguration, gemeinsam genutzt von Browser und Server.
 *
 * Bewusst ohne Imports, damit sowohl die Client-Komponente
 * (`ConsentScripts`) als auch die Server-Route (`/api/track`) sie nutzen
 * können, ohne den jeweils anderen Code mitzuziehen.
 *
 * Die ID steht im Code und nicht nur in einer Umgebungsvariable, weil sie
 * kein Geheimnis ist: Sie steht im Quelltext jeder Seite, die das Pixel
 * lädt, und ist über die Meta Ad Library ablesbar. Genauso verfährt das
 * Projekt mit der Google-Analytics-ID.
 *
 * Das Zugriffstoken der Conversions API ist das Gegenteil davon und lebt
 * ausschließlich in META_CAPI_ACCESS_TOKEN. Dieses Repository ist öffentlich.
 */

/**
 * Dataset "Pepe Dome Website" im Business-Portfolio Pepe Arts.
 *
 * Vorgänger war 1643858583931537 im versehentlich angelegten Portfolio
 * "Pepe". Der lag getrennt vom Werbekonto und der Facebook-Seite, und Meta
 * zieht Datensätze nicht zwischen Portfolios um. Deshalb neu angelegt statt
 * verschoben.
 */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1027053273442986'
