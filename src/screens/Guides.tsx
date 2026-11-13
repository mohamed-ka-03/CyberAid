import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Ban, Camera, EyeOff, Flag, Lightbulb, ShieldCheck, ShieldAlert } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useApp } from '../state/AppState'
import { navigate, useRouteParam } from '../lib/router'
import { cn } from '../lib/utils'
import { guideSectionLabels, platformGuides } from '../data/platforms'
import type { GuideSection } from '../data/types'
import { PageHeader } from '../components/ui/shared'
import { Card } from '../components/ui/misc'

const sectionIcons: Record<GuideSection['kind'], LucideIcon> = {
  block: Ban,
  report: Flag,
  protect: ShieldCheck,
}

export default function Guides() {
  const { config } = useApp()
  const tu = config.address === 'tu'
  const param = useRouteParam()
  const guide = platformGuides.find((g) => g.id === param) ?? platformGuides[0]

  const basics = [
    { icon: Camera, title: tu ? 'Capture d’abord' : 'Captures d’abord', text: 'Avant de bloquer ou de quitter un groupe : les messages peuvent ensuite disparaître.' },
    { icon: EyeOff, title: 'Personne n’est prévenu', text: 'Bloquer ou signaler un compte ne lui envoie aucune notification.' },
    { icon: Flag, title: 'Signaler est anonyme', text: 'La plateforme ne dit pas qui a fait le signalement.' },
  ]

  return (
    <div>
      <PageHeader eyebrow={config.guides.eyebrow} title={config.guides.title} intro={config.guides.intro} squiggle />

      <ul className="mb-8 grid gap-3 sm:grid-cols-3">
        {basics.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-3 rounded-2xl border border-line bg-surface p-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-text">
              <Icon className="size-[1.1rem]" aria-hidden />
            </span>
            <span>
              <span className="block text-[0.9375rem] font-semibold text-fg">{title}</span>
              <span className="block text-[0.8125rem] leading-snug text-muted">{text}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[16rem_minmax(0,1fr)]">
        <nav aria-label="Choisir une application" className="lg:sticky lg:top-12 lg:self-start">
          <p className="eyebrow mb-3">{tu ? 'Ton appli' : 'Application'}</p>
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-1">
            {platformGuides.map((g) => {
              const active = g.id === guide.id
              return (
                <li key={g.id}>
                  <button
                    type="button"
                    aria-current={active ? 'page' : undefined}
                    onClick={() => navigate('guides', g.id, { replace: true })}
                    className={cn(
                      'flex h-full min-h-12 w-full flex-col items-center justify-center gap-1 rounded-2xl border px-2 py-2.5 text-center transition-colors lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:text-left',
                      active ? 'border-accent bg-accent-soft text-accent-text' : 'border-line bg-surface text-fg hover:border-line-strong',
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-8 shrink-0 place-items-center rounded-lg font-display text-[0.9375rem]',
                        active ? 'bg-accent text-accent-fg' : 'bg-sunken text-muted',
                      )}
                      aria-hidden
                    >
                      {g.name[0]}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[0.8125rem] font-semibold lg:text-[0.9375rem]">{g.name}</span>
                      <span className="hidden text-xs text-muted lg:block">{g.kind}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={guide.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            aria-labelledby="guide-title"
            className="min-w-0 space-y-4"
          >
            <header>
              <h2 id="guide-title" className="font-display text-[1.75rem] leading-tight text-fg">
                {guide.name}
              </h2>
              <p className="text-[0.9375rem] text-muted">{guide.kind}</p>
            </header>

            <div className="grid gap-4 xl:grid-cols-2">
              {guide.sections.map((sec) => {
                const Icon = sectionIcons[sec.kind]
                return (
                  <Card key={sec.kind} as="section" className={cn('p-5', sec.kind === 'protect' && 'xl:col-span-2')}>
                    <h3 className="flex items-center gap-2.5 font-semibold text-fg">
                      <span className="grid size-8 place-items-center rounded-lg bg-accent-soft text-accent-text">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      {guideSectionLabels[sec.kind][config.id]}
                    </h3>
                    <ol className="mt-4 space-y-3">
                      {sec.steps.map((st, i) => (
                        <li key={st} className="flex gap-3">
                          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-sunken text-xs font-bold text-fg tabular-nums">
                            {i + 1}
                          </span>
                          <span className="text-[0.9375rem] text-fg">{st}</span>
                        </li>
                      ))}
                    </ol>
                  </Card>
                )
              })}
            </div>

            <Card className="p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-accent-text">
                <Lightbulb className="size-4" aria-hidden /> Bon à savoir
              </p>
              <ul className="mt-2 space-y-1.5">
                {guide.notes.map((n) => (
                  <li key={n} className="text-[0.9375rem] text-fg">
                    {n}
                  </li>
                ))}
              </ul>
            </Card>

            <div className="flex flex-col gap-3 rounded-2xl border border-line p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[0.8125rem] text-muted">
                Les noms des menus peuvent changer selon la version de l’appli.
              </p>
              <a
                href={guide.help}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 shrink-0 items-center gap-1.5 self-start rounded-full border border-line-strong px-4 text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent-text sm:self-auto"
              >
                Aide officielle {guide.name}
                <ArrowUpRight className="size-4" aria-hidden />
                <span className="sr-only">(nouvel onglet)</span>
              </a>
            </div>

            <div className="flex gap-3 rounded-2xl bg-warning-soft p-4">
              <ShieldAlert className="mt-0.5 size-5 shrink-0 text-warning-text" aria-hidden />
              <p className="text-[0.9375rem] text-fg">
                <strong className="font-semibold">{tu ? 'Contenu grave ou la plateforme ne fait rien ?' : 'Contenu grave ou plateforme inactive ?'}</strong>{' '}
                Le 3018 peut faire supprimer des contenus rapidement. Les contenus illégaux se signalent aussi sur{' '}
                <a
                  href="https://www.internet-signalement.gouv.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-fg underline decoration-1 underline-offset-2"
                >
                  internet-signalement.gouv.fr
                </a>
                .
              </p>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  )
}
