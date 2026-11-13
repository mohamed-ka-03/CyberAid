import type { PlatformGuide } from './types'

/**
 * Guides pas à pas, écrits à l’infinitif pour convenir aux deux espaces.
 * Les noms de menus évoluent avec les mises à jour : chaque guide renvoie
 * vers l’aide officielle de la plateforme. À relire avant une mise en production.
 */
export const platformGuides: PlatformGuide[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    kind: 'Photos, stories, messages',
    sections: [
      {
        kind: 'block',
        steps: [
          'Ouvrir le profil du compte',
          'Appuyer sur les trois points ••• en haut à droite',
          'Choisir « Bloquer »',
          'Cocher « Bloquer aussi les nouveaux comptes qu’il pourrait créer » si l’option apparaît',
        ],
      },
      {
        kind: 'report',
        steps: [
          'Sur une publication : appuyer sur ••• puis « Signaler »',
          'Sur un message : rester appuyé dessus, puis « Signaler »',
          'Sur un profil : ••• puis « Signaler »',
          'Choisir le motif « Harcèlement ou intimidation »',
        ],
      },
      {
        kind: 'protect',
        steps: [
          'Passer en compte privé : Profil → menu ☰ → « Confidentialité du compte »',
          'Utiliser « Restreindre » : ses commentaires ne sont visibles que par lui, sans qu’il le sache',
          'Activer les « Mots masqués » pour filtrer les commentaires et messages blessants',
          'Choisir qui peut mentionner ou identifier le compte dans « Paramètres → Interactions »',
        ],
      },
    ],
    notes: ['La personne bloquée ou signalée n’est pas prévenue.', 'Restreindre est utile quand bloquer risque d’envenimer les choses.'],
    help: 'https://help.instagram.com/',
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    kind: 'Snaps, chat, stories',
    sections: [
      {
        kind: 'block',
        steps: [
          'Rester appuyé sur le nom de la personne dans le chat',
          'Choisir « Gérer l’amitié »',
          'Appuyer sur « Bloquer »',
        ],
      },
      {
        kind: 'report',
        steps: [
          'Sur un snap ou une story : rester appuyé, puis « Signaler »',
          'Sur un compte : nom → « Gérer l’amitié » → « Signaler »',
          'Choisir le motif qui correspond, par exemple « Harcèlement »',
        ],
      },
      {
        kind: 'protect',
        steps: [
          'Profil → ⚙ Paramètres → « Me contacter » : choisir « Mes amis »',
          'Dans les mêmes réglages, limiter « Voir ma story » aux amis',
          'Sur la Snap Map, activer le « Mode fantôme » pour masquer la position',
        ],
      },
    ],
    notes: [
      'Les messages peuvent disparaître : faire des captures avant de bloquer.',
      'Snapchat indique parfois qu’une capture a été faite. Si c’est un souci, un adulte peut photographier l’écran avec un autre appareil.',
    ],
    help: 'https://help.snapchat.com/',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    kind: 'Vidéos, commentaires, lives',
    sections: [
      {
        kind: 'block',
        steps: ['Ouvrir le profil du compte', 'Appuyer sur l’icône de partage ou ••• en haut à droite', 'Choisir « Bloquer »'],
      },
      {
        kind: 'report',
        steps: [
          'Sur une vidéo : rester appuyé, puis « Signaler »',
          'Sur un commentaire : rester appuyé dessus, puis « Signaler »',
          'Choisir « Harcèlement et intimidation »',
        ],
      },
      {
        kind: 'protect',
        steps: [
          'Profil → menu ☰ → « Paramètres et confidentialité » → « Confidentialité » → « Compte privé »',
          'Dans « Commentaires », filtrer les mots-clés ou limiter aux amis',
          'Limiter les messages directs aux amis, ou les désactiver',
          'Désactiver Duo et Collage sur ses vidéos',
        ],
      },
    ],
    notes: ['Les comptes des moins de 16 ans sont privés par défaut.', 'On peut supprimer plusieurs commentaires ou bloquer leurs auteurs d’un coup en restant appuyé sur un commentaire.'],
    help: 'https://support.tiktok.com/',
  },
  {
    id: 'discord',
    name: 'Discord',
    kind: 'Serveurs, salons, messages privés',
    sections: [
      {
        kind: 'block',
        steps: ['Appuyer sur le pseudo ou la photo de la personne', 'Ouvrir le menu ••• de son profil', 'Choisir « Bloquer »'],
      },
      {
        kind: 'report',
        steps: [
          'Rester appuyé sur le message (ou clic droit sur ordinateur)',
          'Choisir « Signaler le message »',
          'Prévenir aussi les modérateurs du serveur s’il y en a',
        ],
      },
      {
        kind: 'protect',
        steps: [
          'Paramètres utilisateur → « Contenu et social » (ou « Confidentialité ») : désactiver les messages privés des membres des serveurs',
          'Limiter les demandes d’ami à « Amis d’amis »',
          'Quitter un serveur où l’ambiance devient blessante',
        ],
      },
    ],
    notes: ['Bloquer masque les messages de la personne et l’empêche d’écrire en privé.'],
    help: 'https://support.discord.com/',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    kind: 'Messages, groupes',
    sections: [
      {
        kind: 'block',
        steps: ['Ouvrir la discussion', 'Appuyer sur le nom du contact en haut', 'Faire défiler et choisir « Bloquer »'],
      },
      {
        kind: 'report',
        steps: [
          'Sur un message : rester appuyé, puis « Signaler »',
          'Sur un contact ou un groupe : ouvrir ses infos → « Signaler »',
          'L’option « Signaler et bloquer » fait les deux en même temps',
        ],
      },
      {
        kind: 'protect',
        steps: [
          'Paramètres → « Confidentialité » → « Groupes » : choisir qui peut ajouter le compte à un groupe',
          'Quitter un groupe : infos du groupe → « Quitter le groupe »',
          'Masquer la photo de profil et le statut aux inconnus',
        ],
      },
    ],
    notes: ['Avant de quitter un groupe, faire des captures : on perd l’accès aux nouveaux messages.'],
    help: 'https://faq.whatsapp.com/',
  },
  {
    id: 'roblox',
    name: 'Roblox',
    kind: 'Jeu en ligne, chat',
    sections: [
      {
        kind: 'block',
        steps: [
          'En jeu : ouvrir le menu (logo Roblox en haut à gauche)',
          'Dans la liste des joueurs, appuyer sur la personne',
          'Choisir « Bloquer »',
          'Hors jeu : depuis son profil → ••• → « Bloquer »',
        ],
      },
      {
        kind: 'report',
        steps: ['En jeu : menu → onglet « Signaler » (drapeau)', 'Choisir le joueur et le motif', 'Hors jeu : profil → ••• → « Signaler un abus »'],
      },
      {
        kind: 'protect',
        steps: [
          'Paramètres → « Confidentialité » : limiter qui peut discuter',
          'Limiter qui peut envoyer des messages ou rejoindre en jeu',
          'Les parents peuvent activer les contrôles parentaux depuis leur propre compte',
        ],
      },
    ],
    notes: ['Ne jamais donner ses autres réseaux, son école ou son adresse dans le chat d’un jeu.'],
    help: 'https://en.help.roblox.com/',
  },
]

export const guideSectionLabels: Record<'block' | 'report' | 'protect', { young: string; parent: string }> = {
  block: { young: 'Bloquer', parent: 'Bloquer un compte' },
  report: { young: 'Signaler', parent: 'Signaler un contenu' },
  protect: { young: 'Protéger ton compte', parent: 'Protéger le compte' },
}
