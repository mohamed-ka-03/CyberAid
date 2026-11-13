import { Users, AtSign, Gamepad2, ImageOff, Smartphone, Camera, School } from 'lucide-react'
import type { Scenario } from './types'

/**
 * Mises en situation. Aucune réponse n’est enregistrée : le parcours vit
 * uniquement dans l’écran et disparaît quand on le quitte.
 * Le ton reste non culpabilisant : on explique ce qui risque de se passer,
 * on ne note pas.
 */

export const youngScenarios: Scenario[] = [
  {
    id: 'groupe-de-classe',
    title: 'Le groupe de classe',
    summary: 'Une photo de Léa tourne avec des moqueries. Tout le monde rigole.',
    place: 'Groupe de classe',
    icon: Users,
    steps: [
      {
        narration: 'Il est 21 h. Dans le groupe de ta classe, quelqu’un poste une photo de Léa prise en cours, avec un dessin moqueur par-dessus.',
        chat: [
          { from: 'Tom', text: '[photo] mdr regardez la tête 💀' },
          { from: 'Inès', text: 'JPP 😂😂', meta: '😂 14' },
          { from: 'Yanis', text: 'qqn l’envoie à la 4e C ?' },
        ],
        question: 'Tu fais quoi ?',
        choices: [
          {
            id: 'laugh',
            label: 'Je mets un 😂 pour ne pas être mis·e à l’écart',
            tone: 'risky',
            outcome: 'Chaque réaction donne de la visibilité à la photo et montre aux auteurs que « ça marche ». Pour Léa, c’est une personne de plus contre elle.',
          },
          {
            id: 'proof',
            label: 'Je ne réagis pas, je fais une capture et je signale le message',
            tone: 'good',
            outcome: 'Tu ne donnes pas de public à la moquerie et tu gardes une trace. Le signalement est anonyme : personne ne saura que c’est toi.',
          },
          {
            id: 'call-out',
            label: 'J’écris dans le groupe : « C’est nul ce que vous faites »',
            tone: 'mixed',
            outcome: 'C’est courageux, et parfois ça calme tout le monde. Mais ça peut aussi retourner le groupe contre toi. Fais-le seulement si tu te sens en sécurité.',
          },
          {
            id: 'leave',
            label: 'Je quitte le groupe sans rien dire',
            tone: 'mixed',
            outcome: 'Tu te protèges, c’est légitime. Mais Léa reste seule face à ça : pense à faire une capture avant de partir pour pouvoir prévenir un adulte.',
          },
        ],
      },
      {
        narration: 'Le lendemain, Léa n’est pas venue en cours. La photo a été partagée dans d’autres classes.',
        question: 'Qu’est-ce que tu peux faire maintenant ?',
        choices: [
          {
            id: 'support',
            label: 'Je lui écris en privé : « Je trouve ça pas ok, je suis là si tu veux »',
            tone: 'good',
            outcome: 'Pour Léa, savoir qu’une seule personne est de son côté change beaucoup. Tu n’as pas besoin d’en faire plus pour aider.',
          },
          {
            id: 'adult',
            label: 'Je montre mes captures à un adulte de confiance (CPE, prof…)',
            tone: 'good',
            outcome: 'Un adulte peut faire retirer la photo et protéger Léa. Tu peux demander que ton nom ne soit pas cité. Ce n’est pas « balancer », c’est aider.',
          },
          {
            id: 'wait',
            label: 'J’attends, ça va se tasser tout seul',
            tone: 'risky',
            outcome: 'Le harcèlement se tasse rarement tout seul : il a tendance à grossir tant que personne n’intervient.',
          },
        ],
      },
    ],
    takeaways: [
      'Ne pas réagir, c’est déjà retirer du public aux moqueries.',
      'Un message privé de soutien peut beaucoup.',
      'Prévenir un adulte n’est pas « balancer » : tu peux rester anonyme.',
    ],
    next: { label: 'Voir les réflexes du témoin', to: 'missions', track: 'witness' },
  },
  {
    id: 'compte-anonyme',
    title: 'Le compte anonyme',
    summary: 'Un compte inconnu publie des rumeurs sur toi.',
    place: 'Réseau social',
    icon: AtSign,
    steps: [
      {
        narration: 'Un compte « @verites_du_college » vient de publier une story avec ton prénom et une rumeur inventée. Des gens de ton collège la partagent.',
        chat: [
          { from: '@verites_du_college', text: 'Devinez qui a encore menti à tout le monde 👀', meta: '👁 87 vues' },
          { from: 'Commentaire', text: 'trop vrai 😭' },
        ],
        question: 'Ta première réaction ?',
        choices: [
          {
            id: 'reply',
            label: 'Je réponds en commentaire pour me défendre',
            tone: 'risky',
            outcome: 'C’est normal d’avoir envie de te défendre. Mais répondre à chaud donne souvent ce que cherche le compte : de l’attention et une réaction à moquer.',
          },
          {
            id: 'screens',
            label: 'Je fais des captures avec le nom du compte et la date',
            tone: 'good',
            outcome: 'Les stories disparaissent en 24 h. Tes captures prouvent ce qui s’est passé, même si le compte supprime tout.',
          },
          {
            id: 'delete-all',
            label: 'Je supprime tous mes réseaux',
            tone: 'mixed',
            outcome: 'Faire une pause peut te faire du bien. Mais ça n’arrête pas forcément le compte, et tu risques de perdre des preuves. Fais d’abord tes captures.',
          },
        ],
      },
      {
        narration: 'Une semaine plus tard, le compte continue avec de nouvelles publications.',
        question: 'Et ensuite ?',
        choices: [
          {
            id: 'report-tell',
            label: 'Je signale le compte et j’en parle à un adulte ou au 3018',
            tone: 'good',
            outcome: 'Le 3018 est gratuit et anonyme, et il peut demander aux plateformes de supprimer le compte rapidement. Un adulte peut aussi prévenir le collège.',
          },
          {
            id: 'revenge',
            label: 'Je crée un faux compte pour me venger',
            tone: 'risky',
            outcome: 'Tu risques de te retrouver toi aussi accusé·e de harcèlement, et ça peut faire durer la situation. Tu mérites mieux que ça.',
          },
          {
            id: 'alone',
            label: 'Je garde ça pour moi, j’ai honte',
            tone: 'risky',
            outcome: 'La honte est un sentiment très courant, mais ce n’est pas toi qui as fait quelque chose de mal. Garder tout pour toi rend les choses plus lourdes.',
          },
        ],
      },
    ],
    takeaways: [
      'D’abord des captures : les stories et les comptes peuvent disparaître.',
      'Le 3018 peut faire supprimer un compte, gratuitement et anonymement.',
      'Ce n’est jamais la faute de la personne visée.',
    ],
    next: { label: 'Voir comment signaler sur mon appli', to: 'guides' },
  },
  {
    id: 'partie-en-ligne',
    title: 'La partie en ligne',
    summary: 'Un joueur t’insulte à chaque partie et menace de te retrouver.',
    place: 'Jeu en ligne',
    icon: Gamepad2,
    steps: [
      {
        narration: 'Depuis plusieurs jours, le même joueur te retrouve dans tes parties. Il t’insulte dans le chat vocal.',
        chat: [
          { from: 'Dark_Zr0', text: 't’es trop nul arrête de jouer' },
          { from: 'Dark_Zr0', text: 'je vais trouver où t’habites tu vas voir' },
        ],
        question: 'Tu fais quoi ?',
        choices: [
          {
            id: 'block',
            label: 'Je fais une capture, puis je le bloque et je le signale dans le jeu',
            tone: 'good',
            outcome: 'Tu coupes le contact et la modération du jeu est prévenue. La capture garde une trace de la menace.',
          },
          {
            id: 'insult',
            label: 'Je l’insulte en retour',
            tone: 'risky',
            outcome: 'Ça peut faire monter la tension, et ton compte risque aussi d’être sanctionné par la modération du jeu.',
          },
          {
            id: 'give-insta',
            label: 'Je lui donne mon Insta pour « régler ça »',
            tone: 'risky',
            outcome: 'Tu lui donnes accès à ta vie privée : photos, amis, parfois ton collège. Ne partage jamais tes autres réseaux avec quelqu’un qui te menace.',
          },
          {
            id: 'mute',
            label: 'Je coupe le chat vocal',
            tone: 'mixed',
            outcome: 'Tu te protèges sur le moment, mais il peut continuer dans tes autres parties. Le bloquer et le signaler est plus efficace.',
          },
        ],
      },
      {
        narration: 'Le joueur a retrouvé ton pseudo sur une autre appli et t’écrit : « Je sais dans quel collège tu es. »',
        question: 'Qu’est-ce que tu fais ?',
        choices: [
          {
            id: 'adult',
            label: 'Je préviens tout de suite un adulte et je garde les messages',
            tone: 'good',
            outcome: 'Une menace, c’est sérieux, même en ligne. Un adulte peut t’aider à prévenir le 3018 ou la police. Si tu te sens en danger maintenant : 17 ou 112.',
          },
          {
            id: 'ignore',
            label: 'Je fais comme si de rien n’était',
            tone: 'risky',
            outcome: 'Tu n’as pas à porter ça seul·e. Les menaces sont interdites par la loi et des adultes peuvent agir.',
          },
          {
            id: 'answer',
            label: 'Je lui demande ce qu’il veut',
            tone: 'risky',
            outcome: 'Engager la conversation peut lui donner plus d’informations sur toi. Mieux vaut ne pas répondre et prévenir un adulte.',
          },
        ],
      },
    ],
    takeaways: [
      'Capture, bloque, signale : dans cet ordre.',
      'Ne donne jamais tes autres réseaux, ton collège ou ton adresse dans un jeu.',
      'Une menace en ligne est sérieuse : préviens un adulte.',
    ],
    next: { label: 'Voir le guide Roblox, Discord…', to: 'guides' },
    sensitive: true,
  },
  {
    id: 'photo-chantage',
    title: 'Le chantage à la photo',
    summary: 'Quelqu’un menace de publier une photo de toi si tu n’obéis pas.',
    place: 'Messages privés',
    icon: ImageOff,
    steps: [
      {
        narration: 'Quelqu’un rencontré en ligne t’écrit qu’il a une photo gênante de toi. Il menace de l’envoyer à ta classe si tu ne lui en envoies pas d’autres.',
        chat: [
          { from: 'Inconnu', text: 'tu as 1h sinon tout le monde la verra' },
          { from: 'Inconnu', text: 'et dis rien à personne' },
        ],
        question: 'Qu’est-ce que tu fais ?',
        choices: [
          {
            id: 'obey',
            label: 'J’envoie ce qu’il demande pour que ça s’arrête',
            tone: 'risky',
            outcome: 'Malheureusement, ça ne s’arrête presque jamais : le chantage continue avec encore plus de pression. Tu n’es pas obligé·e d’obéir.',
          },
          {
            id: 'stop-tell',
            label: 'Je ne réponds plus, je garde les messages et je préviens un adulte ou le 3018',
            tone: 'good',
            outcome: 'C’est exactement ça. Le 3018 peut faire retirer des images très vite, et ce chantage est puni par la loi. Ce n’est pas toi qui es en tort.',
          },
          {
            id: 'pay',
            label: 'Je lui propose de l’argent ou une carte cadeau',
            tone: 'risky',
            outcome: 'Payer ne garantit rien : la personne en redemande souvent. Arrête de répondre et parles-en à un adulte.',
          },
        ],
      },
      {
        narration: 'Il a dit « ne dis rien à personne ». Tu as peur que tes parents soient en colère.',
        question: 'À qui peux-tu en parler ?',
        choices: [
          {
            id: '3018',
            label: 'Au 3018, par téléphone, tchat ou appli',
            tone: 'good',
            outcome: 'C’est gratuit et anonyme. Les écoutants ont l’habitude : ils ne te jugeront pas et peuvent faire supprimer les contenus.',
          },
          {
            id: 'trusted',
            label: 'À un adulte de confiance, même si ce n’est pas un parent',
            tone: 'good',
            outcome: 'Un oncle, une tante, l’infirmière scolaire, un prof : ce qui compte, c’est que tu ne restes pas seul·e avec ça.',
          },
          {
            id: 'nobody',
            label: 'À personne, il a dit de ne rien dire',
            tone: 'risky',
            outcome: '« Ne dis rien » est justement ce que disent ceux qui font du chantage, pour garder le contrôle. En parler, c’est reprendre ce contrôle.',
          },
        ],
      },
    ],
    takeaways: [
      'Ne jamais obéir à un chantage : ça ne l’arrête pas.',
      'Garde les messages, arrête de répondre, bloque après les captures.',
      'Le 3018 peut faire retirer des images : tu n’es pas seul·e.',
    ],
    next: { label: 'Préparer un message pour en parler', to: 'message' },
    sensitive: true,
  },
]

export const parentScenarios: Scenario[] = [
  {
    id: 'enfant-qui-se-ferme',
    title: 'Votre enfant se ferme',
    summary: 'Il sursaute à chaque notification et ne veut plus aller au collège.',
    place: 'À la maison',
    icon: Smartphone,
    steps: [
      {
        narration: 'Depuis deux semaines, votre enfant de 13 ans garde son téléphone à portée de main, se crispe à chaque notification et invente des maux de ventre le matin.',
        question: 'Comment réagissez-vous ?',
        choices: [
          {
            id: 'confiscate',
            label: 'Je confisque le téléphone pour le protéger',
            tone: 'risky',
            outcome: 'Votre intention est protectrice, mais votre enfant risque de le vivre comme une punition et de ne plus rien vous confier. Le harcèlement, lui, continue sans qu’il le voie.',
          },
          {
            id: 'open',
            label: 'Je choisis un moment calme pour poser une question ouverte',
            tone: 'good',
            outcome: 'Un trajet en voiture, une balade : côte à côte, sans face-à-face, la parole vient plus facilement. « J’ai l’impression que quelque chose te pèse. Tu veux m’en parler ? »',
          },
          {
            id: 'spy',
            label: 'Je lis ses messages pendant qu’il dort',
            tone: 'risky',
            outcome: 'S’il le découvre, la confiance sera difficile à rétablir, au moment précis où il en a le plus besoin. Préférez le dialogue.',
          },
          {
            id: 'wait',
            label: 'J’attends, c’est sûrement l’âge',
            tone: 'mixed',
            outcome: 'Ces changements peuvent avoir plusieurs causes, mais plusieurs signaux qui durent méritent qu’on s’y intéresse. Rester disponible, c’est déjà bien ; ouvrir la porte, c’est mieux.',
          },
        ],
      },
      {
        narration: 'Il finit par lâcher : « Y’a des gens qui m’insultent sur Snap. Depuis la rentrée. »',
        question: 'Quelle est votre première phrase ?',
        choices: [
          {
            id: 'why',
            label: '« Pourquoi tu ne m’as rien dit avant ? »',
            tone: 'mixed',
            outcome: 'C’est une réaction naturelle, mais elle peut sonner comme un reproche. Votre enfant risque d’entendre qu’il a mal fait en se taisant.',
          },
          {
            id: 'thanks',
            label: '« Merci de me le dire. Ce n’est pas ta faute. On va trouver une solution ensemble. »',
            tone: 'good',
            outcome: 'Vous le remerciez, vous le déculpabilisez et vous l’associez aux décisions. C’est la base de tout ce qui suivra.',
          },
          {
            id: 'call',
            label: '« J’appelle leurs parents tout de suite. »',
            tone: 'risky',
            outcome: 'Agir sans son accord peut l’exposer davantage et lui donner l’impression de perdre le contrôle. Décidez ensemble des prochaines étapes.',
          },
        ],
      },
    ],
    takeaways: [
      'Plusieurs signaux qui durent méritent d’ouvrir le dialogue.',
      'Confisquer le téléphone peut fermer la porte à la parole.',
      '« Merci de me le dire, ce n’est pas ta faute » : la phrase qui rassure.',
    ],
    next: { label: 'Voir les réflexes « enfant victime »', to: 'missions', track: 'target' },
  },
  {
    id: 'enfant-auteur',
    title: 'Votre enfant participe',
    summary: 'Un parent vous transfère une capture : votre enfant se moque d’un camarade.',
    place: 'Groupe de classe',
    icon: Camera,
    steps: [
      {
        narration: 'Un autre parent vous envoie une capture d’un groupe de classe. On y voit votre enfant relayer des moqueries visant un élève.',
        chat: [{ from: 'Votre enfant', text: 'il pue trop sérieux 😂', meta: '😂 9' }],
        question: 'Comment réagissez-vous ?',
        choices: [
          {
            id: 'minimize',
            label: '« C’est des histoires d’ados, ça va passer »',
            tone: 'risky',
            outcome: 'Pour l’élève visé, ce n’est pas un jeu. Et minimiser risque de laisser croire à votre enfant que ce comportement est acceptable.',
          },
          {
            id: 'talk',
            label: 'J’en parle calmement avec lui pour comprendre son rôle',
            tone: 'good',
            outcome: 'Comprendre avant de sanctionner : a-t-il lancé les moqueries, suivi le groupe, eu peur d’être visé à son tour ? Rappelez aussi que relayer, c’est participer.',
          },
          {
            id: 'punish',
            label: 'Je le punis sévèrement, tout de suite',
            tone: 'mixed',
            outcome: 'Une conséquence peut être nécessaire, mais une sanction sans discussion lui apprend surtout à mieux cacher. Le dialogue d’abord.',
          },
        ],
      },
      {
        narration: 'Votre enfant reconnaît qu’il a « suivi le mouvement » et dit qu’il ne pensait pas que c’était grave.',
        question: 'Que lui proposez-vous ?',
        choices: [
          {
            id: 'repair',
            label: 'Supprimer ses messages, s’excuser et ne plus relayer',
            tone: 'good',
            outcome: 'Réparer, c’est concret : effacer ce qu’il a publié, présenter des excuses sincères à l’élève visé et, s’il le peut, soutenir ce camarade.',
          },
          {
            id: 'law',
            label: 'Lui expliquer que c’est puni par la loi, même entre mineurs',
            tone: 'good',
            outcome: 'Le harcèlement scolaire est un délit, y compris en ligne et pour ceux qui relaient. Le dire sans dramatiser aide à mesurer la gravité.',
          },
          {
            id: 'hide',
            label: 'Ne rien dire au collège pour éviter les ennuis',
            tone: 'mixed',
            outcome: 'Vous protégez votre enfant à court terme, mais l’élève visé a besoin que la situation s’arrête. Vous pouvez contacter l’établissement en montrant que votre enfant s’engage à réparer.',
          },
        ],
      },
    ],
    takeaways: [
      'Relayer ou liker, c’est participer : il faut le dire clairement.',
      'Comprendre avant de sanctionner, puis réparer concrètement.',
      'Le harcèlement scolaire est un délit, même en ligne.',
    ],
    next: { label: 'Voir les réflexes « enfant témoin »', to: 'missions', track: 'witness' },
  },
  {
    id: 'rendez-vous-ecole',
    title: 'Le rendez-vous au collège',
    summary: '« Ça se passe en dehors des cours, on ne peut rien faire. »',
    place: 'Au collège',
    icon: School,
    steps: [
      {
        narration: 'Lors du rendez-vous, on vous répond que les messages sont envoyés le soir, sur les réseaux : « Ça ne relève pas de l’établissement. »',
        question: 'Que faites-vous ?',
        choices: [
          {
            id: 'accept',
            label: 'J’accepte, ils ont sûrement raison',
            tone: 'risky',
            outcome: 'Le harcèlement entre élèves concerne l’établissement même quand il continue en ligne, en dehors des cours. Ne renoncez pas.',
          },
          {
            id: 'insist',
            label: 'Je rappelle calmement leur rôle et je demande un suivi par écrit',
            tone: 'good',
            outcome: 'Restez factuel : dates, captures, impact sur votre enfant. Demandez le protocole de lutte contre le harcèlement de l’établissement et confirmez l’échange par écrit.',
          },
          {
            id: 'confront',
            label: 'Je vais attendre les élèves concernés à la sortie',
            tone: 'risky',
            outcome: 'Une confrontation peut se retourner contre vous et contre votre enfant. Passez par l’établissement et les canaux officiels.',
          },
        ],
      },
      {
        narration: 'Quinze jours plus tard, rien n’a changé. Les messages continuent.',
        question: 'Quelle est la suite ?',
        choices: [
          {
            id: '3020',
            label: 'J’appelle le 3020 ou le 3018 pour être conseillé',
            tone: 'good',
            outcome: 'Le 3020 fait le lien avec l’Éducation nationale ; le 3018 peut faire supprimer des contenus en ligne. Les deux sont gratuits.',
          },
          {
            id: 'complaint',
            label: 'Je me renseigne pour déposer plainte avec les preuves',
            tone: 'good',
            outcome: 'C’est possible au commissariat ou à la gendarmerie, avec les captures datées. Le 3018 peut vous aider à préparer la démarche.',
          },
          {
            id: 'change-school',
            label: 'Je change mon enfant d’établissement, sans prévenir personne',
            tone: 'mixed',
            outcome: 'C’est parfois la bonne solution, mais pas seul·e et pas dans l’urgence : le harcèlement en ligne peut suivre votre enfant. Parlez-en d’abord avec lui et avec un conseiller.',
          },
        ],
      },
    ],
    takeaways: [
      'Le harcèlement entre élèves concerne l’établissement, même en ligne.',
      'Restez factuel et gardez une trace écrite de chaque échange.',
      'Le 3020 et le 3018 peuvent vous conseiller gratuitement.',
    ],
    next: { label: 'Préparer le message à l’établissement', to: 'message' },
  },
]
