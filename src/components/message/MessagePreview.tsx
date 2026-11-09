import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Copy, Check, PencilLine, RotateCcw, Lock, Share2, CircleAlert } from 'lucide-react'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

interface Props {
  text: string
  recipientLabel: string
  edited: boolean
  address: 'tu' | 'vous'
  safety: string
  afterCopy: string
  onChange: (t: string) => void
  onReset: () => void
  onCopy: () => Promise<boolean>
}

/**
 * Aperçu du message : bulle lisible par défaut, bascule en édition libre.
 * Copier ne déclenche AUCUN envoi : c’est dit, écrit et confirmé.
 */
export function MessagePreview({ text, recipientLabel, edited, address, safety, afterCopy, onChange, onReset, onCopy }: Props) {
  const [editing, setEditing] = useState(false)
  const [copied, setCopied] = useState<'idle' | 'ok' | 'error'>('idle')
  const [busy, setBusy] = useState(false)
  const area = useRef<HTMLTextAreaElement>(null)
  const id = useId()
  const tu = address === 'tu'
  const empty = text.trim().length === 0
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator

  // Ajuste la hauteur du textarea à son contenu
  useEffect(() => {
    if (!editing || !area.current) return
    area.current.style.height = 'auto'
    area.current.style.height = `${area.current.scrollHeight}px`
  }, [text, editing])

  useEffect(() => {
    if (editing) area.current?.focus()
  }, [editing])

  // Le texte change → l’état « copié » n’est plus vrai
  useEffect(() => setCopied('idle'), [text])

  const copy = async () => {
    if (empty) return
    setBusy(true)
    const ok = await onCopy()
    setBusy(false)
    setCopied(ok ? 'ok' : 'error')
    if (!ok) {
      setEditing(true)
      window.setTimeout(() => area.current?.select(), 50)
    }
  }

  const share = async () => {
    try {
      await navigator.share({ text })
    } catch {
      /* annulé par l’utilisateur */
    }
  }

  return (
    <section aria-labelledby={`${id}-t`} className="rounded-[1.75rem] border border-line bg-surface p-4 shadow-card sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id={`${id}-t`} className="eyebrow">
          Aperçu
        </h2>
        <p className="truncate text-[0.8125rem] text-muted">
          À : <span className="font-semibold text-fg">{recipientLabel}</span>
        </p>
      </div>

      {/* Surface du message */}
      <div className="dot-grid rounded-[1.25rem] bg-sunken p-3 sm:p-4">
        {editing ? (
          <div>
            <label htmlFor={`${id}-ta`} className="sr-only">
              Texte du message
            </label>
            <textarea
              id={`${id}-ta`}
              ref={area}
              value={text}
              onChange={(e) => onChange(e.target.value)}
              rows={5}
              aria-invalid={empty || undefined}
              aria-describedby={`${id}-count ${empty ? `${id}-err` : ''}`}
              className="block min-h-40 w-full resize-none rounded-2xl border-2 border-accent bg-surface p-4 text-base leading-relaxed text-fg outline-none placeholder:text-faint"
              placeholder={tu ? 'Écris ton message…' : 'Rédigez votre message…'}
            />
          </div>
        ) : (
          <motion.div
            key={text}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'relative ml-auto max-w-[34rem] rounded-[1.25rem] rounded-br-md px-4 py-3.5 text-[1rem] leading-relaxed whitespace-pre-wrap shadow-xs',
              empty ? 'border-2 border-dashed border-line-strong bg-surface text-faint italic' : 'bg-accent-soft text-fg ring-1 ring-accent-line',
            )}
          >
            {empty ? (tu ? 'Ton message est vide.' : 'Le message est vide.') : text}
          </motion.div>
        )}
        <div className="mt-2 flex items-center justify-between px-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            {edited ? (
              <>
                <PencilLine className="size-3.5" aria-hidden /> {tu ? 'Modifié par toi' : 'Modifié par vous'}
              </>
            ) : (
              'Texte proposé, modifiable'
            )}
          </span>
          <span id={`${id}-count`} className="tabular-nums">
            {text.length} caractères
          </span>
        </div>
      </div>

      {empty && (
        <p id={`${id}-err`} role="alert" className="mt-3 flex items-start gap-2 text-sm text-danger-text">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {tu ? 'Écris quelques mots, ou reviens au texte proposé.' : 'Rédigez quelques mots, ou revenez au texte proposé.'}
        </p>
      )}

      {/* Actions */}
      <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
        <Button
          size="lg"
          onClick={copy}
          loading={busy}
          disabled={empty}
          icon={copied === 'ok' ? <Check className="size-5" aria-hidden /> : <Copy className="size-5" aria-hidden />}
        >
          <span className="hidden xs:inline">{copied === 'ok' ? 'Message copié' : 'Copier le message'}</span>
          <span className="xs:hidden">{copied === 'ok' ? 'Copié' : 'Copier'}</span>
        </Button>
        <Button
          size="lg"
          variant="secondary"
          onClick={() => setEditing((e) => !e)}
          aria-pressed={editing}
          icon={editing ? <Check className="size-5" aria-hidden /> : <PencilLine className="size-5" aria-hidden />}
        >
          <span className="hidden sm:inline">{editing ? 'Terminer' : 'Modifier'}</span>
          <span className="sr-only sm:hidden">{editing ? 'Terminer' : 'Modifier'}</span>
        </Button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {edited && (
          <Button variant="ghost" size="sm" onClick={onReset} icon={<RotateCcw className="size-4" aria-hidden />}>
            Revenir au texte proposé
          </Button>
        )}
        {canShare && !empty && (
          <Button variant="ghost" size="sm" onClick={share} icon={<Share2 className="size-4" aria-hidden />}>
            Partager…
          </Button>
        )}
      </div>

      {/* Confirmation / erreur de copie */}
      <div aria-live="polite">
        <AnimatePresence initial={false}>
          {copied !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {copied === 'ok' ? (
                <div className="mt-3 flex gap-3 rounded-xl bg-success-soft p-3.5">
                  <Check className="mt-0.5 size-5 shrink-0 text-success-text" aria-hidden />
                  <p className="text-sm text-fg">
                    <strong className="font-semibold">Copié dans le presse-papiers.</strong> {afterCopy}
                  </p>
                </div>
              ) : (
                <div className="mt-3 flex gap-3 rounded-xl bg-danger-soft p-3.5" role="alert">
                  <CircleAlert className="mt-0.5 size-5 shrink-0 text-danger-text" aria-hidden />
                  <p className="text-sm text-fg">
                    La copie automatique n’a pas fonctionné. Le texte est sélectionné : {tu ? 'utilise' : 'utilisez'} « Copier » de {tu ? 'ton' : 'votre'} appareil.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-4 flex items-center gap-2 border-t border-line pt-3.5 text-[0.8125rem] font-medium text-muted">
        <Lock className="size-4 shrink-0" aria-hidden />
        {safety}
      </p>
    </section>
  )
}
