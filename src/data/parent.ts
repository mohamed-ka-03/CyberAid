import { Ear, Compass, FolderLock, Send, ListChecks, Building2, UserRound, GraduationCap, MessageCircleHeart } from 'lucide-react'
import type { ProfileConfig } from './types'
import { LINE_112, LINE_3018, LINE_3020 } from './helpLines'
import { parentScenarios } from './scenarios'
import { capitalize, placeText, sentences, sinceText } from '../lib/text'

export const parentProfile: ProfileConfig = {
  id: 'parent',
  label: 'Parent',
  audience: 'Adulte',
  address: 'vous',

  home: {
    eyebrow: 'Espace parent',
    title: 'Votre enfant est-il concerné ?',
    intro: 'Vous n’avez pas besoin de tout savoir pour agir. Commencez par ce qui correspond à votre situation : nous avançons une étape à la fois.',
    entries: [
      {
        context: 'target',
        title: 'Mon enfant est victime',
        description: 'Il ou elle reçoit des messages blessants',
        art: 'target',
        action: 'checkup',
      },
      {
        context: 'witness',
        title: 'Mon enfant est témoin',
        description: 'Il ou elle voit un·e camarade harcelé·e',
        art: 'witness',
        action: 'learn',
      },
      {
        context: 'understand',
        title: 'J’ai un doute',
        description: 'Repérer les signes et comprendre',
        art: 'understand',
        action: 'checkup',
      },
    ],
    learn: [
      {
        context: 'witness',
        eyebrow: 'Votre enfant est témoin',
        title: 'Son rôle peut tout changer — sans se mettre en danger',
        points: [
          {
            title: 'Être témoin, c’est aussi difficile',
            text: 'Votre enfant peut ressentir de la peur, de la culpabilité ou craindre de devenir la prochaine cible. Commencez par l’écouter.',
          },
          {
            title: 'Ne pas relayer, soutenir en privé',
            text: 'Ne pas liker, ne pas partager, et éventuellement envoyer un message de soutien privé à la personne visée.',
          },
          {
            title: 'Protéger son anonymat',
            text: 'L’établissement peut être informé sans exposer votre enfant. Il ne doit jamais confronter les auteurs.',
          },
        ],
        primary: { label: 'Voir les réflexes « témoin »', to: 'missions', track: 'witness' },
        secondary: { label: 'Faire le check-up', to: 'checkup' },
      },
    ],
    promise: {
      title: 'Accompagner, pas surveiller.',
      text: 'CyberAid vous aide à comprendre, à poser les bons gestes et à dialoguer avec votre enfant et l’établissement. Rien n’est décidé à votre place, ni à la sienne.',
    },
    steps: [
      { title: 'Repérer', text: '4 questions sur les signes observés' },
      { title: 'Accompagner', text: '5 réflexes, dans l’ordre qui vous convient' },
      { title: 'Échanger', text: 'Un message structuré pour l’établissement' },
    ],
    tip: {
      title: 'Réflexe clé',
      text: 'Évitez de confisquer le téléphone : beaucoup d’enfants se taisent par peur de perdre leur accès.',
    },
  },

  checkup: {
    title: 'Repérer les signes',
    intro: '4 questions sur ce que vous observez. Comptez une minute environ.',
    privacy: 'Vos réponses restent sur cet écran : elles ne sont ni enregistrées ni transmises.',
    disclaimer: 'Ce check-up n’établit pas de diagnostic. Il vous aide à décider des prochaines étapes.',
    questions: [
      {
        id: 'avoid',
        title: 'Votre enfant évite-t-il son téléphone ou l’école ?',
        options: [
          { id: 'often', label: 'Oui, nettement', weight: 2 },
          { id: 'some', label: 'Un peu', weight: 1 },
          { id: 'no', label: 'Non', weight: 0 },
          { id: 'unsure', label: 'Je ne sais pas', weight: 1 },
        ],
        tip: {
          title: 'Le saviez-vous ?',
          text: 'Repli, humeur qui change, sommeil perturbé : ce sont des signes possibles, pas des preuves. Chaque enfant réagit différemment.',
        },
      },
      {
        id: 'changes',
        title: 'Avez-vous remarqué des changements récents ?',
        helper: 'Plusieurs réponses possibles.',
        multi: true,
        options: [
          { id: 'sleep', label: 'Sommeil perturbé', weight: 1 },
          { id: 'mood', label: 'Humeur, irritabilité', weight: 1 },
          { id: 'isolation', label: 'Repli, isolement', weight: 1 },
          { id: 'grades', label: 'Baisse des résultats', weight: 1 },
          { id: 'none', label: 'Rien de particulier', exclusive: true, weight: 0 },
        ],
        tip: {
          title: 'À retenir',
          text: 'Ces changements peuvent avoir d’autres causes. L’essentiel est d’ouvrir le dialogue, sans interrogatoire.',
        },
      },
      {
        id: 'talk',
        title: 'Votre enfant vous en a-t-il parlé ?',
        options: [
          { id: 'yes', label: 'Oui, ouvertement', weight: 1 },
          { id: 'hints', label: 'Par quelques allusions', weight: 1 },
          { id: 'no', label: 'Non, pas encore', weight: 1 },
          { id: 'how', label: 'Je ne sais pas comment aborder le sujet', weight: 1 },
        ],
        tip: {
          title: 'Conseil',
          text: 'Choisissez un moment calme, sans écran. Une question ouverte (« Comment ça se passe avec ta classe en ce moment ? ») vaut mieux qu’un interrogatoire.',
        },
      },
      {
        id: 'seen',
        title: 'Avez-vous connaissance de messages ou contenus blessants ?',
        options: [
          { id: 'shown', label: 'Oui, mon enfant me les a montrés', weight: 2 },
          { id: 'heard', label: 'J’en ai entendu parler', weight: 1 },
          { id: 'no', label: 'Non', weight: 0 },
        ],
        tip: {
          title: 'Si vous avez vu des messages',
          text: 'Remerciez votre enfant de vous les avoir montrés. Faites des captures (date, auteur, contexte), sans répondre à l’auteur.',
        },
      },
    ],
    outcome: (answers) => {
      const weightOf: Record<string, Record<string, number>> = {
        avoid: { often: 2, some: 1, unsure: 1 },
        seen: { shown: 2, heard: 1 },
      }
      const changes = (answers.changes ?? []).filter((c) => c !== 'none').length
      const score = (weightOf.avoid[answers.avoid?.[0]] ?? 0) + (weightOf.seen[answers.seen?.[0]] ?? 0) + changes
      if (answers.seen?.includes('shown') && answers.avoid?.includes('often'))
        return {
          level: 'support',
          title: 'La situation semble installée. Vous n’êtes pas seul·e.',
          text: 'Le 3018 (gratuit, anonyme) peut vous conseiller dès aujourd’hui et faire supprimer des contenus. Conservez les preuves et préparez un message pour l’établissement.',
        }
      if (score >= 3)
        return {
          level: 'attention',
          title: 'Plusieurs signaux méritent votre attention.',
          text: 'Ce que vous observez justifie d’ouvrir le dialogue avec votre enfant, puis, si besoin, avec l’établissement. Vos 5 réflexes vous guident pas à pas.',
        }
      return {
        level: 'calm',
        title: 'Peu de signaux pour l’instant.',
        text: 'Restez disponible et attentif·ve. Les réflexes ci-dessous vous aident à aborder le sujet sereinement, sans inquiéter votre enfant.',
      }
    },
  },

  situations: {
    eyebrow: 'Mises en situation',
    title: 'Et vous, que feriez-vous ?',
    intro: 'Des situations fréquentes, pour vous préparer à réagir. Chaque choix est expliqué, sans jugement. Rien n’est enregistré.',
    scenarios: parentScenarios,
  },

  guides: {
    eyebrow: 'Guides des applis',
    title: 'Bloquer, signaler, protéger le compte',
    intro: 'Les réglages essentiels des applis les plus utilisées par les ados, à parcourir avec votre enfant plutôt qu’à sa place.',
  },

  missions: {
    eyebrow: 'Plan d’accompagnement',
    title: 'Vos 5 réflexes',
    intro: 'Des gestes concrets pour accompagner votre enfant. Chaque étape peut être annulée ou reprise plus tard.',
    unit: 'étapes',
    doneAll: 'Votre plan est complet. Vous pouvez y revenir à tout moment.',
    tracks: {
      target: {
        label: 'Enfant victime',
        missions: [
          {
            id: 'p-listen',
            title: 'Écouter sans juger',
            summary: 'Accueillir la parole de votre enfant avant tout.',
            why: 'Un enfant qui se sent jugé risque de se refermer. Votre calme lui montre qu’il peut compter sur vous.',
            steps: ['Choisir un moment calme, sans écran', 'Laisser parler sans interrompre ni minimiser', 'Le remercier de s’être confié'],
            feedback: 'Votre écoute est la première protection de votre enfant.',
          },
          {
            id: 'p-blame',
            title: 'Ne pas culpabiliser',
            summary: 'Rappeler que ce n’est pas sa faute.',
            why: 'La honte est un frein majeur. Confisquer le téléphone peut être vécu comme une punition et dissuader de parler à nouveau.',
            steps: ['Dire clairement : « Ce n’est pas ta faute »', 'Éviter de confisquer le téléphone par réflexe', 'Décider des prochaines étapes ensemble'],
            feedback: 'Votre enfant sait maintenant qu’il peut revenir vers vous.',
          },
          {
            id: 'p-proof',
            title: 'Garder les preuves',
            summary: 'Conserver des traces datées.',
            why: 'Captures, liens et noms de comptes seront utiles pour l’établissement, les plateformes ou un éventuel dépôt de plainte.',
            steps: ['Faire des captures avec la date, l’heure et l’auteur', 'Noter les liens (URL) des publications', 'Sauvegarder le tout hors du téléphone de l’enfant'],
            caution:
              'Ne conservez ni ne transférez d’images intimes de mineurs, même comme preuve : signalez-les au 3018 ou sur internet-signalement.gouv.fr.',
            feedback: 'Les preuves sont en sécurité. Elles appuieront chaque démarche.',
          },
          {
            id: 'p-reply',
            title: 'Ne pas répondre à l’agresseur',
            summary: 'Ne pas intervenir directement en ligne ni auprès de l’auteur.',
            why: 'Une confrontation peut aggraver la situation pour votre enfant. Passez par l’établissement et les canaux officiels.',
            steps: ['Ne pas répondre aux messages', 'Ne pas contacter l’auteur ou sa famille directement', 'Signaler les contenus sur la plateforme'],
            guide: true,
            feedback: 'Vous protégez votre enfant en évitant l’escalade.',
          },
          {
            id: 'p-school',
            title: 'Prévenir l’établissement',
            summary: 'Informer le collège pour qu’il puisse agir.',
            why: 'L’établissement peut agir lorsque la situation implique des élèves, même si elle se déroule en ligne ou hors des cours.',
            steps: ['Contacter le ou la CPE, ou le professeur principal', 'Demander un rendez-vous', 'Préparer un message factuel (onglet Message)'],
            feedback: 'L’établissement peut désormais vous accompagner. Notez la date de votre échange.',
          },
        ],
      },
      witness: {
        label: 'Enfant témoin',
        missions: [
          {
            id: 'p-w-value',
            title: 'Valoriser sa démarche',
            summary: 'Votre enfant a bien fait de vous en parler.',
            why: 'Les témoins se taisent souvent par peur d’être exposés. Votre reconnaissance l’encourage à rester attentif.',
            steps: ['Le remercier de vous en avoir parlé', 'Lui demander comment il ou elle se sent', 'Le rassurer : il n’est pas responsable'],
            feedback: 'Votre enfant sait que sa parole compte.',
          },
          {
            id: 'p-w-relay',
            title: 'L’aider à ne pas relayer',
            summary: 'Ne pas liker, ne pas partager, ne pas commenter.',
            why: 'Le public alimente le harcèlement. Ne pas relayer, c’est déjà agir.',
            steps: ['Expliquer pourquoi le partage aggrave la situation', 'Proposer de quitter le groupe si besoin', 'Rappeler que relayer peut aussi être sanctionné'],
            feedback: 'Un relais de moins, c’est une attaque qui perd de sa force.',
          },
          {
            id: 'p-w-support',
            title: 'Encourager un soutien discret',
            summary: 'Un message privé à la personne visée peut beaucoup.',
            why: 'Se sentir soutenu·e réduit l’isolement de la victime, sans exposer votre enfant.',
            steps: ['Suggérer un message privé bienveillant', 'Ne pas l’obliger s’il ou elle ne le souhaite pas', 'Rester disponible pour en reparler'],
            caution: 'Votre enfant ne doit ni confronter les auteurs, ni répondre à leur place.',
            feedback: 'Votre enfant aide, en restant en sécurité.',
          },
          {
            id: 'p-w-report',
            title: 'Signaler ensemble',
            summary: 'Le signalement sur les plateformes est anonyme.',
            why: 'Les plateformes peuvent supprimer les contenus et suspendre les comptes.',
            steps: ['Repérer le bouton « Signaler » ensemble', 'Choisir le motif « Harcèlement »', 'En cas de contenu grave : 3018 ou internet-signalement.gouv.fr'],
            guide: true,
            feedback: 'Le contenu est signalé. La plateforme doit maintenant l’examiner.',
          },
          {
            id: 'p-w-school',
            title: 'Informer l’établissement',
            summary: 'Discrètement, en protégeant votre enfant.',
            why: 'L’établissement peut protéger la personne visée. Vous pouvez demander que le nom de votre enfant ne soit pas cité.',
            steps: ['Contacter le ou la CPE', 'Demander la discrétion sur l’origine de l’information', 'Préparer un message factuel (onglet Message)'],
            feedback: 'L’établissement est informé. Votre enfant a contribué à protéger un camarade.',
          },
        ],
      },
    },
  },

  message: {
    eyebrow: 'Message d’aide',
    title: 'Préparez votre message',
    intro: 'Choisissez le destinataire : le ton et la formulation s’adaptent. Tout reste modifiable.',
    defaultRecipient: 'school',
    aboutLabels: { me: 'Enfant visé·e', other: 'Enfant témoin' },
    safety: 'Rien n’est envoyé. Vous décidez du moment et du canal.',
    afterCopy: 'Collez-le dans votre messagerie, l’ENT ou un e-mail, quand vous le souhaitez.',
    recipients: [
      {
        id: 'school',
        label: 'CPE',
        description: 'Vie scolaire',
        icon: UserRound,
        build: ({ about, since, place, evidence }) =>
          about === 'me'
            ? sentences(
                `Bonjour, mon enfant reçoit ${sinceText[since]} des messages blessants ${placeText[place]}.`,
                evidence && 'Nous avons conservé les captures.',
                'Pourrions-nous échanger sur la situation et les mesures possibles ?',
              )
            : sentences(
                `Bonjour, mon enfant m’a fait part de messages blessants visant un·e élève de sa classe, ${placeText[place]}, ${sinceText[since]}.`,
                evidence && 'Des captures ont été conservées.',
                'Il nous semblait important de vous en informer. Pourrions-nous en parler, en préservant la discrétion de mon enfant ?',
              ),
      },
      {
        id: 'teacher',
        label: 'Prof principal·e',
        description: 'Suivi de la classe',
        icon: GraduationCap,
        build: ({ about, since, place, evidence }) =>
          about === 'me'
            ? sentences(
                `Bonjour, je me permets de vous écrire car mon enfant est la cible de messages blessants ${placeText[place]}, ${sinceText[since]}.`,
                evidence && 'Nous avons conservé des captures.',
                'Auriez-vous remarqué quelque chose en classe ? Je souhaiterais en parler avec vous.',
              )
            : sentences(
                `Bonjour, mon enfant a été témoin de messages blessants visant un·e camarade ${placeText[place]}, ${sinceText[since]}.`,
                'Je préférais vous en informer, en vous demandant de préserver la discrétion de mon enfant.',
              ),
      },
      {
        id: 'direction',
        label: 'Direction',
        description: 'Du collège',
        icon: Building2,
        build: ({ about, since, place, evidence }) =>
          about === 'me'
            ? sentences(
                'Madame, Monsieur,',
                `je souhaite porter à votre attention une situation qui concerne mon enfant. ${capitalize(sinceText[since])}, il ou elle reçoit des messages blessants ${placeText[place]}.`,
                evidence && 'Nous avons conservé des captures datées, que je peux vous transmettre.',
                'Je souhaiterais convenir d’un rendez-vous afin d’échanger sur la situation et les mesures envisageables.',
                'Je vous prie d’agréer mes salutations distinguées.',
              )
            : sentences(
                'Madame, Monsieur,',
                `mon enfant a été témoin de messages blessants visant un·e élève de l’établissement, ${placeText[place]}, ${sinceText[since]}.`,
                evidence && 'Des captures ont été conservées.',
                'Je tenais à vous en informer et vous remercie de préserver la discrétion de mon enfant.',
                'Je vous prie d’agréer mes salutations distinguées.',
              ),
      },
      {
        id: 'child',
        label: 'Mon enfant',
        description: 'Ouvrir le dialogue',
        icon: MessageCircleHeart,
        build: ({ about }) =>
          about === 'me'
            ? 'J’ai l’impression que quelque chose te pèse en ce moment. Tu n’as rien fait de mal, et tu ne seras pas puni·e. Si tu veux en parler, je suis là. On décidera ensemble de la suite : rien ne se fera sans toi.'
            : 'Merci de m’avoir parlé de ce qui arrive à quelqu’un de ta classe. Tu as bien fait. On peut réfléchir ensemble à comment l’aider, sans te mettre en difficulté.',
      },
    ],
  },

  profile: {
    title: 'Espace',
    identity: 'Aucune information personnelle n’est demandée. Votre progression reste sur cet appareil.',
    privacyNote: 'L’espace Parent ne donne accès à aucune réponse de l’espace Jeune. Les deux parcours sont séparés.',
    badges: [
      { id: 'plan', label: 'Plan lancé', description: 'Première étape réalisée', icon: ListChecks, earned: (p) => p.done.length >= 1 },
      { id: 'listen', label: 'Écoute', description: 'Écouter sans juger', icon: Ear, earned: (p) => p.done.includes('p-listen') || p.done.includes('p-w-value') },
      { id: 'proof', label: 'Preuves gardées', description: 'Traces conservées', icon: FolderLock, earned: (p) => p.done.includes('p-proof') },
      { id: 'message', label: 'Message prêt', description: 'Un message préparé', icon: Send, earned: (p) => p.messageCopied },
      { id: 'all', label: 'Plan complet', description: 'Les 5 réflexes d’un parcours', icon: Compass, earned: (p) => p.tracksComplete >= 1 },
    ],
  },

  helpLines: [LINE_3018, LINE_3020, LINE_112],

  labels: {
    nav: { home: 'Accueil', checkup: 'Check-up', missions: 'Réflexes', message: 'Message', profile: 'Espace', situations: 'Situations', guides: 'Guides applis' },
    quickExit: 'Quitter vite',
    continue: 'Continuer',
    back: 'Retour',
    leave: 'Quitter',
  },
}
