import { useState } from 'react'
import { Trash2, ShieldCheck, LogOut, FlaskConical, ArrowRight, Check } from 'lucide-react'
import { useApp, useProgress } from '../state/AppState'
import { navigate } from '../lib/router'
import { storage } from '../lib/storage'
import { cn } from '../lib/utils'
import { SignalArcs } from '../components/art/Signal'
import { PageHeader, ThemeSelector, HelpLineCard } from '../components/ui/shared'
import { Badge, Card, EmptyState, SectionTitle, Switch } from '../components/ui/misc'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'

export default function Profile() {
  const { config, state, ps, dispatch } = useApp()
  const { byTrack, current, badges, done } = useProgress()
  const toast = useToast()
  const [confirm, setConfirm] = useState(false)
  const tu = config.address === 'tu'
  const earned = badges.filter((b) => b.isEarned).length

  const allMissions = Object.values(config.missions.tracks).flatMap((t) => t.missions)
  const doneMissions = allMissions.filter((m) => done.includes(m.id))

  const reset = () => {
    storage.clear()
    dispatch({ type: 'reset' })
    setConfirm(false)
    toast({ tone: 'success', title: 'Données effacées', text: 'La progression des deux espaces a été supprimée de cet appareil.' })
  }

  return (
    <div>
      <PageHeader eyebrow="Profil" title={tu ? 'Ton espace' : 'Votre espace'} />

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2 lg:gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {/* Identité + progression */}
        <div className="space-y-6">
          <section className="relative overflow-hidden rounded-[1.75rem] bg-ink p-6 text-ink-fg md:p-7" aria-labelledby="identity">
            <div className="flex items-center gap-5">
              <div className="w-28 shrink-0 rounded-2xl bg-white/[0.06] p-2.5 [--border:rgb(255_255_255/0.14)] [--text:#fff]">
                <SignalArcs total={current.total} done={current.done} label={`${current.done} sur ${current.total}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold tracking-[0.14em] uppercase opacity-70">{config.label} · {config.audience}</p>
                <h2 id="identity" className="mt-1 font-display text-[1.5rem] leading-tight">
                  {current.done}/{current.total} {config.missions.unit}
                </h2>
                <p className="text-sm opacity-75">{current.label}</p>
              </div>
            </div>
            <p className="mt-5 border-t border-white/15 pt-4 text-sm opacity-80">{config.profile.identity}</p>
          </section>

          <Card className="p-5">
            <SectionTitle
              action={
                <Button variant="ghost" size="sm" className="-mr-3" onClick={() => navigate('missions')} iconRight={<ArrowRight className="size-4" aria-hidden />}>
                  {tu ? 'Mes missions' : 'Mes réflexes'}
                </Button>
              }
            >
              {tu ? 'Progression' : 'Parcours en cours'}
            </SectionTitle>
            <ul className="space-y-4">
              {byTrack.map((t) => (
                <li key={t.track}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className={cn('font-semibold', t.track === ps.track ? 'text-fg' : 'text-muted')}>
                      {t.label}
                      {t.track === ps.track && <span className="ml-2 text-xs font-semibold text-accent-text">· en cours</span>}
                    </span>
                    <span className="text-muted tabular-nums">
                      {t.done}/{t.total}
                    </span>
                  </div>
                  <div className="flex gap-1" aria-hidden>
                    {Array.from({ length: t.total }, (_, i) => (
                      <span key={i} className={cn('h-2 flex-1 rounded-full transition-colors', i < t.done ? 'bg-accent' : 'bg-line')} />
                    ))}
                  </div>
                </li>
              ))}
            </ul>

            <h3 className="eyebrow mt-6 mb-3">{tu ? 'Ce que tu as déjà fait' : 'Étapes terminées'}</h3>
            {doneMissions.length === 0 ? (
              <EmptyState
                title={tu ? 'Pas encore de mission faite' : 'Aucune étape terminée'}
                text={tu ? 'Pas de pression : tes missions t’attendent, à ton rythme.' : 'Vos réflexes vous attendent, à votre rythme.'}
                action={
                  <Button variant="secondary" size="sm" onClick={() => navigate('missions')}>
                    {tu ? 'Voir les missions' : 'Voir les réflexes'}
                  </Button>
                }
              />
            ) : (
              <ul className="space-y-1.5">
                {doneMissions.map((m) => (
                  <li key={m.id} className="flex items-center gap-3 text-[0.9375rem] text-fg">
                    <span className="grid size-6 place-items-center rounded-full bg-success text-white">
                      <Check className="size-3.5" strokeWidth={3} aria-hidden />
                    </span>
                    {m.title}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-5">
            <SectionTitle action={<span className="text-xs font-semibold text-muted tabular-nums">{earned}/{badges.length}</span>}>
              {tu ? 'Badges' : 'Repères'}
            </SectionTitle>
            <ul className="grid grid-cols-2 gap-2.5 xs:grid-cols-3 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-5">
              {badges.map((b) => (
                <Badge key={b.id} icon={b.icon} label={b.label} description={b.description} earned={b.isEarned} />
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">
              {tu
                ? 'Les badges récompensent des actions utiles, jamais ce que tu racontes sur toi.'
                : 'Ces repères marquent des actions accomplies. Aucun ne dépend d’informations personnelles.'}
            </p>
          </Card>
        </div>

        {/* Préférences */}
        <div className="space-y-6">
          <Card className="p-5">
            <SectionTitle>Apparence</SectionTitle>
            <ThemeSelector />
            <p className="mt-2 text-xs text-muted">« Auto » suit le réglage de {tu ? 'ton' : 'votre'} appareil.</p>
          </Card>

          <Card className="p-5">
            <SectionTitle>Rappels</SectionTitle>
            <Switch
              id="reminders"
              checked={ps.reminders.enabled}
              onChange={(enabled) => dispatch({ type: 'reminders', value: { enabled } })}
              label={tu ? 'Me rappeler de reprendre' : 'Me rappeler de reprendre le plan'}
              description="Discret : le rappel n’affiche que « CyberAid », jamais le sujet."
            />
            {ps.reminders.enabled && (
              <div className="mt-2">
                <SegmentedControl<'3d' | '7d'>
                  label="Fréquence"
                  size="sm"
                  block
                  value={ps.reminders.cadence}
                  onChange={(cadence) => dispatch({ type: 'reminders', value: { cadence } })}
                  options={[
                    { value: '3d', label: 'Dans 3 jours' },
                    { value: '7d', label: 'Dans 1 semaine' },
                  ]}
                />
              </div>
            )}
            <p className="mt-3 flex items-start gap-2 rounded-xl bg-sunken p-3 text-xs text-muted">
              <FlaskConical className="mt-px size-3.5 shrink-0" aria-hidden />
              Démonstration : aucune notification n’est réellement programmée. Pas de série, pas de compteur quotidien.
            </p>
          </Card>

          <Card className="p-5">
            <SectionTitle>Confidentialité</SectionTitle>
            <p className="flex gap-2.5 text-sm text-fg">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success-text" aria-hidden />
              {config.profile.privacyNote}
            </p>
            <div className="mt-2 border-t border-line">
              <Switch
                id="remember"
                checked={state.remember}
                onChange={(value) => dispatch({ type: 'remember', value })}
                label="Mémoriser la progression sur cet appareil"
                description="Seules les missions faites sont gardées. Jamais les réponses ni les messages."
              />
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Button variant="secondary" size="sm" icon={<Trash2 className="size-4" aria-hidden />} onClick={() => setConfirm(true)}>
                Effacer mes données
              </Button>
            </div>
            <p className="mt-4 flex gap-2.5 text-[0.8125rem] text-muted">
              <LogOut className="mt-0.5 size-4 shrink-0" aria-hidden />« {config.labels.quickExit} » ouvre immédiatement une page neutre, sans retour possible vers CyberAid.
            </p>
          </Card>

          <section aria-labelledby="res">
            <h2 id="res" className="eyebrow mb-3">
              Ressources
            </h2>
            <div className="space-y-2.5">
              {config.helpLines.map((l, i) => (
                <HelpLineCard key={l.id} line={l} emphasis={i === 0} />
              ))}
            </div>
          </section>

          <p className="flex gap-2 rounded-2xl border border-dashed border-line-strong p-4 text-xs text-muted">
            <FlaskConical className="size-4 shrink-0" aria-hidden />
            Version de démonstration. CyberAid ne transmet aucune donnée : pas de serveur, pas de compte, pas d’envoi automatique.
          </p>
        </div>
      </div>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        role="alertdialog"
        size="sm"
        title="Effacer toutes les données ?"
        description="La progression des espaces Jeune et Parent sera supprimée de cet appareil. Cette action est définitive."
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirm(false)} data-autofocus>
              Annuler
            </Button>
            <Button variant="danger" onClick={reset} icon={<Trash2 className="size-4" aria-hidden />}>
              Effacer
            </Button>
          </>
        }
      />
    </div>
  )
}
