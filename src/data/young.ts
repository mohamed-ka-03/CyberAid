import { Footprints, Wind, FolderLock, Send, HeartHandshake, GraduationCap, Stethoscope, Waves } from 'lucide-react'
import type { ProfileConfig } from './types'
import { LINE_112, LINE_119, LINE_3018 } from './helpLines'
import { youngScenarios } from './scenarios'
import { capitalize, placeText, sentences, sinceText } from '../lib/text'

export const youngProfile: ProfileConfig = {
  id: 'young',
  label: 'Jeune',
  audience: '11–15 ans',
  address: 'tu',

  home: {
    eyebrow: 'Ton espace',
    title: 'Qu’est-ce qui se passe ?',
    intro: 'Choisis ce qui te ressemble le plus. Rien n’est enregistré, et tu peux t’arrêter quand tu veux.',
    entries: [
      {
        context: 'target',
        title: 'Je suis visé·e',
        description: 'Des messages ou des contenus me visent',
        art: 'target',
        action: 'checkup',
      },
      {
        context: 'witness',
        title: 'Je vois ça arriver',
        description: 'Quelqu’un d’autre est visé·e',
        art: 'witness',
        action: 'checkup',
      },
      {
        context: 'understand',
        title: 'Je veux comprendre',
        description: 'Repérer les signes, savoir quoi faire',
        art: 'understand',
        action: 'learn',
      },
    ],
    learn: [
      {
        context: 'understand',
        eyebrow: 'Comprendre',
        title: 'Le cyberharcèlement, c’est quoi ?',
        points: [
          {
            title: 'Des attaques qui se répètent',
            text: 'Moqueries, insultes, rumeurs, mise à l’écart, photos partagées sans accord… en ligne, et souvent contre la même personne.',
          },
          {
            title: 'Ce n’est jamais la faute de la personne visée',
            text: 'Personne ne « mérite » ça, peu importe ce qu’on raconte sur elle.',
          },
          {
            title: 'C’est interdit par la loi',
            text: 'Même entre ados, et même quand on se contente de relayer ou de liker.',
          },
          {
            title: 'Il existe de l’aide',
            text: 'Le 3018 est gratuit et anonyme. Il peut même faire supprimer des contenus.',
          },
        ],
        primary: { label: 'Faire le check-up', to: 'checkup' },
        secondary: { label: 'Voir les bons réflexes', to: 'missions', track: 'target' },
      },
    ],
    promise: {
      title: 'CyberAid ne décide pas à ta place.',
      text: 'On t’aide à comprendre ce qui se passe, à choisir tes prochaines étapes et à trouver quelqu’un à qui parler.',
    },
    steps: [
      { title: 'Comprendre', text: '4 questions pour faire le point' },
      { title: 'Agir', text: '5 réflexes, à ton rythme' },
      { title: 'En parler', text: 'Un message prêt, que tu modifies' },
    ],
    tip: {
      title: 'Le savais-tu ?',
      text: 'Bloquer un compte ne prévient pas la personne. Tu peux le faire en toute discrétion.',
    },
  },

  checkup: {
    title: 'Faire le point',
    intro: '4 questions, environ une minute. Il n’y a pas de bonne ou de mauvaise réponse.',
    privacy: 'Tes réponses restent sur cet écran : elles ne sont ni enregistrées ni envoyées.',
    disclaimer: 'Ce check-up ne pose pas de diagnostic. Il t’aide juste à y voir plus clair.',
    questions: [
      {
        id: 'repeat',
        title: 'Ça se répète contre la même personne ?',
        titleByContext: { witness: 'Ça vise souvent la même personne ?' },
        options: [
          { id: 'yes', label: 'Oui, plusieurs fois', weight: 2 },
          { id: 'once', label: 'Non, une seule fois', hint: 'Même une seule fois, ça peut faire mal.', weight: 0 },
          { id: 'unsure', label: 'Je ne sais pas', weight: 1 },
        ],
        tip: {
          title: 'Le savais-tu ?',
          text: 'Une « blague » qui revient toujours contre la même personne, ce n’est plus une blague.',
        },
      },
      {
        id: 'place',
        title: 'Où est-ce que ça se passe ?',
        helper: 'Plusieurs réponses possibles.',
        multi: true,
        options: [
          { id: 'class-group', label: 'Un groupe de classe', weight: 1 },
          { id: 'social', label: 'Un réseau social', weight: 1 },
          { id: 'game', label: 'Un jeu en ligne', weight: 1 },
          { id: 'private', label: 'Des messages privés', weight: 1 },
          { id: 'skip', label: 'Je préfère ne pas dire', exclusive: true },
        ],
        tip: {
          title: 'Bon à savoir',
          text: 'Où que ce soit, tu peux garder des captures et signaler le contenu directement dans l’appli.',
        },
      },
      {
        id: 'feeling',
        title: 'Et toi, comment tu te sens quand tu y penses ?',
        titleByContext: { witness: 'Et toi, comment tu te sens face à ça ?' },
        options: [
          { id: 'ok', label: 'Ça va, je gère', weight: 0 },
          { id: 'uneasy', label: 'Mal à l’aise', weight: 1 },
          { id: 'heavy', label: 'Ça me pèse beaucoup', weight: 2, distress: true },
          { id: 'skip', label: 'Je préfère ne pas répondre', weight: 0 },
        ],
        tip: {
          title: 'Ce que tu ressens compte',
          text: 'Colère, honte, peur… tout ça est normal. Et ce n’est jamais de ta faute.',
        },
      },
      {
        id: 'told',
        title: 'Quelqu’un est au courant ?',
        options: [
          { id: 'adult', label: 'Oui, un adulte', weight: 0 },
          { id: 'friend', label: 'Un·e ami·e', weight: 1 },
          { id: 'nobody', label: 'Personne pour l’instant', weight: 2 },
          { id: 'skip', label: 'Je préfère ne pas répondre', weight: 1 },
        ],
        tip: {
          title: 'Le savais-tu ?',
          text: 'Parler à un adulte de confiance, ce n’est pas « balancer ». C’est se protéger — ou protéger quelqu’un.',
        },
      },
    ],
    outcome: (answers, context) => {
      const witness = context === 'witness'
      const heavy = answers.feeling?.includes('heavy')
      const repeat = answers.repeat?.includes('yes')
      const alone = answers.told?.includes('nobody')
      if (heavy)
        return {
          level: 'support',
          title: 'Tu n’as pas à porter ça seul·e.',
          text: 'Ce que tu décris a l’air lourd. Tu peux en parler dès maintenant au 3018, gratuitement et sans donner ton nom. Et quand tu te sens prêt·e, on peut préparer ensemble un message pour un adulte de confiance.',
        }
      if (repeat || alone)
        return {
          level: 'attention',
          title: witness ? 'Ce que tu as vu mérite qu’on s’en occupe.' : 'Ce que tu vis mérite qu’on s’en occupe.',
          text: witness
            ? 'Quand ça se répète, la personne visée a besoin que quelqu’un réagisse. Tu peux l’aider sans te mettre en danger : tes réflexes de témoin te guident pas à pas.'
            : 'Quand ça se répète, ce n’est pas à toi de gérer seul·e. Les bons réflexes t’aident à reprendre la main, une étape à la fois.',
        }
      return {
        level: 'calm',
        title: 'Tu as bien fait de faire le point.',
        text: 'Pour l’instant, ça ne ressemble pas à une situation qui se répète. Garde les bons réflexes en tête et reviens quand tu veux si ça change.',
      }
    },
  },

  situations: {
    eyebrow: 'Mises en situation',
    title: 'Et toi, tu ferais quoi ?',
    intro: 'Des situations inspirées de la vraie vie. Choisis ta réaction et découvre ce qui pourrait se passer. Il n’y a pas de note, et rien n’est enregistré.',
    scenarios: youngScenarios,
  },

  guides: {
    eyebrow: 'Guides des applis',
    title: 'Bloquer, signaler, se protéger',
    intro: 'Choisis ton appli : on te montre où appuyer, étape par étape. Pense à faire tes captures avant de bloquer.',
  },

  missions: {
    eyebrow: 'Kit de réflexes',
    title: 'Tes 5 missions',
    intro: 'Des actions concrètes, à faire dans l’ordre que tu veux. Tu peux revenir en arrière à tout moment.',
    unit: 'réflexes',
    doneAll: 'Tu as tous les réflexes en main. Tu peux les revoir quand tu veux.',
    tracks: {
      target: {
        label: 'Je suis visé·e',
        missions: [
          {
            id: 'y-calm',
            title: 'Ne réponds pas à chaud',
            summary: 'Prends du recul avant de réagir.',
            why: 'Répondre sous le coup de la colère peut relancer les attaques, ou être retourné contre toi.',
            steps: ['Pose ton téléphone quelques minutes', 'Éloigne-toi de l’écran et respire', 'Ne réponds pas aux messages qui te visent'],
            feedback: 'Prendre du recul, c’est déjà reprendre la main.',
          },
          {
            id: 'y-screens',
            title: 'Fais des captures d’écran',
            summary: 'Garde des traces de ce qui se passe.',
            why: 'Les captures servent de preuves si tu en parles à un adulte, au collège ou au 3018.',
            steps: [
              'Capture les messages avec la date et le nom du compte',
              'Range-les dans un dossier à part',
              'Ne les montre qu’à un adulte de confiance',
            ],
            caution:
              'Si une photo intime circule, ne la garde pas et ne la partage pas : parles-en à un adulte ou au 3018, qui peut la faire retirer.',
            feedback: 'Tes preuves sont à l’abri. Tu les montreras quand tu le décideras.',
          },
          {
            id: 'y-forward',
            title: 'Ne transfère rien',
            summary: 'Ne fais pas circuler les messages ou les images.',
            why: 'Chaque partage fait grossir la situation, même pour « montrer » à un·e ami·e.',
            steps: ['Ne transfère pas les messages blessants', 'Ne commente pas, ne like pas', 'Si on t’en envoie, ne les fais pas suivre'],
            feedback: 'En ne transférant rien, tu empêches que ça se propage.',
          },
          {
            id: 'y-block',
            title: 'Bloque ou signale le compte',
            summary: 'Protège-toi directement dans l’appli.',
            why: 'Bloquer coupe le contact, signaler alerte la plateforme. La personne n’est pas prévenue.',
            steps: ['Fais tes captures avant de bloquer', 'Utilise « Signaler » sur le message ou le profil', 'Bloque le compte si tu le souhaites'],
            guide: true,
            feedback: 'Tu as posé une limite. Tu pourras toujours la retirer dans les réglages de l’appli.',
          },
          {
            id: 'y-adult',
            title: 'Préviens un adulte de confiance',
            summary: 'Tu n’as pas à gérer ça seul·e.',
            why: 'Un adulte peut agir là où toi tu ne peux pas : collège, plateformes, et si besoin la police.',
            steps: [
              'Choisis une personne avec qui tu te sens à l’aise',
              'Prépare ce que tu veux dire, l’onglet Message peut t’aider',
              'Montre-lui tes captures si tu veux',
            ],
            feedback: 'En parler, c’est courageux. Tu viens de faire un vrai pas.',
          },
        ],
      },
      witness: {
        label: 'Je suis témoin',
        missions: [
          {
            id: 'y-w-share',
            title: 'Ne like pas, ne partage pas',
            summary: 'Ne donne pas de visibilité à ce qui blesse.',
            why: 'Le harcèlement grossit avec son public. Ne pas réagir, c’est déjà lui retirer du poids.',
            steps: ['Ne like pas et ne commente pas', 'Ne transfère ni messages ni images', 'Quitte le groupe si tu te sens mal à l’aise'],
            feedback: 'Un public en moins, c’est une attaque qui perd de sa force.',
          },
          {
            id: 'y-w-support',
            title: 'Montre ton soutien en privé',
            summary: 'Un message peut tout changer pour la personne visée.',
            why: 'Se sentir seul·e, c’est le plus dur. Savoir que quelqu’un est de son côté aide énormément.',
            steps: ['Écris-lui en privé, pas dans le groupe', 'Par exemple : « Je trouve ça pas ok. Je suis là si tu veux. »', 'Ne la pousse pas à répondre'],
            caution: 'Ne confronte pas les auteurs et ne réponds pas à leur place : ça pourrait se retourner contre toi.',
            feedback: 'Ton soutien compte plus que tu ne le penses.',
          },
          {
            id: 'y-w-proof',
            title: 'Garde une trace',
            summary: 'Des captures peuvent aider un adulte à agir.',
            why: 'Les messages peuvent être supprimés. Tes captures permettent de montrer ce qui s’est passé.',
            steps: ['Capture avec la date et le nom du compte', 'Garde-les pour toi', 'Montre-les seulement à un adulte de confiance'],
            caution: 'Si une photo intime circule, ne la garde pas : parles-en à un adulte ou au 3018.',
            feedback: 'Ces traces pourront aider la personne visée, quand un adulte s’en occupera.',
          },
          {
            id: 'y-w-report',
            title: 'Signale le contenu',
            summary: 'Le signalement est anonyme.',
            why: 'Les plateformes peuvent supprimer les contenus et suspendre les comptes. Personne ne saura que c’est toi.',
            steps: ['Appuie sur « Signaler » sur le message ou la publication', 'Choisis « Harcèlement »', 'Tu peux aussi signaler au 3018'],
            guide: true,
            feedback: 'Signalé. C’est maintenant à la plateforme d’agir.',
          },
          {
            id: 'y-w-adult',
            title: 'Parles-en à un adulte',
            summary: 'Ce n’est pas « balancer », c’est aider.',
            why: 'Un adulte peut protéger la personne visée, et toi aussi, sans que ton nom circule.',
            steps: ['Choisis un adulte en qui tu as confiance', 'Explique ce que tu as vu, simplement', 'Demande-lui de garder ton nom pour lui si tu préfères'],
            feedback: 'Tu as fait ce qu’il fallait. La suite n’est plus sur tes épaules.',
          },
        ],
      },
    },
  },

  message: {
    eyebrow: 'Message d’aide',
    title: 'Prépare ton message',
    intro: 'Choisis à qui tu écris. Le texte s’adapte, et tu peux tout modifier.',
    defaultRecipient: 'school',
    aboutLabels: { me: 'Pour moi', other: 'Pour quelqu’un d’autre' },
    safety: 'Rien n’est envoyé. C’est toi qui décides quand, et à qui.',
    afterCopy: 'Colle-le dans l’appli de ton choix, quand tu te sens prêt·e.',
    recipients: [
      {
        id: 'school',
        label: 'CPE / prof',
        description: 'Au collège',
        icon: GraduationCap,
        build: ({ about, since, place, evidence }) =>
          about === 'me'
            ? sentences(
                `Bonjour, ${sinceText[since]}, des messages me mettent mal à l’aise ${placeText[place]}.`,
                evidence && 'J’ai gardé des captures.',
                'Est-ce qu’on pourrait en parler ?',
              )
            : sentences(
                `Bonjour, ${sinceText[since]}, un·e élève de ma classe reçoit des messages blessants ${placeText[place]}.`,
                evidence && 'J’ai gardé des captures.',
                'Je préfère vous en parler. Est-ce qu’on pourrait en discuter, discrètement ?',
              ),
      },
      {
        id: 'adult',
        label: 'Un parent',
        description: 'Ou un adulte de confiance',
        icon: HeartHandshake,
        build: ({ about, since, place, evidence }) =>
          about === 'me'
            ? sentences(
                `Est-ce que je peux te parler de quelque chose ? ${capitalize(sinceText[since])}, je reçois des messages qui me font du mal ${placeText[place]}.`,
                evidence && 'J’ai gardé des captures.',
                'J’aimerais qu’on en parle calmement. Je ne sais pas trop quoi faire.',
              )
            : sentences(
                `Est-ce que je peux te parler de quelque chose ? ${capitalize(sinceText[since])}, quelqu’un de ma classe reçoit des messages blessants ${placeText[place]}.`,
                evidence && 'J’ai gardé des captures.',
                'Je voudrais l’aider, mais je ne sais pas comment faire.',
              ),
      },
      {
        id: 'nurse',
        label: 'Infirmier·e',
        description: 'Écoute confidentielle',
        icon: Stethoscope,
        build: ({ about, since, place }) =>
          about === 'me'
            ? sentences(
                `Bonjour, j’aimerais passer vous voir. ${capitalize(sinceText[since])}, des messages ${placeText[place]} me pèsent et j’ai besoin d’en parler.`,
                'Quand est-ce que je pourrais venir ?',
              )
            : sentences(
                `Bonjour, j’aimerais passer vous voir. Je m’inquiète pour quelqu’un de ma classe qui reçoit des messages blessants ${placeText[place]}, ${sinceText[since]}.`,
                'Est-ce qu’on pourrait en parler ?',
              ),
      },
    ],
  },

  profile: {
    title: 'Moi',
    identity: 'Pas de nom, pas de compte : CyberAid ne te demande rien sur toi.',
    privacyNote: 'Ton espace est séparé de l’espace Parent : tes réponses n’y apparaissent jamais.',
    badges: [
      { id: 'first', label: 'Premier pas', description: 'Ta première mission faite', icon: Footprints, earned: (p) => p.done.length >= 1 },
      { id: 'calm', label: 'Sang-froid', description: 'Ne pas répondre à chaud', icon: Wind, earned: (p) => p.done.includes('y-calm') },
      {
        id: 'proof',
        label: 'Preuves à l’abri',
        description: 'Garder des traces',
        icon: FolderLock,
        earned: (p) => p.done.includes('y-screens') || p.done.includes('y-w-proof'),
      },
      { id: 'relay', label: 'Le lien', description: 'Un message d’aide préparé', icon: Send, earned: (p) => p.messageCopied },
      { id: 'all', label: 'Kit complet', description: 'Les 5 réflexes d’une piste', icon: Waves, earned: (p) => p.tracksComplete >= 1 },
    ],
  },

  helpLines: [LINE_3018, LINE_119, LINE_112],

  labels: {
    nav: { home: 'Accueil', checkup: 'Check-up', missions: 'Missions', message: 'Message', profile: 'Moi', situations: 'Situations', guides: 'Guides applis' },
    quickExit: 'Quitter vite',
    continue: 'Continuer',
    back: 'Retour',
    leave: 'Quitter',
  },
}
