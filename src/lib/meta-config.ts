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
 * Datensatz "Dome_Website", der dem Werbekonto 415388386552412 zugeordnet ist.
 *
 * Vorgänger:
 *   - 1027053273442986 "Pepe Dome Website": tauchte im Events Manager des
 *     Werbekontos nicht auf und ließ sich in Kampagnen nicht auswählen. Der
 *     Datensatz des Werbekontos meldete deshalb "Pixel nicht aktiv".
 *   - 1643858583931537 im versehentlich angelegten Portfolio "Pepe".
 *
 * Meta zieht Datensätze nicht zwischen Portfolios um. Deshalb wird gewechselt
 * statt verschoben. META_CAPI_ACCESS_TOKEN muss ein Token genau dieses
 * Datensatzes sein, sonst lehnt Meta die Server-Ereignisse ab.
 */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1621310429655828'
