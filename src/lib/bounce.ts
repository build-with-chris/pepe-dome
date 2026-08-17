/**
 * Ist ein Bounce endgueltig?
 *
 * Steht hier und nicht im Webhook, damit sich die Regel ohne Datenbank und
 * ohne Signaturpruefung testen laesst. Sie ist die riskanteste Stelle der
 * Bounce-Behandlung: Erkennt sie zu wenig, bleiben tote Adressen im Verteiler
 * und ziehen den Ruf der Absenderdomain nach unten. Erkennt sie zu viel,
 * fliegen Leute raus, deren Postfach nur kurz voll war.
 *
 * Vorgeschichte: Der Webhook las ausschliesslich `bounce.bounceType` und
 * verglich auf 'Hard'. In allen sechs Bounces, die bis August 2026 eingingen,
 * war dieses Feld leer. Jeder Bounce galt damit als weich, ausgetragen wurde
 * nie jemand.
 *
 * Welchen Namen Resend wirklich schickt, ist von aussen nicht zu belegen.
 * Deshalb werden die gaengigen Schreibweisen gelesen, statt eine zu raten, und
 * der Webhook loggt den rohen Inhalt mit. Sobald der erste echte Payload
 * vorliegt, gehoert das hier auf das eine richtige Feld eingedampft.
 */

export interface BouncePayload {
  bounceType?: string
  type?: string
  subType?: string
}

/** Der rohe Typ, egal unter welchem Feldnamen er ankommt. */
export function bounceTyp(bounce?: BouncePayload | null): string | undefined {
  return bounce?.bounceType ?? bounce?.type ?? bounce?.subType ?? undefined
}

/**
 * `true` nur bei einem endgueltigen Bounce.
 *
 * "Hard" ist die Sprache von Resend, "Permanent" die von SES darunter. Beides
 * heisst: die Adresse gibt es nicht, ein zweiter Versuch schadet nur.
 *
 * Fehlt die Angabe, lautet die Antwort `false`. Im Zweifel bleibt jemand im
 * Verteiler, statt wegen eines unbekannten Feldnamens ausgetragen zu werden.
 */
export function istHarterBounce(bounce?: BouncePayload | null): boolean {
  const roh = bounceTyp(bounce)
  return typeof roh === 'string' && /hard|permanent/i.test(roh)
}
