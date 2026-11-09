import { useMemo, useState } from 'react'
import { Info } from 'lucide-react'
import { useApp } from '../state/AppState'
import { copyText, cn } from '../lib/utils'
import type { MessageOptions } from '../data/types'
import { PageHeader, ContactCard, HelpLineCard } from '../components/ui/shared'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { MessagePreview } from '../components/message/MessagePreview'
import { Switch } from '../components/ui/misc'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/Toast'

const PLACES: { value: MessageOptions['place']; label: string }[] = [
  { value: 'class-group', label: 'Groupe de classe' },
  { value: 'social', label: 'Réseau social' },
  { value: 'game', label: 'Jeu en ligne' },
  { value: 'private', label: 'Messages privés' },
]

type Pending = { recipient?: string; options?: Partial<MessageOptions> }

export default function Message() {
  const { config, ps, dispatch } = useApp()
  const toast = useToast()
  const m = config.message
  const tu = config.address === 'tu'

  // Pré-remplissage à partir du check-up du MÊME profil (en mémoire uniquement).
  const fromCheckup = ps.checkup.answers.place?.find((p) => PLACES.some((x) => x.value === p)) as MessageOptions['place'] | undefined
  const [recipientId, setRecipientId] = useState(m.defaultRecipient)
  const [options, setOptions] = useState<MessageOptions>({
    about: ps.context === 'witness' ? 'other' : 'me',
    since: 'days',
    place: fromCheckup ?? 'class-group',
    evidence: true,
  })
  // Brouillon jamais persisté : null = texte proposé, string = texte modifié
  const [custom, setCustom] = useState<string | null>(null)
  const [pending, setPending] = useState<Pending | null>(null)

  const recipient = m.recipients.find((r) => r.id === recipientId) ?? m.recipients[0]
  const generated = useMemo(() => recipient.build(options), [recipient, options])
  const text = custom ?? generated
  const simple = recipient.id === 'child' // message à l’enfant : volontairement simple

  const apply = (p: Pending, replace: boolean) => {
    if (p.recipient) setRecipientId(p.recipient)
    if (p.options) setOptions((o) => ({ ...o, ...p.options }))
    if (replace) setCustom(null)
    setPending(null)
  }

  /** Un texte modifié à la main n’est jamais écrasé sans accord. */
  const request = (p: Pending) => {
    if (custom !== null && custom !== generated) setPending(p)
    else apply(p, true)
  }

  const onCopy = async () => {
    const ok = await copyText(text)
    if (ok) {
      dispatch({ type: 'message-copied' })
      toast({ tone: 'success', title: 'Message copié', text: tu ? 'Rien n’a été envoyé.' : 'Aucun envoi n’a été effectué.' })
    }
    return ok
  }

  return (
    <div>
      <PageHeader eyebrow={m.eyebrow} title={m.title} intro={m.intro} squiggle />

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_30rem] xl:gap-14">
        {/* 1 · Destinataire */}
        <section aria-labelledby="to" className="lg:col-start-1">
          <h2 id="to" className="eyebrow mb-3">
            1 · {tu ? 'À qui tu écris ?' : 'À qui écrivez-vous ?'}
          </h2>
          <div role="radiogroup" aria-labelledby="to" className={cn('grid gap-2.5', m.recipients.length > 3 ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4' : 'grid-cols-2 xs:grid-cols-3')}>
            {m.recipients.map((r) => (
              <ContactCard
                key={r.id}
                icon={r.icon}
                label={r.label}
                description={r.description}
                selected={r.id === recipient.id}
                onSelect={() => r.id !== recipient.id && request({ recipient: r.id })}
              />
            ))}
          </div>
        </section>

        {/* Aperçu (colonne droite collante sur desktop) */}
        <div className="lg:sticky lg:top-12 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:self-start">
          <MessagePreview
            text={text}
            recipientLabel={recipient.label}
            edited={custom !== null && custom !== generated}
            address={config.address}
            safety={m.safety}
            afterCopy={m.afterCopy}
            onChange={setCustom}
            onReset={() => setCustom(null)}
            onCopy={onCopy}
          />
        </div>

        {/* 2 · Ajustements */}
        <section aria-labelledby="adjust" className="lg:col-start-1">
          <h2 id="adjust" className="eyebrow mb-3">
            2 · {tu ? 'Ajuste les détails' : 'Ajustez les détails'}
          </h2>
          <div className="space-y-5 rounded-[1.375rem] border border-line bg-surface p-4 sm:p-5">
            {m.aboutLabels && (
              <Field label={tu ? 'C’est pour' : 'Situation'}>
                <SegmentedControl<MessageOptions['about']>
                  label={tu ? 'C’est pour' : 'Situation'}
                  value={options.about}
                  onChange={(about) => request({ options: { about } })}
                  block
                  options={[
                    { value: 'me', label: m.aboutLabels.me },
                    { value: 'other', label: m.aboutLabels.other },
                  ]}
                />
              </Field>
            )}

            {simple ? (
              <p className="flex gap-2 rounded-xl bg-sunken p-3 text-sm text-muted">
                <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
                Ce message s’adresse à votre enfant : il reste volontairement simple, sans détails ni preuves.
              </p>
            ) : (
              <>
                <Field label="Depuis quand ?">
                  <SegmentedControl<MessageOptions['since']>
                    label="Depuis quand ?"
                    value={options.since}
                    onChange={(since) => request({ options: { since } })}
                    block
                    size="sm"
                    options={[
                      { value: 'days', label: 'Jours' },
                      { value: 'weeks', label: 'Semaines' },
                      { value: 'months', label: 'Mois' },
                    ]}
                  />
                </Field>
                <Field label="Où ça se passe ?">
                  <div role="radiogroup" aria-label="Où ça se passe ?" className="flex flex-wrap gap-2">
                    {PLACES.map((p) => {
                      const on = options.place === p.value
                      return (
                        <button
                          key={p.value}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => request({ options: { place: p.value } })}
                          className={cn(
                            'h-11 rounded-full border px-4 text-sm font-semibold transition-colors',
                            on ? 'border-accent bg-accent-soft text-fg shadow-[0_0_0_1px_var(--accent)]' : 'border-line text-muted hover:border-line-strong hover:text-fg',
                          )}
                        >
                          {p.label}
                        </button>
                      )
                    })}
                  </div>
                  {fromCheckup && <p className="mt-2 text-xs text-muted">Pré-rempli d’après {tu ? 'ton' : 'votre'} check-up. Rien n’a été enregistré.</p>}
                </Field>
                <div className="border-t border-line pt-1">
                  <Switch
                    id="evidence"
                    checked={options.evidence}
                    onChange={(evidence) => request({ options: { evidence } })}
                    label={tu ? 'J’ai gardé des captures' : 'Des captures ont été conservées'}
                    description={tu ? 'Ajoute une phrase pour le dire.' : 'Ajoute une mention des preuves.'}
                  />
                </div>
              </>
            )}
          </div>
        </section>

        {/* 3 · Contacts directs */}
        <section aria-labelledby="direct" className="lg:col-start-1">
          <h2 id="direct" className="eyebrow mb-3">
            {tu ? 'Tu préfères parler directement ?' : 'Besoin d’un conseil maintenant ?'}
          </h2>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-2.5">
            {config.helpLines.slice(0, 2).map((l, i) => (
              <HelpLineCard key={l.id} line={l} emphasis={i === 0} />
            ))}
          </div>
        </section>
      </div>

      <Modal
        open={!!pending}
        onClose={() => setPending(null)}
        role="alertdialog"
        size="sm"
        title={tu ? 'Remplacer ton texte ?' : 'Remplacer votre texte ?'}
        description={
          tu
            ? 'Tu as modifié le message. On peut proposer un nouveau texte adapté, ou garder le tien tel quel.'
            : 'Vous avez modifié le message. Nous pouvons proposer un texte adapté, ou conserver le vôtre.'
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => pending && apply(pending, false)} data-autofocus>
              {tu ? 'Garder mon texte' : 'Garder mon texte'}
            </Button>
            <Button onClick={() => pending && apply(pending, true)}>Utiliser le nouveau texte</Button>
          </>
        }
      />
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-fg">{label}</p>
      {children}
    </div>
  )
}
